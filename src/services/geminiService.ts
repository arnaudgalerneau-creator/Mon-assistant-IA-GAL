import type { UserProfile, ChatMessage, Objective, Suggestion, GroundingSource } from '../types';

export const analyzeAndGetResponse = async (
  prompt: string,
  userProfile: UserProfile,
  chatHistory: ChatMessage[]
): Promise<{ aiMessage: string; newObjectives?: Objective[]; newSuggestions?: Suggestion[], sources?: GroundingSource[], profileUpdateSuggestion?: Partial<UserProfile> }> => {
  
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, userProfile, chatHistory }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`Erreur du serveur backend: ${errorBody.error || response.statusText}`);
  }

  const data = await response.json();
  return data;
};
