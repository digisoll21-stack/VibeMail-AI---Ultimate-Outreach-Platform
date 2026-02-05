
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Mail, 
  CornerUpLeft, 
  Trash2, 
  MoreVertical,
  Star,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { MessageThread } from '../types';
import { analyzeLeadIntent } from '../services/geminiService';

const mockThreads: MessageThread[] = [
  { id: '1', leadName: 'Jane Cooper', leadEmail: 'jane@paradigm.com', lastMessage: "Hi, I'm interested in learning more about your tool. Can we chat tomorrow?", timestamp: '10:30 AM', status: 'unread', campaignName: 'Q3 Enterprise' },
  { id: '2', leadName: 'Guy Hawkins', leadEmail: 'guy.h@volts.io', lastMessage: "Thanks for the outreach, but we aren't looking for a new solution right now.", timestamp: 'Yesterday', status: 'replied', campaignName: 'Startup Founders' },
  { id: '3', leadName: 'Cameron Williamson', leadEmail: 'cam@west.co', lastMessage: "Is there a bulk pricing option available for teams?", timestamp: '2 days ago', status: 'read', campaignName: 'Q3 Enterprise' },
];

const Unibox: React.FC = () => {
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(mockThreads[0]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedThread) return;
    setIsAnalyzing(true);
    const analysis = await analyzeLeadIntent(selectedThread.lastMessage);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="h-full -m-8 flex animate-in fade-in duration-500">
      {/* Thread List */}
      <div className="w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Inbox</h3>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              <Filter size={18} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search leads..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {mockThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => {
                setSelectedThread(thread);
                setAiAnalysis(null);
              }}
              className={`w-full p-4 text-left transition-all hover:bg-slate-50 flex space-x-3 ${
                selectedThread?.id === thread.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold">
                {thread.leadName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-sm font-bold truncate ${thread.status === 'unread' ? 'text-slate-900' : 'text-slate-700'}`}>
                    {thread.leadName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{thread.timestamp}</span>
                </div>
                <div className="text-xs text-slate-500 truncate mb-1">{thread.campaignName}</div>
                <div className={`text-xs truncate ${thread.status === 'unread' ? 'font-semibold text-slate-800' : 'text-slate-400'}`}>
                  {thread.lastMessage}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message View */}
      <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        {selectedThread ? (
          <>
            {/* Thread Header */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                  {selectedThread.leadName[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">{selectedThread.leadName}</div>
                  <div className="text-[10px] text-slate-400">{selectedThread.leadEmail}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-400 hover:text-slate-800 rounded-lg">
                  <Star size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg">
                  <Trash2 size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-800 rounded-lg">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* AI Assistant Banner */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold">Vibe Insight</div>
                  <div className="text-xs opacity-90">
                    {aiAnalysis || "Let AI analyze this response and categorize the lead intent."}
                  </div>
                </div>
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-4 py-1.5 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Intent"}
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-widest">
                  Conversation started
                </span>
              </div>

              {/* Sent Email */}
              <div className="flex justify-end">
                <div className="max-w-xl bg-white p-4 rounded-2xl rounded-tr-none border border-slate-200 shadow-sm space-y-2">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Sent via {selectedThread.campaignName}</div>
                  <div className="text-sm text-slate-700">
                    Hi {selectedThread.leadName.split(' ')[0]}, I saw what you're building at Paradigm and was impressed by your recent growth. We've helped similar companies scale their outbound by 3x. Would you be open to a quick chat?
                  </div>
                  <div className="text-[10px] text-slate-400 text-right italic">3 days ago</div>
                </div>
              </div>

              {/* Received Reply */}
              <div className="flex justify-start">
                <div className="max-w-xl bg-blue-600 p-4 rounded-2xl rounded-tl-none text-white shadow-lg space-y-2">
                  <div className="text-sm">
                    {selectedThread.lastMessage}
                  </div>
                  <div className="text-[10px] text-blue-200 italic">{selectedThread.timestamp}</div>
                </div>
              </div>
            </div>

            {/* Reply Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="relative group">
                <textarea 
                  placeholder="Type your reply..."
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
                ></textarea>
                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Sparkles size={20} />
                  </button>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center space-x-2 shadow-lg shadow-blue-100">
                    <CornerUpLeft size={18} />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Mail size={32} />
            </div>
            <p className="font-medium">Select a conversation to start vibing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Unibox;
