import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Home, User, LogOut, Sword } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <Sword className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">RPG Legends</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                to={createPageUrl('Home')}
                className={`text-gray-300 hover:text-white transition-colors flex items-center gap-2 ${
                  currentPageName === 'Home' ? 'text-purple-400' : ''
                }`}
              >
                <Home className="w-5 h-5" />
                Accueil
              </Link>

              {user ? (
                <>
                  <span className="text-gray-300">
                    {user.full_name || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <button
                  onClick={() => base44.auth.redirectToLogin(createPageUrl('Home'))}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  Connexion
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>© 2024 RPG Legends. Tous droits réservés.</p>
            <p className="text-sm mt-2">Plonge dans l'aventure et écris ta légende ⚔️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}