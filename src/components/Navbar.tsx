import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './Logo';

interface NavbarProps {
  onNavigate: (view: 'home' | 'profile') => void;
  currentView: string;
}

export default function Navbar({ onNavigate, currentView }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    onNavigate('home');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100 shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <Logo size={42} />
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
          {currentView === 'home' ? (
            <>
              <a href="#map" className="hover:text-green-600 transition-colors">Bản đồ</a>
              <a href="#report" className="hover:text-green-600 transition-colors">Báo cáo</a>
              <a href="#activities" className="hover:text-green-600 transition-colors">Hoạt động</a>
              <a href="#about" className="hover:text-green-600 transition-colors">Về dự án</a>
            </>
          ) : (
            <button 
              onClick={() => onNavigate('home')}
              className="hover:text-green-600 transition-colors"
            >
              Về Trang chủ
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('profile')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                  currentView === 'profile' ? 'bg-green-600 text-white border-green-600' : 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'
                }`}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" />
                ) : (
                  <UserIcon size={16} />
                )}
                <span className="text-xs font-bold hidden sm:inline">
                  {user.displayName?.split(' ').pop()}
                </span>
              </button>
              <button 
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold shadow-md shadow-green-200 transition-all flex items-center gap-2 active:scale-95"
            >
              <LogIn size={18} />
              <span>Tham gia ngay</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
