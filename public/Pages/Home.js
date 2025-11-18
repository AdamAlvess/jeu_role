import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sword, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CharacterCard from '../components/character/CharacterCard';

export default function Home() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: characters = [], isLoading } = useQuery({
    queryKey: ['characters'],
    queryFn: () => base44.entities.Character.filter({ created_by: user?.email }, '-created_date', 50),
    enabled: !!user,
  });

  const deleteCharacterMutation = useMutation({
    mutationFn: (id) => base44.entities.Character.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce personnage ?')) {
      deleteCharacterMutation.mutate(id);
    }
  };

  const lastCharacter = characters[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Sword className="w-20 h-20 text-purple-400 animate-pulse" />
            </div>
            <h1 className="text-7xl font-bold text-white mb-4 tracking-tight">
              RPG<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> LEGENDS</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Plonge dans un univers épique où chaque choix façonne ton destin. Crée ton héros, lance les dés et écris ta légende.
            </p>
            
            {!user && (
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => base44.auth.redirectToLogin(createPageUrl('Home'))}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
                >
                  Commencer l'aventure
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Character Section */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Mes Héros</h2>
                <p className="text-gray-400">Bienvenue, {user.full_name || user.email}</p>
              </div>
              <Link to={createPageUrl('CreateCharacter')}>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                  <Plus className="w-5 h-5 mr-2" />
                  Nouveau personnage
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : characters.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/50 rounded-xl border-2 border-dashed border-gray-600">
                <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Aucun personnage</h3>
                <p className="text-gray-400 mb-6">Crée ton premier héros pour commencer ton aventure !</p>
                <Link to={createPageUrl('CreateCharacter')}>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Plus className="w-5 h-5 mr-2" />
                    Créer un personnage
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Dernier personnage créé */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Dernier personnage créé</h3>
                  <div className="max-w-md">
                    <CharacterCard
                      character={lastCharacter}
                      onSelect={(char) => window.location.href = createPageUrl('GamePlay') + `?id=${char.id}`}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>

                {/* Tous les personnages */}
                {characters.length > 1 && (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-4">Tous mes personnages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {characters.map(character => (
                        <CharacterCard
                          key={character.id}
                          character={character}
                          onSelect={(char) => window.location.href = createPageUrl('GamePlay') + `?id=${char.id}`}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Races Uniques', desc: 'Humains, Elfes, Orques, Nains et Démons avec des bonus spécifiques', icon: '⚔️' },
            { title: 'Système de Dés 3D', desc: 'Lance des dés réalistes avec physique avancée et rebonds', icon: '🎲' },
            { title: 'Personnalisation', desc: 'Crée ton héros unique avec 7 statistiques différentes', icon: '✨' }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="bg-slate-800/50 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}