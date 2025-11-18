import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Sword, Shield, Brain, Heart, Sparkles, Eye, Hand, ArrowLeft, Save, Coins } from 'lucide-react';
import SimpleDice from '../components/dice/SimpleDice';

const statIcons = {
  force: Sword,
  agilite: Sparkles,
  intelligence: Brain,
  constitution: Heart,
  charisme: Sparkles,
  perception: Eye,
  dexterite: Hand
};

const statColors = {
  force: 'text-red-500',
  agilite: 'text-green-500',
  intelligence: 'text-blue-500',
  constitution: 'text-yellow-500',
  charisme: 'text-pink-500',
  perception: 'text-purple-500',
  dexterite: 'text-cyan-500'
};

export default function GamePlay() {
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get('id');
  const queryClient = useQueryClient();

  const [equippedItems, setEquippedItems] = useState('');
  const [inventory, setInventory] = useState('');
  const [gold, setGold] = useState(0);
  const [lastRoll, setLastRoll] = useState(null);

  const { data: character, isLoading } = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => base44.entities.Character.filter({ id: characterId }),
    select: (data) => data[0],
    enabled: !!characterId,
  });

  useEffect(() => {
    if (character) {
      setEquippedItems(character.equipped_items || '');
      setInventory(character.inventory || '');
      setGold(character.gold || 0);
    }
  }, [character]);

  const updateStatMutation = useMutation({
    mutationFn: ({ stat, value }) => 
      base44.entities.Character.update(characterId, { [stat]: value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character', characterId] });
    },
  });

  const saveInventoryMutation = useMutation({
    mutationFn: () => 
      base44.entities.Character.update(characterId, {
        equipped_items: equippedItems,
        inventory: inventory,
        gold: gold
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character', characterId] });
      alert('Inventaire sauvegardé !');
    },
  });

  const handleStatChange = (stat, delta) => {
    const currentValue = character[stat] || 0;
    const newValue = Math.max(1, Math.min(20, currentValue + delta));
    updateStatMutation.mutate({ stat, value: newValue });
  };

  const levelUpMutation = useMutation({
    mutationFn: () => 
      base44.entities.Character.update(characterId, {
        level: (character.level || 1) + 1
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character', characterId] });
      alert('Niveau supérieur atteint ! 🎉');
    },
  });

  const handleRollComplete = (result) => {
    setLastRoll(result);
  };

  if (!characterId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Aucun personnage sélectionné</p>
          <Button onClick={() => window.location.href = createPageUrl('Home')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  const stats = [
    { key: 'force', label: 'Force', value: character.force },
    { key: 'agilite', label: 'Agilité', value: character.agilite },
    { key: 'intelligence', label: 'Intelligence', value: character.intelligence },
    { key: 'constitution', label: 'Constitution', value: character.constitution },
    { key: 'charisme', label: 'Charisme', value: character.charisme },
    { key: 'perception', label: 'Perception', value: character.perception },
    { key: 'dexterite', label: 'Dextérité', value: character.dexterite }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => window.location.href = createPageUrl('Home')}
            variant="ghost"
            className="text-white mb-4"
          >
            <ArrowLeft className="mr-2" />
            Retour
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">{character.name}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-4 py-1 rounded-full bg-purple-600 text-white font-semibold">
                    {character.race}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-1 rounded-full bg-green-600 text-white font-semibold">
                      Niveau {character.level || 1}
                    </span>
                    <Button
                      onClick={() => levelUpMutation.mutate()}
                      disabled={levelUpMutation.isPending}
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      Monter de niveau
                    </Button>
                  </div>
                </div>
              </div>
              <Shield className="w-16 h-16 text-purple-400 opacity-50" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche: Stats et Dé */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistiques */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map(stat => {
                    const Icon = statIcons[stat.key];
                    return (
                      <div key={stat.key} className="bg-slate-900/50 rounded-lg p-4 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-5 h-5 ${statColors[stat.key]}`} />
                            <span className="text-white font-semibold">{stat.label}</span>
                          </div>
                          <span className="text-2xl font-bold text-white">{stat.value}/20</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatChange(stat.key, -1)}
                            className="flex-1"
                            disabled={stat.value <= 1}
                          >
                            -
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatChange(stat.key, 1)}
                            className="flex-1"
                            disabled={stat.value >= 20}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Lancer de Dé */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Lancer de Dé D20</span>
                  {lastRoll && (
                    <span className="text-2xl font-bold text-purple-400">
                      Dernier: {lastRoll}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleDice onRollComplete={handleRollComplete} />
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite: Inventaire */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Inventaire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">
                    🗡️ Équipement
                  </label>
                  <Textarea
                    value={equippedItems}
                    onChange={(e) => setEquippedItems(e.target.value)}
                    placeholder="Ex: Épée longue, Armure de cuir..."
                    className="bg-slate-900 border-purple-500/50 text-white"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-white font-semibold mb-2 block">
                    🎒 Sac à dos
                  </label>
                  <Textarea
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
                    placeholder="Ex: Potion x3, Clé ancienne..."
                    className="bg-slate-900 border-purple-500/50 text-white"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-white font-semibold mb-2 block flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    Or possédé
                  </label>
                  <Input
                    type="number"
                    value={gold}
                    onChange={(e) => setGold(parseInt(e.target.value) || 0)}
                    min="0"
                    className="bg-slate-900 border-purple-500/50 text-white"
                  />
                </div>

                <Button
                  onClick={() => saveInventoryMutation.mutate()}
                  disabled={saveInventoryMutation.isPending}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Save className="mr-2 w-4 h-4" />
                  {saveInventoryMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}