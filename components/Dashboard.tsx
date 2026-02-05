
import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Send, 
  Eye, 
  MousePointer2, 
  Reply, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';
import { Campaign } from '../types';

interface DashboardProps {
  campaigns: Campaign[];
}

const mockData = [
  { name: 'Mon', sent: 400, replies: 24, opens: 240 },
  { name: 'Tue', sent: 600, replies: 13, opens: 398 },
  { name: 'Wed', sent: 550, replies: 38, opens: 480 },
  { name: 'Thu', sent: 800, replies: 39, opens: 600 },
  { name: 'Fri', sent: 700, replies: 48, opens: 500 },
  { name: 'Sat', sent: 300, replies: 12, opens: 180 },
  { name: 'Sun', sent: 200, replies: 5, opens: 100 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div className="flex items-center text-emerald-600 text-sm font-semibold">
        <ArrowUpRight size={16} className="mr-1" />
        {change}%
      </div>
    </div>
    <div className="text-2xl font-bold text-slate-800">{value}</div>
    <div className="text-slate-500 text-sm">{title}</div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ campaigns }) => {
  const totalSent = campaigns.reduce((acc, c) => acc + c.sent, 0);
  const totalOpened = campaigns.reduce((acc, c) => acc + c.opened, 0);
  const totalReplied = campaigns.reduce((acc, c) => acc + c.replied, 0);
  
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
  const replyRate = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Sent" value={totalSent.toLocaleString()} change="12" icon={Send} color="bg-blue-600" />
        <StatCard title="Open Rate" value={`${openRate}%`} change="5" icon={Eye} color="bg-indigo-600" />
        <StatCard title="Reply Rate" value={`${replyRate}%`} change="2" icon={Reply} color="bg-violet-600" />
        <StatCard title="Active Campaigns" value={campaigns.filter(c => c.status === 'running').length} change="8" icon={MousePointer2} color="bg-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Sending Performance</h3>
              <p className="text-sm text-slate-500">Track your real-time outreach metrics.</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="sent" stroke="#2563eb" fillOpacity={1} fill="url(#colorSent)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Running Campaigns</h3>
          <div className="space-y-6">
            {campaigns.filter(c => c.status === 'running').length > 0 ? (
              campaigns.filter(c => c.status === 'running').map((c) => (
                <div key={c.id} className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex-shrink-0 flex items-center justify-center">
                    <TrendingUp size={18} className="text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-800">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.sent} / {c.totalLeads} sent</div>
                    <div className="h-1 w-full bg-slate-100 rounded-full mt-2">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                        style={{ width: `${(c.sent/c.totalLeads)*100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400">No campaigns currently running.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
