
import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Search, 
  Play, 
  Pause, 
  Edit2, 
  Trash2, 
  Sparkles,
  Target,
  Users
} from 'lucide-react';
import { Campaign } from '../types';
import { generateEmailCopy } from '../services/geminiService';

interface CampaignsProps {
  campaigns: Campaign[];
  onUpdateCampaigns: (campaigns: Campaign[]) => void;
}

const Campaigns: React.FC<CampaignsProps> = ({ campaigns, onUpdateCampaigns }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{subject: string, body: string} | null>(null);

  const toggleStatus = (id: string) => {
    onUpdateCampaigns(campaigns.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'running' ? 'paused' : 'running' };
      }
      return c;
    }));
  };

  const handleCreateDraft = async () => {
    setIsGenerating(true);
    const context = "VibeMail AI outreach";
    const resultText = await generateEmailCopy(aiPrompt, context);
    
    const parts = resultText?.split('Body:') || [];
    const subject = parts[0]?.replace('Subject:', '').trim() || 'New Campaign';
    const body = parts[1]?.trim() || resultText || '';
    
    setGeneratedResult({ subject, body });
    setIsGenerating(false);
  };

  const finalizeCampaign = () => {
    const newCamp: Campaign = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCampaignName || 'New Campaign',
      status: 'paused',
      totalLeads: 50,
      sent: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      steps: [{ id: '1', type: 'email', subject: generatedResult?.subject, body: generatedResult?.body }],
      createdAt: new Date().toISOString()
    };
    onUpdateCampaigns([...campaigns, newCamp]);
    setIsCreating(false);
    setGeneratedResult(null);
    setAiPrompt('');
  };

  if (isCreating) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Create New Campaign</h2>
            <p className="text-slate-500">Set up your sequence and leads in minutes.</p>
          </div>
          <button 
            onClick={() => setIsCreating(false)}
            className="text-slate-500 hover:text-slate-800 font-medium"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Campaign Name</label>
            <input 
              type="text" 
              placeholder="e.g. Sales Directors Outreach"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={newCampaignName}
              onChange={(e) => setNewCampaignName(e.target.value)}
            />
          </div>

          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles size={18} className="text-blue-600" />
              <h3 className="font-bold text-blue-800">AI Sequence Builder</h3>
            </div>
            <textarea 
              placeholder="Who are you targeting and why?"
              className="w-full h-32 px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm mb-4"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            ></textarea>
            <button 
              onClick={handleCreateDraft}
              disabled={isGenerating || !aiPrompt}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isGenerating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Sparkles size={18} /><span>Generate with Vibe AI</span></>}
            </button>
          </div>

          {generatedResult && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 flex items-center space-x-2">
                <Target size={18} className="text-emerald-500" />
                <span>Generated Draft</span>
              </h4>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-sm font-bold text-slate-700">Subject: {generatedResult.subject}</div>
                <div className="text-sm text-slate-600 whitespace-pre-wrap">{generatedResult.body}</div>
              </div>
              <button 
                onClick={finalizeCampaign}
                className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all"
              >
                Create Campaign
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search campaigns..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center space-x-2 shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Campaign</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Open Rate</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Replies</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{c.name}</div>
                  <div className="text-xs text-slate-500 flex items-center space-x-2 mt-1">
                    <Users size={12} />
                    <span>{c.totalLeads} Leads</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleStatus(c.id)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                      c.status === 'running' 
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.status === 'running' ? <Pause size={12} className="mr-1.5" /> : <Play size={12} className="mr-1.5" />}
                    {c.status === 'running' ? 'Running' : 'Launch'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="w-48">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>{c.sent} / {c.totalLeads} sent</span>
                      <span>{Math.round((c.sent/c.totalLeads)*100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-blue-500 rounded-full transition-all duration-1000 ${c.status === 'running' ? 'opacity-80' : ''}`} 
                        style={{ width: `${(c.sent/c.totalLeads)*100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-bold text-slate-700">
                  {c.sent > 0 ? Math.round((c.opened / c.sent) * 100) : 0}%
                </td>
                <td className="px-6 py-4 text-center font-bold text-blue-600">
                  {c.replied}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Campaigns;
