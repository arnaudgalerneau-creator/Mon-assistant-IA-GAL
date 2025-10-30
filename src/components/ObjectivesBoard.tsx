import React from 'react';
import { Objective } from '../types';
import { TargetIcon } from './icons/TargetIcon';

interface ObjectivesBoardProps {
  objectives: Objective[];
  setObjectives: React.Dispatch<React.SetStateAction<Objective[]>>;
}

const ObjectivesBoard: React.FC<ObjectivesBoardProps> = ({ objectives, setObjectives }) => {
  const toggleObjective = (id: string) => {
    setObjectives(
      objectives.map((obj) => (obj.id === id ? { ...obj, completed: !obj.completed } : obj))
    );
  };

  const completedCount = objectives.filter(o => o.completed).length;
  const totalCount = objectives.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg shadow-xl p-6">
      <div className="flex items-center mb-4">
        <TargetIcon className="h-6 w-6 text-violet-400 mr-3" />
        <h2 className="text-xl font-bold text-zinc-100">Mes Objectifs</h2>
      </div>
      
      {totalCount > 0 && (
        <div className="mb-4">
            <div className="flex justify-between mb-1 text-sm text-zinc-400">
                <span>Progression</span>
                <span>{completedCount} / {totalCount}</span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2.5">
                <div className="bg-violet-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      )}

      <ul className="space-y-3">
        {objectives.map((obj) => (
          <li key={obj.id} className="flex items-center">
            <input
              type="checkbox"
              id={`obj-${obj.id}`}
              checked={obj.completed}
              onChange={() => toggleObjective(obj.id)}
              className="h-5 w-5 rounded bg-zinc-700 border-zinc-600 text-violet-600 focus:ring-violet-500 cursor-pointer"
            />
            <label
              htmlFor={`obj-${obj.id}`}
              className={`ml-3 text-zinc-300 transition-colors cursor-pointer ${obj.completed ? 'line-through text-zinc-500' : ''}`}
            >
              {obj.text}
            </label>
          </li>
        ))}
        {objectives.length === 0 && (
            <p className="text-zinc-500 text-sm">Aucun objectif pour le moment. Demandez à votre assistant de vous en créer !</p>
        )}
      </ul>
    </div>
  );
};

export default ObjectivesBoard;