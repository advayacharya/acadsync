import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { DESIGN } from '../../lib/designTokens';

export function IntegrationsView({ integrations, onConnect }) {
  const platforms = [
    { 
      id: 'google', 
      name: 'Google Calendar', 
      desc: 'Sync your calendar events and deadlines bidirectionally.' 
    },
    { 
      id: 'notion', 
      name: 'Notion', 
      desc: 'Connect your Notion workspace to sync study trackers and assignment databases.' 
    }
  ];

  return (
    <div className={`border ${DESIGN.colors.border} ${DESIGN.radius.base} ${DESIGN.colors.card} divide-y divide-[#2E4A3A]`}>
      {platforms.map(platform => {
        const isConnected = Boolean(integrations[platform.id]);
        
        return (
          <div key={platform.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#2E4A3A]/30 transition-colors">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative shrink-0 mt-1 sm:mt-0">
                <div className={`w-10 h-10 ${DESIGN.radius.sm} border flex items-center justify-center font-medium text-lg ${isConnected ? `bg-[#0F1D16] ${DESIGN.colors.textPrimary} ${DESIGN.colors.border}` : `bg-[#1F3329] ${DESIGN.colors.textMuted} ${DESIGN.colors.border}`}`}>
                  {platform.name.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${DESIGN.colors.textPrimary}`}>{platform.name}</h3>
                <p className={`mt-0.5 ${DESIGN.typography.body}`}>{platform.desc}</p>
              </div>
            </div>
            
            <Button
              variant="secondary"
              onClick={() => !isConnected && onConnect(platform.id, platform.name)}
              disabled={isConnected}
              className="shrink-0 w-full sm:w-auto text-xs py-1.5 h-8"
            >
              {isConnected ? <><Check className="w-3.5 h-3.5 mr-1" /> Connected</> : 'Connect'}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
