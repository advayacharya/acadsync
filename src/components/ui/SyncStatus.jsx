import React from 'react';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { DESIGN } from '../../lib/designTokens';

export function SyncStatus({ status = 'idle', message = '' }) {
  if (status === 'idle' || !status) {
    return null;
  }

  const getIcon = () => {
    switch (status) {
      case 'syncing':
        return <Loader className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (status) {
      case 'syncing':
        return '#D2A24C';
      case 'success':
        return '#4A7C59';
      case 'error':
        return '#C2664A';
      default:
        return '#6B8577';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'syncing':
        return 'Syncing to Google Calendar...';
      case 'success':
        return message || 'Synced to Google Calendar';
      case 'error':
        return message || 'Failed to sync';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded text-sm" style={{ backgroundColor: `${getColor()}20` }}>
      <div style={{ color: getColor() }}>{getIcon()}</div>
      <span style={{ color: getColor() }} className="font-medium">
        {getLabel()}
      </span>
    </div>
  );
}
