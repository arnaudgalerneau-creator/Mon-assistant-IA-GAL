import React from 'react';
import { Suggestion } from '../types';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ suggestions }) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg shadow-xl p-6">
      <div className="flex items-center mb-4">
        <LightbulbIcon className="h-6 w-6 text-yellow-400 mr-3" />
        <h2 className="text-xl font-bold text-zinc-100">Suggestions Pour Vous</h2>
      </div>
      <div className="space-y-4">
        {suggestions.length > 0 ? (
          suggestions.slice().reverse().slice(0, 5).map((sug) => (
            <div key={sug.id} className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 hover:border-violet-500 transition-all cursor-pointer">
              <h3 className="font-semibold text-zinc-100">{sug.title}</h3>
              <p className="text-sm text-zinc-400 mt-1">{sug.description}</p>
              {sug.link && (
                <a
                  href={sug.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-violet-400 hover:underline mt-2 inline-block"
                >
                  En savoir plus &rarr;
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="text-zinc-500 text-sm">Aucune suggestion pour le moment. Discutez avec votre assistant pour en obtenir.</p>
        )}
      </div>
    </div>
  );
};

export default SuggestionsPanel;