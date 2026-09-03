import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

import { AppShell } from './components/layout/AppShell';
import { Button } from './components/ui/Button';
import { Toast } from './components/ui/Toast';

import { LoginView } from './features/auth/LoginView';
import { DashboardView } from './features/dashboard/DashboardView';
import { CalendarView } from './features/calendar/CalendarView';
import { StudyPlannerView } from './features/planner/StudyPlannerView';
import { AnalyticsView } from './features/analytics/AnalyticsView';
import { IntegrationsView } from './features/integrations/IntegrationsView';
import { TaskModal } from './features/tasks/TaskModal';

import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import api from './services/api';
import { DESIGN } from './lib/designTokens';

export default function App() {
  const { user, isLoggingIn, authError, login, register, logout, setAuthError } = useAuth();
  const {
    tasks,
    isLoadingTasks,
    taskError,
    fetchTasks,
    saveTask,
    deleteTask,
    toggleTaskStatus,
    setTaskError,
    isOffline,
    isSyncing,
    pendingQueueCount,
    syncQueuedTasks
  } = useTasks(user, logout);

  const [integrations, setIntegrations] = useState({ google: false, notion: false });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [, setPlannerData] = useState([]);
  const [isPlannerLoading, setIsPlannerLoading] = useState(false);

  const [toast, setToast] = useState({ message: '', type: 'error' });
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const status = searchParams.get('status');
    const integration = searchParams.get('integration');

    if (status === 'success' && (!integration || integration === 'google')) {
      navigate('/calendar');
      triggerGoogleSync();
      setSearchParams({});
    } else if (status === 'notion_success' || (integration === 'notion' && status === 'success')) {
      navigate('/integrations');
      setIntegrations((prev) => ({ ...prev, notion: true }));
      setSearchParams({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const triggerGoogleSync = async () => {
    showToast('Syncing Google Calendar events…', 'success');
    try {
      const data = await api.syncGoogle();
      await fetchTasks();
      setIntegrations((prev) => ({ ...prev, google: true }));
      const n = data.count ?? 0;
      showToast(
        `Synced ${n} calendar event${n === 1 ? '' : 's'} successfully.`,
        'success'
      );
    } catch (error) {
      console.error('Google Calendar sync error:', error);
      showToast(error.error || error.message || 'Google Calendar sync failed', 'error');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter email and password', 'error');
      return;
    }
    try {
      await login(email, password);
      setEmail('');
      setPassword('');
      navigate('/dashboard');
    } catch (err) {
      // Error handled by useAuth state
    }
  };

  const handleRegisterSubmit = async (name, regEmail, regPassword) => {
    try {
      await register(name, regEmail, regPassword);
      setEmail('');
      setPassword('');
      navigate('/dashboard');
    } catch (err) {
      // Error handled by useAuth state
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      const syncStatus = await saveTask(editingTask, taskData);
      setIsModalOpen(false);
      setEditingTask(null);

      if (syncStatus && syncStatus.offline) {
        showToast('Saved offline — queued for sync when reconnected', 'success');
      } else if (syncStatus && !syncStatus.success) {
        showToast(`Task saved locally. Google sync failed: ${syncStatus.error}`, 'error');
      } else {
        showToast('Task saved and synced successfully', 'success');
      }
    } catch (err) {
      showToast(err.error || 'Could not save task', 'error');
    }
  };

  const handleConnectIntegration = async (platformId, platformName) => {
    try {
      if (platformId === 'google') {
        await api.connectGoogle();
        return;
      }
      if (platformId === 'notion') {
        await api.connectNotion();
        return;
      }
      showToast(`${platformName || platformId} integration is not supported`, 'error');
    } catch (err) {
      console.error('Integration connect error:', err);
      showToast(err.error || 'Could not connect integration', 'error');
    }
  };

  if (!user) {
    return (
      <>
        <LoginView
          onLogin={handleLoginSubmit}
          onRegister={handleRegisterSubmit}
          isLoggingIn={isLoggingIn}
          errorMessage={authError}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'error' })} />
        <Analytics />
      </>
    );
  }

  return (
    <AppShell
      user={user}
      onLogout={logout}
      isOffline={isOffline}
      isSyncing={isSyncing}
      pendingQueueCount={pendingQueueCount}
      onSyncClick={syncQueuedTasks}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className={DESIGN.typography.pageTitle}>Workspace</h1>
          <p className={`mt-1.5 ${DESIGN.typography.body}`}>
            Manage your deadlines, schedules, and integrated services.
          </p>
        </div>
        <Button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Task
        </Button>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <DashboardView
              tasks={tasks}
              isLoading={isLoadingTasks}
              onToggle={toggleTaskStatus}
              onDelete={deleteTask}
              onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
            />
          }
        />
        <Route path="/calendar" element={<CalendarView tasks={tasks} />} />
        <Route
          path="/planner"
          element={
            <StudyPlannerView
              tasks={tasks}
              isPlannerLoading={isPlannerLoading}
              setIsPlannerLoading={setIsPlannerLoading}
              setPlannerData={setPlannerData}
              showToast={showToast}
            />
          }
        />
        <Route path="/analytics" element={<AnalyticsView tasks={tasks} />} />
        <Route
          path="/integrations"
          element={
            <IntegrationsView
              integrations={integrations}
              onConnect={handleConnectIntegration}
            />
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      )}

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'error' })} />
      <Analytics />
    </AppShell>
  );
}
