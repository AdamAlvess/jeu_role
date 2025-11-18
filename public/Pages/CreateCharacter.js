import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import RaceRoulette from '../components/character/RaceRoulette';
import StatRoulette from '../components/character/StatRoulette';

const STAT_ORDER = ['force', 'agilite', 'constitution', 'dexterite', 'perception', 'intelligence', 'charisme'];

export default function CreateCharacter() {
  const [step, setStep] = useState('name'); // name, race, stats
  const [characterName, setCharacterName] = useState('');
  const [race, setRace] = useState('');
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [stats, setStats] = useState({});

  const createCharacterMutation = useMutation({
    mutationFn: (data) => base44.entities.Character.create(data),
    onSuccess: (character) => {
      window.location.href = createPageUrl('GamePlay') + `?id=${character.id}`;
    },
  });

  const handleNameSubmit = () => {
    if (!characterName.trim()) {
      alert('Merci d\'entrer un nom pour ton personnage !');
      return;
    }
    setStep('race');
  };

  const handleRaceSelected = (selectedRace) => {
    setRace(selectedRace);
    setStep('stats');
  };

  const handleStatComplete = (value) => {
    const statName = STAT_ORDER[currentStatIndex];
    setStats(prev => ({ ...prev, [statName]: value }));
    
    if (currentStatIndex < STAT_ORDER.length - 1) {
      setCurrentStatIndex(prev => prev + 1);
    } else {
      // Toutes les stats sont tirées, créer le personnage
      const characterData = {
        name: characterName,
        race: race,
        level: 1,
        ...stats,
        [statName]: value,
        gold: 0
      };
      createCharacterMutation.mutate(characterData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {['Nom', 'Race', 'Statistiques'].map((label, idx) => (
              <React.Fragment key={label}>
                <div className={`px-4 py-2 rounded-full font-semibold ${
                  (step === 'name' && idx === 0) ||
                  (step === 'race' && idx === 1) ||
                  (step === 'stats' && idx === 2)
                    ? 'bg-purple-600 text-white'
                    : idx < (['name', 'race', 'stats'].indexOf(step))
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-gray-400'
                }`}>
                  {label}
                </div>
                {idx < 2 && <ArrowRight className="text-gray-500" />}
              </React.Fragment>
            ))}
          </div>
          {step === 'stats' && (
            <div className="text-center text-white text-sm">
              Statistique {currentStatIndex + 1} sur {STAT_ORDER.length}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* Étape 1: Nom */}
          {step === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-4xl font-bold text-white mb-6 text-center">
                  Nomme ton héros
                </h2>
                <p className="text-gray-400 text-center mb-8">
                  Choisis un nom légendaire qui résonnera à travers les âges
                </p>
                <Input
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Ex: Aragorn, Gandalf, Thorgrim..."
                  className="mb-6 text-lg py-6 bg-slate-900 border-purple-500/50 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                  autoFocus
                />
                <Button
                  onClick={handleNameSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg"
                >
                  Continuer
                  <ArrowRight className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Étape 2: Race */}
          {step === 'race' && (
            <motion.div
              key="race"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <RaceRoulette onRaceSelected={handleRaceSelected} />
            </motion.div>
          )}

          {/* Étape 3: Stats */}
          {step === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <StatRoulette
                statName={STAT_ORDER[currentStatIndex]}
                race={race}
                onComplete={handleStatComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Création en cours */}
        {createCharacterMutation.isPending && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white text-xl font-semibold">Création de ton héros...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}