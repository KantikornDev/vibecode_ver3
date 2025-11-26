export interface Block {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bullet' | 'quote';
  content: string;
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
