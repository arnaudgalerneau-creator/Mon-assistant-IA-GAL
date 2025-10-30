import React, { useState } from 'react';
import { TodoItem } from '../types';

interface DevPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialTodos: TodoItem[] = [
  { id: 'todo0', text: "Mettre en place un processus de build (Vite)", completed: true },
  { id: 'todo3', text: "Ajouter une base de données sécurisée (Supabase)", completed: true },
  { id: 'todo1', text: "Mettre en place un Backend (Vercel Functions)", completed: true },
  { id: 'todo2', text: "Sécuriser la clé API Gemini sur le Backend", completed: true },
  { id: 'todo6', text: "Déployer l'application avec un build et HTTPS", completed: false },
  { id: 'todo4', text: "Implémenter l'authentification des utilisateurs", completed: false },
  { id: 'todo5', text: "Migrer le stockage des données vers la BDD", completed: false },
];


const DevPanel: React.FC<DevPanelProps> = ({ isOpen, onClose }) => {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-slide-up-fade">
        <div className="flex justify-between items-center p-6 border-b border-zinc-700">
          <h2 className="text-2xl font-bold text-zinc-100">DEV de l'app : Amélioration Continue</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <section>
            <h3 className="text-lg font-semibold text-green-400 mb-3">Action Requise : Déploiement Vercel</h3>
            <div className="bg-zinc-800/50 p-4 rounded-lg space-y-2 text-sm text-zinc-300 border border-zinc-700">
              <p>Votre projet est maintenant prêt à être déployé !</p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>Téléversez la nouvelle structure de code sur votre dépôt GitHub.</li>
                <li>Allez sur votre tableau de bord Vercel et importez ce dépôt.</li>
                <li>Vercel devrait détecter automatiquement un projet 'Vite'. Ne changez aucune configuration de build.</li>
                <li>Allez dans la section 'Environment Variables' du projet.</li>
                <li>Créez une nouvelle variable : Nom = <code className="bg-zinc-700 px-1 rounded">API_KEY</code>, Valeur = votre clé secrète Google Gemini.</li>
                <li>Cliquez sur 'Deploy'.</li>
              </ol>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-violet-400 mb-3">Checklist d'Évolution</h3>
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                <ul className="space-y-3">
                {todos.map((todo) => (
                  <li key={todo.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-5 w-5 rounded bg-zinc-700 border-zinc-600 text-violet-600 focus:ring-violet-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`ml-3 text-zinc-300 transition-colors ${todo.completed ? 'line-through text-zinc-500' : ''}`}
                    >
                      {todo.text}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </section>

        </div>

        <div className="p-4 bg-zinc-900/50 border-t border-zinc-700 flex justify-end">
          <button type="button" onClick={onClose} className="px-5 py-2 bg-primary-gradient text-white rounded-md hover:opacity-90 transition-opacity">Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default DevPanel;