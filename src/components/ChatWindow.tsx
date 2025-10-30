import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '../types';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { RobotIcon } from './icons/RobotIcon';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onProfileUpdateDecision: (messageId: string, accepted: boolean, suggestion: Partial<UserProfile>) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading, onProfileUpdateDecision }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg shadow-xl flex flex-col h-[80vh] max-h-[800px]">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <RobotIcon className="w-5 h-5 text-violet-400" />
              </div>
            )}
            <div className={`max-w-lg p-4 rounded-xl ${msg.sender === 'user' ? 'bg-primary-gradient text-white rounded-br-none' : 'bg-zinc-800 text-zinc-200 rounded-bl-none'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              
              {msg.profileUpdateSuggestion && !msg.profileUpdateSuggestion.isProcessed && (
                <div className="mt-4 border-t border-zinc-700 pt-3">
                    <h4 className="text-xs font-bold text-zinc-400 mb-2">PROPOSITION DE MISE À JOUR</h4>
                    <div className="space-y-1">
                      {Object.entries(msg.profileUpdateSuggestion.suggestion).map(([key, value]) => (
                          <div key={key} className="text-xs text-zinc-300 bg-zinc-900/50 p-2 rounded">
                              <span className="font-semibold capitalize">{key}: </span>
                              <span className="text-zinc-400">{String(value)}</span>
                          </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                        <button 
                            onClick={() => onProfileUpdateDecision(msg.id, true, msg.profileUpdateSuggestion!.suggestion)}
                            className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1 px-3 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            Accepter
                        </button>
                        <button 
                            onClick={() => onProfileUpdateDecision(msg.id, false, msg.profileUpdateSuggestion!.suggestion)}
                            className="flex items-center gap-1.5 text-xs bg-zinc-600 hover:bg-zinc-500 text-white font-bold py-1 px-3 rounded-full transition-colors"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            Refuser
                        </button>
                    </div>
                </div>
              )}

              {msg.sources && msg.sources.length > 0 && (
                 <div className="mt-4 border-t border-zinc-700 pt-2">
                    <h4 className="text-xs font-bold text-zinc-400 mb-1">Sources:</h4>
                    <ul className="text-xs space-y-1">
                        {msg.sources.map((source, index) => (
                            <li key={index}>
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline truncate block">
                                    {source.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                 </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
              <RobotIcon className="w-5 h-5 text-violet-400" />
            </div>
            <div className="max-w-md p-4 rounded-xl bg-zinc-800 text-zinc-300 rounded-bl-none">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-zinc-900/50 border-t border-zinc-800">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question à votre assistant..."
            className="flex-1 bg-zinc-800 border-zinc-700 shadow-inner rounded-full py-3 px-5 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary-gradient text-white rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-violet-500"
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;