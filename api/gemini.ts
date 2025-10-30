import { GoogleGenAI, Type } from '@google/genai';
import type { UserProfile, ChatMessage, Objective, Suggestion, GroundingSource } from '../src/types';

export const config = {
  runtime: 'edge',
};

const objectiveSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      text: { type: Type.STRING },
      completed: { type: Type.BOOLEAN },
    },
    required: ['id', 'text', 'completed']
  },
};

const suggestionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            link: { type: Type.STRING, nullable: true },
        },
        required: ['id', 'title', 'description']
    },
};

const profileUpdateSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, nullable: true },
    interests: { type: Type.STRING, nullable: true },
    goals: { type: Type.STRING, nullable: true },
    habits: { type: Type.STRING, nullable: true },
  },
};

const mainResponseSchema = {
    type: Type.OBJECT,
    properties: {
        responseType: {
            type: Type.STRING,
            enum: ["CHAT", "OBJECTIVES", "SUGGESTIONS", "PROFILE_UPDATE"],
        },
        chatResponse: {
            type: Type.STRING,
            description: "La réponse textuelle à afficher dans la fenêtre de chat."
        },
        data: {
            oneOf: [
                objectiveSchema,
                suggestionSchema,
                profileUpdateSchema
            ],
            nullable: true
        }
    },
    required: ['responseType', 'chatResponse']
};

const buildSystemInstruction = (profile: UserProfile): string => `
Vous êtes un assistant IA personnel, amical et proactif. Votre nom est Aura.
Votre but est d'aider l'utilisateur à s'organiser, lui proposer des idées, des objectifs et l'alerter sur des nouvelles pertinentes.
Vous DEVEZ utiliser les informations du profil de l'utilisateur pour personnaliser chaque interaction.

Profil de l'utilisateur actuel:
- Nom: ${profile.name}
- Intérêts: ${profile.interests}
- Objectifs: ${profile.goals}
- Habitudes: ${profile.habits}

Règles de réponse:
1.  Si l'utilisateur demande des objectifs, une organisation ou un plan, utilisez le type "OBJECTIVES".
2.  Si l'utilisateur demande des suggestions (films, expos, livres, etc.), utilisez le type "SUGGESTIONS".
3.  Pour toute autre conversation, utilisez le type "CHAT".
4.  Générez toujours une réponse "chatResponse" amicale et contextuelle.
5.  Pour les objectifs, le champ "data" doit être un tableau d'objets avec "id", "text", et "completed: false".
6.  Pour les suggestions, le champ "data" doit être un tableau d'objets avec "id", "title", "description", et optionnellement "link".
7.  Votre réponse DOIT être un JSON valide respectant le schéma fourni. Ne répondez JAMAIS avec du texte simple ou du Markdown.
8.  Règle supplémentaire: Après plusieurs échanges, si vous identifiez de nouveaux intérêts, objectifs ou habitudes pour l'utilisateur qui ne sont pas explicitement listés dans son profil, utilisez le type "PROFILE_UPDATE". Votre "chatResponse" doit demander à l'utilisateur s'il souhaite mettre à jour son profil. Le champ "data" doit être un objet JSON contenant uniquement les champs du profil à mettre à jour avec leur nouvelle valeur complète (en incluant l'ancienne et la nouvelle information). Par exemple, si les intérêts sont 'art' et vous apprenez que l'utilisateur aime 'la photo', le champ "data" doit être {"interests": "art, la photo"}.
`;

async function getSuggestionsFromSearch(prompt: string, userProfile: UserProfile, ai: GoogleGenAI): Promise<{ aiMessage: string; newSuggestions: Suggestion[], sources: GroundingSource[] }> {
    const fullPrompt = `Basé sur les intérêts de ${userProfile.name} (${userProfile.interests}), réponds à la demande suivante: "${prompt}". Trouve des suggestions pertinentes et récentes. Pour chaque suggestion, fournis un titre, une courte description, et si possible un lien.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    
    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks.map((chunk: any) => ({
      uri: chunk.web?.uri || '#',
      title: chunk.web?.title || 'Source inconnue'
    })).filter(source => source.uri !== '#');
    
    const newSuggestions: Suggestion[] = [];
    const suggestionSections = text.split('\n\n');
    suggestionSections.forEach((section, index) => {
        const lines = section.split('\n');
        if (lines.length >= 2) {
            const title = lines[0].replace(/##\s*|\*\*/g, '').trim();
            const description = lines.slice(1).join(' ').trim();
            if(title && description) {
                newSuggestions.push({
                    id: `sug-search-${Date.now()}-${index}`,
                    title,
                    description,
                });
            }
        }
    });

    return { aiMessage: text, newSuggestions, sources };
}


async function getStructuredResponse(prompt: string, userProfile: UserProfile, chatHistory: ChatMessage[], ai: GoogleGenAI): Promise<{ aiMessage: string; newObjectives?: Objective[]; newSuggestions?: Suggestion[], profileUpdateSuggestion?: Partial<UserProfile> }> {
  
  const formattedHistory = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
  }));
  
  const contents = [...formattedHistory, { role: 'user', parts: [{ text: prompt }] }];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      systemInstruction: buildSystemInstruction(userProfile),
      responseMimeType: "application/json",
      responseSchema: mainResponseSchema,
    },
  });

  const parsedJson = JSON.parse(response.text);

  let newObjectives: Objective[] | undefined;
  let newSuggestions: Suggestion[] | undefined;
  let profileUpdateSuggestion: Partial<UserProfile> | undefined;

  if (parsedJson.responseType === 'OBJECTIVES' && Array.isArray(parsedJson.data)) {
    newObjectives = parsedJson.data as Objective[];
  } else if (parsedJson.responseType === 'SUGGESTIONS' && Array.isArray(parsedJson.data)) {
    newSuggestions = parsedJson.data as Suggestion[];
  } else if (parsedJson.responseType === 'PROFILE_UPDATE' && typeof parsedJson.data === 'object' && parsedJson.data !== null) {
    profileUpdateSuggestion = parsedJson.data as Partial<UserProfile>;
  }

  return {
    aiMessage: parsedJson.chatResponse,
    newObjectives,
    newSuggestions,
    profileUpdateSuggestion,
  };
}


async function analyzeAndGetResponseInternal(
  prompt: string,
  userProfile: UserProfile,
  chatHistory: ChatMessage[],
  ai: GoogleGenAI
): Promise<{ aiMessage: string; newObjectives?: Objective[]; newSuggestions?: Suggestion[], sources?: GroundingSource[], profileUpdateSuggestion?: Partial<UserProfile> }> {
  const isSuggestionRequest = /sugg(è|e)re|trouve|film|série|expo|livre|musique|nouvelle|actualité/i.test(prompt);

  if (isSuggestionRequest) {
    return getSuggestionsFromSearch(prompt, userProfile, ai);
  } else {
    return getStructuredResponse(prompt, userProfile, chatHistory, ai);
  }
};


export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const { prompt, userProfile, chatHistory } = await req.json();

    if (!prompt || !userProfile) {
        return new Response(JSON.stringify({ error: "Requête invalide" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const result = await analyzeAndGetResponseInternal(prompt, userProfile, chatHistory, ai);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Erreur dans la fonction Vercel:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur interne du serveur";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
