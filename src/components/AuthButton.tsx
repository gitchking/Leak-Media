import { useState, useEffect, useRef } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { LogIn, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-2 border border-slate-600/30">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 animate-pulse"></div>
        <div className="w-3 h-3 bg-slate-600 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 rounded-xl p-2 transition-all duration-300 group border border-transparent"
        >
          <div className="relative">
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`}
              alt={user.displayName || 'User Avatar'}
              className="w-10 h-10 rounded-full border-2 border-primary-400 shadow-md transition-all duration-300"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full shadow-sm"></div>
          </div>
          <ChevronDown 
            size={14} 
            className={`text-slate-400 group-hover:text-slate-300 transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-72 bg-dark-950/90 backdrop-blur-xl border border-dark-800/60 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 pointer-events-none"></div>
            
            {/* User Info Section */}
            <div className="relative px-6 py-5 border-b border-dark-800/60">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`}
                    alt={user.displayName || 'User Avatar'}
                  className="w-14 h-14 rounded-full border-2 border-primary-500 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-dark-950 rounded-full shadow-sm"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg leading-tight truncate">
                    {user.displayName || 'User'}
                  </h3>
                  <p className="text-slate-400 text-sm font-medium truncate mt-0.5">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Settings Section (under profile, above Sign Out) */}
            <div className="px-4 pt-3">
              <div className="text-xs uppercase tracking-wider text-dark-300 mb-2">Setting</div>
              <div className="bg-dark-950/60 border border-dark-800/60 rounded-xl p-3">
                <div className="text-slate-300 text-sm font-medium mb-2">Theme</div>
                <div className="flex items-center gap-3">
                  <button type="button" data-theme="green" aria-label="Green" className="w-6 h-6 rounded-full border border-dark-700" style={{ background: 'rgb(var(--primary-600))' }}></button>
                  <button type="button" data-theme="blue" aria-label="Blue" className="w-6 h-6 rounded-full border border-dark-700" style={{ background: 'rgb(37 99 235)' }}></button>
                  <button type="button" data-theme="purple" aria-label="Purple" className="w-6 h-6 rounded-full border border-dark-700" style={{ background: 'rgb(124 58 237)' }}></button>
                  <button type="button" data-theme="red" aria-label="Red" className="w-6 h-6 rounded-full border border-dark-700" style={{ background: 'rgb(220 38 38)' }}></button>
                  <button type="button" data-theme="yellow" aria-label="Yellow" className="w-6 h-6 rounded-full border border-dark-700" style={{ background: 'rgb(202 138 4)' }}></button>
                  <button type="button" data-theme="pink" aria-label="Pink" className="w-6 h-6 rounded-full border border-dark-700" style={{ background: 'rgb(219 39 119)' }}></button>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="relative p-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 rounded-xl transition-all duration-300 group border border-transparent"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 transition-all duration-300">
                  <LogOut size={16} />
                </div>
                <span className="font-medium">Sign Out</span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="relative flex items-center gap-3 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 group overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300"></div>
      
      <div className="relative flex items-center gap-3">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300">
          <LogIn size={14} className="group-hover:scale-110 transition-transform duration-300" />
        </div>
        <span className="relative">Sign In</span>
      </div>
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </button>
  );
}
