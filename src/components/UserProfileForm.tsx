import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface UserProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ isOpen, onClose, profile, setProfile }) => {
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up-fade">
        <div className="flex justify-between items-center p-6 border-b border-zinc-700">
          <h2 className="text-2xl font-bold text-zinc-100">Mon Profil</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Nom</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full bg-zinc-950 border-zinc-700 shadow-inner rounded-md p-2 text-zinc-100 focus:ring-violet-500 focus:border-violet-500" />
            </div>
            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-zinc-300 mb-2">Mes Intérêts</label>
              <textarea name="interests" id="interests" value={formData.interests} onChange={handleChange} rows={3} className="w-full bg-zinc-950 border-zinc-700 shadow-inner rounded-md p-2 text-zinc-100 focus:ring-violet-500 focus:border-violet-500" placeholder="Ex: cinéma, art, technologie..."></textarea>
            </div>
            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-zinc-300 mb-2">Mes Objectifs</label>
              <textarea name="goals" id="goals" value={formData.goals} onChange={handleChange} rows={3} className="w-full bg-zinc-950 border-zinc-700 shadow-inner rounded-md p-2 text-zinc-100 focus:ring-violet-500 focus:border-violet-500" placeholder="Ex: apprendre à coder, être plus organisé..."></textarea>
            </div>
            <div>
              <label htmlFor="habits" className="block text-sm font-medium text-zinc-300 mb-2">Mes Habitudes</label>
              <textarea name="habits" id="habits" value={formData.habits} onChange={handleChange} rows={3} className="w-full bg-zinc-950 border-zinc-700 shadow-inner rounded-md p-2 text-zinc-100 focus:ring-violet-500 focus:border-violet-500" placeholder="Ex: je lis les news le matin..."></textarea>
            </div>
          </div>
          <div className="p-6 bg-zinc-900/50 border-t border-zinc-700 flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-700 text-white rounded-md mr-2 hover:bg-zinc-600 transition-colors">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-primary-gradient text-white rounded-md hover:opacity-90 transition-opacity">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;