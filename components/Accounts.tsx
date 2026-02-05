
import React, { useState } from 'react';
import { 
  Plus, 
  Mail, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink,
  Flame,
  AlertCircle,
  X,
  CheckCircle2
} from 'lucide-react';
import { EmailAccount } from '../types';

interface AccountsProps {
  accounts: EmailAccount[];
  onUpdateAccounts: (accounts: EmailAccount[]) => void;
}

const Accounts: React.FC<AccountsProps> = ({ accounts, onUpdateAccounts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Fix: Explicitly type the newAcc state to prevent it from being locked to provider: 'google'
  const [newAcc, setNewAcc] = useState<{
    email: string;
    provider: 'google' | 'outlook' | 'smtp';
    password: string;
  }>({
    email: '',
    provider: 'google',
    password: ''
  });

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    // Simulate "Connection Testing"
    setTimeout(() => {
      const account: EmailAccount = {
        id: Math.random().toString(36).substr(2, 9),
        email: newAcc.email,
        provider: newAcc.provider,
        status: 'active',
        warmupEnabled: true,
        dailyLimit: 50,
        sentToday: 0
      };
      onUpdateAccounts([...accounts, account]);
      setIsConnecting(false);
      setIsModalOpen(false);
      setNewAcc({ email: '', provider: 'google', password: '' });
    }, 2000);
  };

  const toggleWarmup = (id: string) => {
    onUpdateAccounts(accounts.map(acc => 
      acc.id === id ? { ...acc, warmupEnabled: !acc.warmupEnabled } : acc
    ));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Email Accounts</h2>
          <p className="text-slate-500">Manage your sending domains and warming status.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all flex items-center space-x-2 shadow-lg"
        >
          <Plus size={20} />
          <span>Add Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  account.provider === 'google' ? 'bg-red-50 text-red-600' : 
                  account.provider === 'outlook' ? 'bg-blue-50 text-blue-600' : 
                  'bg-slate-50 text-slate-600'
                }`}>
                  <Mail size={24} />
                </div>
                <div>
                  <div className="font-bold text-slate-800">{account.email}</div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 uppercase tracking-wider mt-0.5">
                    <span>{account.provider}</span>
                    <span>•</span>
                    <span className={`flex items-center ${account.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {account.status === 'active' ? <ShieldCheck size={12} className="mr-1" /> : <AlertCircle size={12} className="mr-1" />}
                      {account.status}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-800">
                <ExternalLink size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Daily Sent</div>
                <div className="text-sm font-bold text-slate-800">{account.sentToday} / {account.dailyLimit}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Deliverability</div>
                <div className="text-sm font-bold text-emerald-600">98.4%</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Reputation</div>
                <div className="text-sm font-bold text-blue-600">Excellent</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-lg ${account.warmupEnabled ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Flame size={16} />
                </div>
                <span className="text-sm font-semibold text-slate-700">Warmup {account.warmupEnabled ? 'Active' : 'Disabled'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => toggleWarmup(account.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    account.warmupEnabled ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {account.warmupEnabled ? 'Stop Warmup' : 'Start Warmup'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Connect Email Account</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-4">
              <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                {(['google', 'outlook', 'smtp'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewAcc({...newAcc, provider: p})}
                    className={`flex-1 py-2 text-xs font-bold capitalize rounded-lg transition-all ${
                      newAcc.provider === p ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="alex@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  value={newAcc.email}
                  onChange={(e) => setNewAcc({...newAcc, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {newAcc.provider === 'smtp' ? 'SMTP Password' : 'App Password'}
                </label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  value={newAcc.password}
                  onChange={(e) => setNewAcc({...newAcc, password: e.target.value})}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-xl flex items-start space-x-3">
                <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700">
                  Your credentials are encrypted and never stored in plain text. We use official APIs whenever possible.
                </p>
              </div>

              <button 
                disabled={isConnecting}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Verifying SMTP...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Connect Account</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
