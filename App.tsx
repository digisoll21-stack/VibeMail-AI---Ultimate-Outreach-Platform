
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Send, 
  Users, 
  Inbox, 
  BarChart3, 
  Settings, 
  Zap,
  Sparkles
} from 'lucide-react';
import { AppView, Campaign, EmailAccount } from './types';
import Dashboard from './components/Dashboard';
import Campaigns from './components/Campaigns';
import Accounts from './components/Accounts';
import Unibox from './components/Unibox';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- Persistent State ---
  const [accounts, setAccounts] = useState<EmailAccount[]>(() => {
    const saved = localStorage.getItem('vibemail_accounts');
    return saved ? JSON.parse(saved) : [
      { id: '1', email: 'sales@vibe-agency.com', provider: 'google', status: 'active', warmupEnabled: true, dailyLimit: 50, sentToday: 12 },
    ];
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('vibemail_campaigns');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Initial Outreach',
        status: 'paused',
        totalLeads: 100,
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        steps: [],
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('vibemail_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('vibemail_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  // --- Sending Engine Engine (Simulation) ---
  useEffect(() => {
    const engineInterval = setInterval(() => {
      setCampaigns(prevCampaigns => {
        let changed = false;
        const newCampaigns = prevCampaigns.map(camp => {
          if (camp.status === 'running' && camp.sent < camp.totalLeads) {
            changed = true;
            // Simulate sending a batch of 1-3 emails per tick
            const batchSize = Math.floor(Math.random() * 3) + 1;
            const newSent = Math.min(camp.sent + batchSize, camp.totalLeads);
            
            // Randomly simulate opens and replies for the newly sent emails
            const newOpens = camp.opened + (Math.random() > 0.6 ? Math.floor(batchSize * 0.4) : 0);
            const newReplies = camp.replied + (Math.random() > 0.9 ? 1 : 0);

            return {
              ...camp,
              sent: newSent,
              opened: newOpens,
              replied: newReplies,
              lastRunTimestamp: Date.now()
            };
          }
          return camp;
        });
        return changed ? newCampaigns : prevCampaigns;
      });

      // Also update account "sent today" stats if a campaign is active
      setAccounts(prevAccounts => {
        const activeCamps = campaigns.filter(c => c.status === 'running');
        if (activeCamps.length === 0) return prevAccounts;
        
        return prevAccounts.map(acc => {
          if (acc.status === 'active' && acc.sentToday < acc.dailyLimit) {
            return { ...acc, sentToday: acc.sentToday + 1 };
          }
          return acc;
        });
      });

    }, 5000); // Process every 5 seconds for visual feedback

    return () => clearInterval(engineInterval);
  }, [campaigns]);

  const NavItem = ({ icon: Icon, label, view }: { icon: any, label: string, view: AppView }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className={`${!isSidebarOpen && 'hidden'} font-medium`}>{label}</span>
    </button>
  );

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard campaigns={campaigns} />;
      case AppView.CAMPAIGNS:
        return (
          <Campaigns 
            campaigns={campaigns} 
            onUpdateCampaigns={setCampaigns} 
          />
        );
      case AppView.ACCOUNTS:
        return (
          <Accounts 
            accounts={accounts} 
            onUpdateAccounts={setAccounts} 
          />
        );
      case AppView.UNIBOX:
        return <Unibox />;
      default:
        return <Dashboard campaigns={campaigns} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            {isSidebarOpen && <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">VibeMail</span>}
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" view={AppView.DASHBOARD} />
          <NavItem icon={Send} label="Campaigns" view={AppView.CAMPAIGNS} />
          <NavItem icon={Users} label="Accounts" view={AppView.ACCOUNTS} />
          <NavItem icon={Inbox} label="Unibox" view={AppView.UNIBOX} />
          <NavItem icon={BarChart3} label="Analytics" view={AppView.ANALYTICS} />
        </nav>

        <div className="p-3 border-t border-slate-100">
          <NavItem icon={Settings} label="Settings" view={AppView.SETTINGS} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            {currentView}
          </h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
              <div className={`w-2 h-2 rounded-full bg-emerald-500 ${campaigns.some(c => c.status === 'running') ? 'animate-pulse' : ''}`}></div>
              <span className="text-xs font-bold uppercase tracking-wider">Engine: {campaigns.some(c => c.status === 'running') ? 'Active' : 'Idle'}</span>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <Sparkles size={18} />
              <span className="text-sm font-semibold italic">Credits: 420</span>
            </button>
            <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
              <img src="https://picsum.photos/40/40" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
