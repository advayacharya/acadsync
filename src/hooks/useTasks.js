import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import {
  getCachedTasks,
  saveTasksToCache,
  saveTaskToCache,
  deleteTaskFromCache,
  getQueue
} from '../services/storage';
import {
  subscribeSyncState,
  queueTaskOperation,
  flushSyncQueue,
  addTombstone,
  isTombstoned
} from '../services/offlineSync';

const shouldKeepTask = (task) => {
  if (!task || !task.subject) return false;

  const text = task.subject.toLowerCase();
  if (/happy birthday|birthday|anniversary|celebration|yearly|annual/.test(text)) {
    return false;
  }

  const deadline = task.deadline ? new Date(task.deadline) : null;
  if (!deadline || Number.isNaN(deadline.getTime())) {
    return false;
  }

  return deadline.getFullYear() === new Date().getFullYear();
};

export function useTasks(user, onUnauthorized) {
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [syncState, setSyncState] = useState({
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    isSyncing: false,
    pendingQueueCount: 0
  });

  // Subscribe to offline sync state changes
  useEffect(() => {
    const unsubscribe = subscribeSyncState((state) => {
      setSyncState(state);
    });
    return unsubscribe;
  }, []);

  // Initial load from local IndexedDB cache for instant render
  useEffect(() => {
    let isMounted = true;
    getCachedTasks().then((cached) => {
      if (isMounted && Array.isArray(cached) && cached.length > 0) {
        const filtered = cached.filter(shouldKeepTask).filter((t) => !isTombstoned(t.id));
        setTasks(filtered);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchTasks = useCallback(async () => {
    if (!localStorage.getItem('token')) return;

    // Load local cache first
    const cached = await getCachedTasks();
    if (Array.isArray(cached) && cached.length > 0) {
      setTasks(cached.filter(shouldKeepTask).filter((t) => !isTombstoned(t.id)));
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      // If offline, stop here with cached tasks
      return;
    }

    try {
      setTaskError('');
      setIsLoadingTasks(true);

      // Attempt server fetch
      const remoteData = await api.getTasks();
      const remoteNormalized = Array.isArray(remoteData)
        ? remoteData
            .map((task) => ({ ...task, id: String(task._id || task.id) }))
            .filter(shouldKeepTask)
            .filter((t) => !isTombstoned(t.id))
        : [];

      // Reconcile remote state with pending local mutations
      const queue = await getQueue();
      const pendingTempTasks = (await getCachedTasks()).filter(
        (t) => String(t.id).startsWith('temp-') && !isTombstoned(t.id)
      );

      const reconciledMap = new Map();

      // 1. Add remote tasks
      remoteNormalized.forEach((t) => {
        reconciledMap.set(t.id, t);
      });

      // 2. Preserve un-synced temp tasks
      pendingTempTasks.forEach((t) => {
        reconciledMap.set(t.id, t);
      });

      // 3. Apply pending queued updates locally over remote tasks
      queue.forEach((op) => {
        if (op.action === 'UPDATE' && op.targetId && reconciledMap.has(op.targetId)) {
          const current = reconciledMap.get(op.targetId);
          reconciledMap.set(op.targetId, { ...current, ...op.payload });
        } else if (op.action === 'DELETE' && op.targetId) {
          reconciledMap.delete(op.targetId);
        }
      });

      const finalTasks = Array.from(reconciledMap.values()).filter(shouldKeepTask);
      setTasks(finalTasks);
      await saveTasksToCache(finalTasks);

      // Trigger queue flush if any pending ops remain
      if (queue.length > 0) {
        flushSyncQueue((updatedTasks) => {
          setTasks(updatedTasks.filter(shouldKeepTask).filter((t) => !isTombstoned(t.id)));
        });
      }
    } catch (err) {
      console.error('Fetch tasks error:', err);
      // If network error, rely on cached tasks
      if (err.unauthorized && onUnauthorized) {
        onUnauthorized();
      } else if (!navigator.onLine || err.status === 0 || err.message === 'Failed to fetch') {
        // Network offline error, load cached
        const fallback = await getCachedTasks();
        setTasks(fallback.filter(shouldKeepTask).filter((t) => !isTombstoned(t.id)));
      } else {
        setTaskError(err.error || 'Failed to load tasks');
      }
    } finally {
      setIsLoadingTasks(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  const saveTask = async (editingTask, taskData) => {
    try {
      setTaskError('');
      let syncStatus = { success: true, error: null, offline: false };
      const now = Date.now();

      const isEditing = Boolean(editingTask && editingTask.id);
      const taskId = isEditing
        ? String(editingTask.id)
        : `temp-${now}-${Math.random().toString(36).substring(2, 7)}`;

      const localTask = {
        ...(editingTask || {}),
        ...taskData,
        id: taskId,
        updatedAt: now
      };

      // Optimistically update UI & cache immediately
      setTasks((prev) => {
        const index = prev.findIndex((t) => String(t.id) === taskId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = localTask;
          return updated;
        }
        return [localTask, ...prev];
      });
      await saveTaskToCache(localTask);

      const isOfflineNow = typeof navigator !== 'undefined' && !navigator.onLine;

      if (isOfflineNow) {
        // Queue operation offline
        await queueTaskOperation(isEditing ? 'UPDATE' : 'CREATE', taskId, localTask);
        return { success: true, offline: true };
      }

      // Online: attempt direct server save
      try {
        let response;
        if (isEditing && !taskId.startsWith('temp-')) {
          response = await api.updateTask(taskId, localTask);
        } else {
          response = await api.createTask(taskData);
        }

        if (response && response.googleSync) {
          syncStatus = response.googleSync;
        }

        const serverTask = response.task || response;
        if (serverTask && (serverTask._id || serverTask.id)) {
          const realId = String(serverTask._id || serverTask.id);
          const finalTask = { ...localTask, ...serverTask, id: realId };
          
          if (taskId !== realId) {
            await deleteTaskFromCache(taskId);
            setTasks((prev) => prev.map((t) => (String(t.id) === taskId ? finalTask : t)));
          }
          await saveTaskToCache(finalTask);
        } else {
          await fetchTasks();
        }

        return syncStatus;
      } catch (networkErr) {
        // Queue operation if network request failed due to connectivity
        if (networkErr.unauthorized) {
          if (onUnauthorized) onUnauthorized();
          throw networkErr;
        }
        console.warn('Network error saving task, queueing operation offline:', networkErr);
        await queueTaskOperation(isEditing ? 'UPDATE' : 'CREATE', taskId, localTask);
        return { success: true, offline: true };
      }
    } catch (err) {
      console.error('Save task error:', err);
      setTaskError(err.error || 'Could not save task');
      throw err;
    }
  };

  const deleteTask = async (id) => {
    const targetId = String(id);
    try {
      setTaskError('');
      addTombstone(targetId);

      // Optimistic update
      setTasks((prev) => prev.filter((t) => String(t.id) !== targetId));
      await deleteTaskFromCache(targetId);

      const isOfflineNow = typeof navigator !== 'undefined' && !navigator.onLine;

      if (isOfflineNow || targetId.startsWith('temp-')) {
        await queueTaskOperation('DELETE', targetId, null);
        return;
      }

      try {
        await api.deleteTask(targetId);
      } catch (err) {
        if (err.unauthorized && onUnauthorized) {
          onUnauthorized();
          return;
        }
        console.warn('Network error deleting task, queueing delete offline:', err);
        await queueTaskOperation('DELETE', targetId, null);
      }
    } catch (err) {
      console.error('Delete task error:', err);
      setTaskError(err.error || 'Could not delete task');
    }
  };

  const toggleTaskStatus = async (id) => {
    const targetId = String(id);
    try {
      setTaskError('');
      const task = tasks.find((t) => String(t.id) === targetId);
      if (!task) return;

      const updatedStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      const updatedTask = { ...task, status: updatedStatus, updatedAt: Date.now() };

      // Optimistic update
      setTasks((prev) => prev.map((t) => (String(t.id) === targetId ? updatedTask : t)));
      await saveTaskToCache(updatedTask);

      const isOfflineNow = typeof navigator !== 'undefined' && !navigator.onLine;

      if (isOfflineNow || targetId.startsWith('temp-')) {
        await queueTaskOperation('UPDATE', targetId, { status: updatedStatus });
        return;
      }

      try {
        await api.updateTask(targetId, { ...task, status: updatedStatus });
      } catch (err) {
        if (err.unauthorized && onUnauthorized) {
          onUnauthorized();
          return;
        }
        console.warn('Network error toggling task status, queueing update offline:', err);
        await queueTaskOperation('UPDATE', targetId, { status: updatedStatus });
      }
    } catch (err) {
      console.error('Toggle task status error:', err);
      setTaskError(err.error || 'Could not update task status');
    }
  };

  const syncQueuedTasks = useCallback(() => {
    flushSyncQueue((updatedTasks) => {
      setTasks(updatedTasks.filter(shouldKeepTask).filter((t) => !isTombstoned(t.id)));
    });
  }, []);

  return {
    tasks,
    isLoadingTasks,
    taskError,
    fetchTasks,
    saveTask,
    deleteTask,
    toggleTaskStatus,
    setTaskError,
    isOffline: syncState.isOffline,
    isSyncing: syncState.isSyncing,
    pendingQueueCount: syncState.pendingQueueCount,
    syncQueuedTasks
  };
}
