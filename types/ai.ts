// Mirrors app/schemas/ai.py exactly

export interface AIChatRequest {
  message: string;
  session_id?: string | null;
}

export interface AIFunctionCall {
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

export interface AIChatResponse {
  session_id: string;
  reply: string;
  function_calls: AIFunctionCall[];
  timestamp: string;
}

export interface AIHistoryMessage {
  role: string;
  content: string;
  timestamp?: string | null;
  function_calls?: Record<string, unknown>[] | null;
}

export interface AIHistoryResponse {
  session_id: string;
  messages: AIHistoryMessage[];
  created_at?: string | null;
}
