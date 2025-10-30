export interface UserProfile {
  name: string;
  interests: string;
  goals: string;
  habits: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: GroundingSource[];
  profileUpdateSuggestion?: {
    suggestion: Partial<UserProfile>;
    isProcessed?: boolean;
  };
}

export interface Objective {
  id: string;
  text: string;
  completed: boolean;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export enum ResponseType {
  CHAT = "CHAT",
  OBJECTIVES = "OBJECTIVES",
  SUGGESTIONS = "SUGGESTIONS",
  PROFILE_UPDATE = "PROFILE_UPDATE",
}

export interface ParsedAIResponse {
  responseType: ResponseType;
  chatResponse: string;
  data?: Objective[] | Suggestion[];
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}