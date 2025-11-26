export interface Block {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bullet' | 'quote' | 'todo';
  content: string;
  checked?: boolean;
}

export enum AIActionType {
  SUMMARIZE = 'SUMMARIZE',
  FIX_SPELLING = 'FIX_SPELLING',
  IMPROVE_WRITING = 'IMPROVE_WRITING',
  CONTINUE_WRITING = 'CONTINUE_WRITING',
  GENERATE_FROM_PROMPT = 'GENERATE_FROM_PROMPT',
}

export interface AIResponseState {
  isLoading: boolean;
  streamContent: string;
  error: string | null;
}

export type PageType = 'document' | 'summary';

export interface Page {
  id: string;
  title: string;
  type: PageType;
  icon?: string;
  blocks: Block[];
  updatedAt: Date;
}

// New types for the Dashboard
export interface DashboardMetrics {
  projectHealth: number; // 0-100
  completedTasks: number;
  totalTasks: number;
  sentiment: 'Positive' | 'Neutral' | 'Critical';
}

export interface TopicStat {
  topic: string;
  count: number;
  color?: string;
}

export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Done';
}

export interface DashboardData {
  metrics: DashboardMetrics;
  topics: TopicStat[];
  actionItems: ActionItem[];
}