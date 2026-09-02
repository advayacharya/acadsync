const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = (isJson = true) => {
  const token = getToken();
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (res) => {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = payload.message || `Request failed with status ${res.status}`;
    const isUnauthorized = res.status === 401;
    throw { error, status: res.status, unauthorized: isUnauthorized };
  }
  return payload;
};

const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ email, password })
  });
  return handleResponse(res);
};

const register = async (name, email, password) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ name, email, password })
  });
  return handleResponse(res);
};

const getTasks = async () => {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'GET',
    headers: getHeaders(false)
  });
  return handleResponse(res);
};

const createTask = async (task) => {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(task)
  });
  return handleResponse(res);
};

const updateTask = async (id, task) => {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(task)
  });
  return handleResponse(res);
};

const deleteTask = async (id) => {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(false)
  });
  return handleResponse(res);
};

const generatePlan = async (hoursAvailable) => {
  const res = await fetch(`${API_BASE}/planner/generate`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ hoursAvailable })
  });
  return handleResponse(res);
};

const getConnectTicket = async (platform) => {
  const res = await fetch(`${API_BASE}/integrations/${platform}/ticket`, {
    method: 'POST',
    headers: getHeaders(true)
  });
  return handleResponse(res);
};

const connectGoogle = async () => {
  const token = getToken();
  if (!token) {
    throw { error: 'You must be logged in to connect Google' };
  }
  const { ticket } = await getConnectTicket('google');
  window.location.href = `${API_BASE}/integrations/google/connect?ticket=${ticket}`;
};

const connectNotion = async () => {
  const token = getToken();
  if (!token) {
    throw { error: 'You must be logged in to connect Notion' };
  }
  const { ticket } = await getConnectTicket('notion');
  window.location.href = `${API_BASE}/integrations/notion/connect?ticket=${ticket}`;
};



const syncGoogle = async () => {
  const res = await fetch(`${API_BASE}/integrations/google/sync`, {
    method: 'GET',
    headers: getHeaders(false)
  });
  return handleResponse(res);
};



export default {
  API_BASE,
  login,
  register,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  generatePlan,
  getConnectTicket,
  connectGoogle,
  connectNotion,
  syncGoogle
};
