import { apiClient } from "@/lib/api-client";
import type { AIChatRequest, AIChatResponse, AIHistoryResponse } from "@/types/ai";
import type { MessageResponse } from "@/types/user";

export const aiService = {
  chat: (payload: AIChatRequest) =>
    apiClient.post<AIChatResponse>("/ai/chat", payload).then((r) => r.data),

  history: (sessionId: string) =>
    apiClient
      .get<AIHistoryResponse>(`/ai/history/${sessionId}`)
      .then((r) => r.data),

  clearHistory: (sessionId: string) =>
    apiClient
      .delete<MessageResponse>(`/ai/history/${sessionId}`)
      .then((r) => r.data),
};
