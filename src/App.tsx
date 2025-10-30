import React, { useState, useCallback, useEffect } from 'react';
import { UserProfile, ChatMessage, Objective, Suggestion } from './types';
import { analyzeAndGetResponse } from './services/geminiService';
import UserProfileForm from './components/UserProfileForm';
import ObjectivesBoard from './components/ObjectivesBoard';
import SuggestionsPanel from './components/SuggestionsPanel';
import ChatWindow from './components/ChatWindow';
import DevPanel from './components/DevPanel';
import { UserIcon } from './components/icons/UserIcon';
import { RobotIcon } from './components/icons/RobotIcon';
import { CodeIcon } from './components/icons/CodeIcon';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex',
    interests: 'cinéma de science-fiction, art moderne, randonnée, nouvelles technologies',
    goals: 'apprendre une nouvelle compétence de programmation, être plus organisé au quotidien',
    habits: 'lit les actualités tech le matin, regarde un film le week-end',
  });
  const [objectives, setObjectives] = useState<Objective[]>([
    { id: 'obj1', text: 'Planifier la semaine à venir', completed: false },
    { id: 'obj2', text: 'Terminer le module 3 du cours en ligne', completed: true },
  ]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    { id: 'sug1', title: 'Nouvelle expo au musée d\'art contemporain', description: 'Une collection d\'artistes émergents qui pourrait vous plaire.' },
  ]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 'chat1', sender: 'ai', text: `Bonjour ${userProfile.name}, comment puis-je vous aider aujourd'hui ?` },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDevPanelOpen, setIsDevPanelOpen] = useState(false);

  useEffect(() => {
    console.log("Client Supabase initialisé et prêt.");
  }, []);

  const handleProfileUpdateDecision = useCallback((messageId: string, accepted: boolean, suggestion: Partial<UserProfile>) => {
    setChatHistory(prev => prev.map(msg => 
        msg.id === messageId 
        ? { ...msg, profileUpdateSuggestion: { ...msg.profileUpdateSuggestion!, isProcessed: true } } 
        : msg
    ));

    if (accepted) {
        setUserProfile(prev => ({ ...prev, ...suggestion }));
        const confirmationMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: "Parfait ! J'ai mis à jour votre profil.",
        };
        setChatHistory(prev => [...prev, confirmationMessage]);
    } else {
         const rejectionMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: "Compris. Je ne touche à rien pour le moment.",
        };
        setChatHistory(prev => [...prev, rejectionMessage]);
    }
  }, []);


  const handleSendMessage = useCallback(async (message: string) => {
    const newUserMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: message };
    setChatHistory(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const { aiMessage, newObjectives, newSuggestions, sources, profileUpdateSuggestion } = await analyzeAndGetResponse(message, userProfile, chatHistory);
      
      const newAiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiMessage,
        sources: sources,
        ...(profileUpdateSuggestion && { profileUpdateSuggestion: { suggestion: profileUpdateSuggestion, isProcessed: false } })
      };

      setChatHistory(prev => [...prev, newAiMessage]);

      if (newObjectives && newObjectives.length > 0) {
        setObjectives(prev => [...prev, ...newObjectives]);
      }
      if (newSuggestions && newSuggestions.length > 0) {
        setSuggestions(prev => [...prev, ...newSuggestions]);
      }
    } catch (error) {
      console.error("Erreur lors de l'appel au backend:", error instanceof Error ? error.message : String(error));
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Désolé, une erreur est survenue. Veuillez réessayer plus tard.",
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, chatHistory]);

  return (
    <div className="bg-zinc-950 text-zinc-300 min-h-screen font-sans">
      <header className="bg-zinc-950/75 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <RobotIcon className="h-8 w-8 text-violet-400" />
              <h1 className="ml-3 text-2xl font-bold text-zinc-100">Assistant IA</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDevPanelOpen(true)}
                className="flex items-center p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-violet-500 transition-colors"
                aria-label="Ouvrir le panneau de développement"
              >
                <CodeIcon className="h-6 w-6 text-zinc-300" />
              </button>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-violet-500 transition-colors"
                aria-label="Ouvrir le profil utilisateur"
              >
                <UserIcon className="h-6 w-6 text-zinc-300" />
                <span className="ml-2 text-sm font-medium hidden md:block text-zinc-200">{userProfile.name}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChatWindow messages={chatHistory} onSendMessage={handleSendMessage} isLoading={isLoading} onProfileUpdateDecision={handleProfileUpdateDecision} />
          </div>

          <div className="space-y-6">
            <ObjectivesBoard objectives={objectives} setObjectives={setObjectives} />
            <SuggestionsPanel suggestions={suggestions} />
          </div>
        </div>
      </main>

      <UserProfileForm
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        setProfile={setUserProfile}
      />

      <DevPanel
        isOpen={isDevPanelOpen}
        onClose={() => setIsDevPanelOpen(false)}
      />
    </div>
  );
};

export default App;