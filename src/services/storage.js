// IndexedDB Storage Layer for AcadSync Offline Mode
const DB_NAME = 'AcadSyncOfflineDB';
const DB_VERSION = 1;

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('IndexedDB not supported in this environment');
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('tasks')) {
        db.createObjectStore('tasks', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('queue')) {
        db.createObjectStore('queue', { keyPath: 'opId' });
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (err) => {
      console.error('IndexedDB open error:', err);
      resolve(null); // Fallback gracefully if DB fails
    };
  });

  return dbPromise;
}

// Fallback to localStorage if IndexedDB is unavailable
const fallbackStorage = {
  tasks: 'acadsync_cached_tasks',
  queue: 'acadsync_pending_queue',
  meta: 'acadsync_offline_meta',

  getItem(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setItem(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {
      console.error('localStorage set item error:', err);
    }
  }
};

export async function getCachedTasks() {
  const db = await openDB();
  if (!db) {
    return fallbackStorage.getItem(fallbackStorage.tasks) || [];
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('tasks', 'readonly');
      const store = tx.objectStore('tasks');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve(fallbackStorage.getItem(fallbackStorage.tasks) || []);
    } catch (err) {
      console.error('getCachedTasks error:', err);
      resolve([]);
    }
  });
}

export async function saveTasksToCache(tasks) {
  if (!Array.isArray(tasks)) return;
  const db = await openDB();
  if (!db) {
    fallbackStorage.setItem(fallbackStorage.tasks, tasks);
    return;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('tasks', 'readwrite');
      const store = tx.objectStore('tasks');
      store.clear();
      tasks.forEach((t) => {
        if (t && t.id) store.put(t);
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => {
        fallbackStorage.setItem(fallbackStorage.tasks, tasks);
        resolve();
      };
    } catch (err) {
      console.error('saveTasksToCache error:', err);
      fallbackStorage.setItem(fallbackStorage.tasks, tasks);
      resolve();
    }
  });
}

export async function saveTaskToCache(task) {
  if (!task || !task.id) return;
  const db = await openDB();
  if (!db) {
    const tasks = fallbackStorage.getItem(fallbackStorage.tasks) || [];
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index >= 0) tasks[index] = task;
    else tasks.push(task);
    fallbackStorage.setItem(fallbackStorage.tasks, tasks);
    return;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('tasks', 'readwrite');
      const store = tx.objectStore('tasks');
      store.put(task);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch (err) {
      console.error('saveTaskToCache error:', err);
      resolve();
    }
  });
}

export async function deleteTaskFromCache(id) {
  if (!id) return;
  const db = await openDB();
  if (!db) {
    const tasks = fallbackStorage.getItem(fallbackStorage.tasks) || [];
    const filtered = tasks.filter((t) => t.id !== id);
    fallbackStorage.setItem(fallbackStorage.tasks, filtered);
    return;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('tasks', 'readwrite');
      const store = tx.objectStore('tasks');
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch (err) {
      console.error('deleteTaskFromCache error:', err);
      resolve();
    }
  });
}

export async function getQueue() {
  const db = await openDB();
  if (!db) {
    return fallbackStorage.getItem(fallbackStorage.queue) || [];
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('queue', 'readonly');
      const store = tx.objectStore('queue');
      const req = store.getAll();
      req.onsuccess = () => {
        const res = req.result || [];
        // Sort by createdAt ascending
        res.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        resolve(res);
      };
      req.onerror = () => resolve(fallbackStorage.getItem(fallbackStorage.queue) || []);
    } catch (err) {
      console.error('getQueue error:', err);
      resolve([]);
    }
  });
}

export async function enqueueOperation(operation) {
  if (!operation || !operation.opId) return;
  const db = await openDB();
  if (!db) {
    const queue = fallbackStorage.getItem(fallbackStorage.queue) || [];
    queue.push(operation);
    fallbackStorage.setItem(fallbackStorage.queue, queue);
    return;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('queue', 'readwrite');
      const store = tx.objectStore('queue');
      store.put(operation);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch (err) {
      console.error('enqueueOperation error:', err);
      resolve();
    }
  });
}

export async function updateQueueOperation(operation) {
  return enqueueOperation(operation);
}

export async function dequeueOperation(opId) {
  if (!opId) return;
  const db = await openDB();
  if (!db) {
    const queue = fallbackStorage.getItem(fallbackStorage.queue) || [];
    const filtered = queue.filter((item) => item.opId !== opId);
    fallbackStorage.setItem(fallbackStorage.queue, filtered);
    return;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('queue', 'readwrite');
      const store = tx.objectStore('queue');
      store.delete(opId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch (err) {
      console.error('dequeueOperation error:', err);
      resolve();
    }
  });
}

export async function saveQueue(queue) {
  const db = await openDB();
  if (!db) {
    fallbackStorage.setItem(fallbackStorage.queue, queue);
    return;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('queue', 'readwrite');
      const store = tx.objectStore('queue');
      store.clear();
      queue.forEach((item) => {
        if (item && item.opId) store.put(item);
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch (err) {
      console.error('saveQueue error:', err);
      resolve();
    }
  });
}

export async function getMeta(key) {
  const db = await openDB();
  if (!db) {
    const meta = fallbackStorage.getItem(fallbackStorage.meta) || {};
    return meta[key];
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('meta', 'readonly');
      const store = tx.objectStore('meta');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => resolve(null);
    } catch (err) {
      console.error('getMeta error:', err);
      resolve(null);
    }
  });
}

export async function setMeta(key, value) {
  const db = await openDB();
  if (!db) {
    const meta = fallbackStorage.getItem(fallbackStorage.meta) || {};
    meta[key] = value;
    fallbackStorage.setItem(fallbackStorage.meta, meta);
    return;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('meta', 'readwrite');
      const store = tx.objectStore('meta');
      store.put({ key, value });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch (err) {
      console.error('setMeta error:', err);
      resolve();
    }
  });
}
