import api from './api';
import {
  getQueue,
  enqueueOperation,
  dequeueOperation,
  updateQueueOperation,
  getCachedTasks,
  saveTaskToCache,
  deleteTaskFromCache,
  saveQueue
} from './storage';

let isOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false;
let isSyncing = false;
let listeners = new Set();
const tombstones = new Set();

function notifyListeners() {
  getQueue().then((q) => {
    const count = q.length;
    const state = { isOffline, isSyncing, pendingQueueCount: count };
    listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (err) {
        console.error('Error notifying sync listener:', err);
      }
    });
  });
}

export function subscribeSyncState(fn) {
  listeners.add(fn);
  notifyListeners();
  return () => {
    listeners.delete(fn);
  };
}

export function getSyncState() {
  return { isOffline, isSyncing };
}

export function addTombstone(id) {
  if (id) tombstones.add(String(id));
}

export function isTombstoned(id) {
  return id ? tombstones.has(String(id)) : false;
}

// Map temporary IDs created offline to actual backend IDs
const idMappings = new Map();

export function resolveTaskId(id) {
  let current = String(id);
  while (idMappings.has(current)) {
    current = idMappings.get(current);
  }
  return current;
}

/**
 * Enqueue a task operation for sync
 * @param {'CREATE'|'UPDATE'|'DELETE'} action
 * @param {string} targetId
 * @param {object} payload
 */
export async function queueTaskOperation(action, targetId, payload) {
  const opId = `op-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const op = {
    opId,
    action,
    targetId: targetId ? String(targetId) : null,
    payload,
    createdAt: Date.now(),
    retryCount: 0,
    lastError: null
  };

  await enqueueOperation(op);
  notifyListeners();
  return opId;
}

/**
 * Process pending mutation queue sequentially
 */
export async function flushSyncQueue(onTasksUpdated) {
  if (isSyncing || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return;
  }

  const queue = await getQueue();
  if (queue.length === 0) {
    notifyListeners();
    return;
  }

  isSyncing = true;
  notifyListeners();

  try {
    const cachedTasks = await getCachedTasks();
    let tasksMap = new Map(cachedTasks.map((t) => [String(t.id), { ...t }]));
    let tasksChanged = false;

    for (const op of queue) {
      try {
        if (op.action === 'CREATE') {
          // Send create to server
          const realTask = await api.createTask(op.payload);
          const serverId = String(realTask._id || realTask.id);
          const tempId = String(op.targetId);

          if (tempId && tempId.startsWith('temp-')) {
            idMappings.set(tempId, serverId);
            // Replace in cache
            if (tasksMap.has(tempId)) {
              const localTask = tasksMap.get(tempId);
              tasksMap.delete(tempId);
              await deleteTaskFromCache(tempId);
              const updatedTask = { ...localTask, ...realTask, id: serverId };
              tasksMap.set(serverId, updatedTask);
              await saveTaskToCache(updatedTask);
              tasksChanged = true;
            }
          } else {
            const updatedTask = { ...realTask, id: serverId };
            tasksMap.set(serverId, updatedTask);
            await saveTaskToCache(updatedTask);
            tasksChanged = true;
          }
          await dequeueOperation(op.opId);
        } else if (op.action === 'UPDATE') {
          const resolvedId = resolveTaskId(op.targetId);
          // If task was deleted locally via tombstone or prior op, skip update
          if (isTombstoned(resolvedId) || !resolvedId) {
            await dequeueOperation(op.opId);
            continue;
          }

          // If target is still a temp id that failed create, skip for now
          if (resolvedId.startsWith('temp-')) {
            continue;
          }

          const response = await api.updateTask(resolvedId, op.payload);
          if (response) {
            const serverTask = response.task || response;
            const updatedId = String(serverTask._id || serverTask.id || resolvedId);
            const merged = { ...tasksMap.get(updatedId), ...serverTask, id: updatedId };
            tasksMap.set(updatedId, merged);
            await saveTaskToCache(merged);
            tasksChanged = true;
          }
          await dequeueOperation(op.opId);
        } else if (op.action === 'DELETE') {
          const resolvedId = resolveTaskId(op.targetId);
          addTombstone(resolvedId);

          if (!resolvedId.startsWith('temp-')) {
            try {
              await api.deleteTask(resolvedId);
            } catch (err) {
              // If 404, it was already deleted on server, so treat as success
              if (err.status !== 404) {
                throw err;
              }
            }
          }
          tasksMap.delete(resolvedId);
          await deleteTaskFromCache(resolvedId);
          tasksChanged = true;
          await dequeueOperation(op.opId);
        }
      } catch (err) {
        console.error(`Sync operation ${op.opId} (${op.action}) failed:`, err);
        op.retryCount = (op.retryCount || 0) + 1;
        op.lastError = err.error || err.message || 'Sync error';

        if (err.unauthorized) {
          // Stop queue processing on auth failure
          break;
        }

        if (op.retryCount >= 5) {
          // Remove dead letter after 5 retries
          await dequeueOperation(op.opId);
        } else {
          await updateQueueOperation(op);
          // Delay before next attempt
          break;
        }
      }
    }

    if (tasksChanged && typeof onTasksUpdated === 'function') {
      onTasksUpdated(Array.from(tasksMap.values()));
    }
  } finally {
    isSyncing = false;
    notifyListeners();
  }
}

// Global window connectivity listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOffline = false;
    notifyListeners();
    flushSyncQueue();
  });

  window.addEventListener('offline', () => {
    isOffline = true;
    notifyListeners();
  });
}
