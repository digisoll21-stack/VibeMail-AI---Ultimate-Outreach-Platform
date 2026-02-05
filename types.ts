
export enum AppView {
  DASHBOARD = 'dashboard',
  CAMPAIGNS = 'campaigns',
  ACCOUNTS = 'accounts',
  UNIBOX = 'unibox',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings'
}

export interface EmailAccount {
  id: string;
  email: string;
  provider: 'google' | 'outlook' | 'smtp';
  status: 'active' | 'reconnect' | 'disabled';
  warmupEnabled: boolean;
  dailyLimit: number;
  sentToday: number;
}

export interface CampaignStep {
  id: string;
  type: 'email' | 'wait';
  subject?: string;
  body?: string;
  waitDays?: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'draft';
  totalLeads: number;
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  steps: CampaignStep[];
  createdAt: string;
  lastRunTimestamp?: number;
}

export interface MessageThread {
  id: string;
  leadName: string;
  leadEmail: string;
  lastMessage: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied';
  campaignName: string;
}
