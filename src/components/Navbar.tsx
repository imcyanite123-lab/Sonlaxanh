import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { Leaf, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
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

  const handleLogout = () => signOut(auth);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -20, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            className="p-2 bg-emerald-500 rounded-lg text-white"
          >
            <Leaf size={24} />
          </motion.div>
          <span className="text-xl font-bold font-display tracking-tight text-emerald-900">
            Sơn La <span className="text-emerald-500">Xanh</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#map" className="hover:text-emerald-600 transition-colors">Bản đồ</a>
          <a href="#report" className="hover:text-emerald-600 transition-colors">Báo cáo</a>
          <a href="#activities" className="hover:text-emerald-600 transition-colors">Hoạt động</a>
          <a href="#about" className="hover:text-emerald-600 transition-colors">Về dự án</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" />
                ) : (
                  <UserIcon size={16} className="text-emerald-600" />
                )}
                <span className="text-xs font-semibold text-emerald-700 hidden sm:inline">
                  {user.displayName?.split(' ').pop()}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-500 transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl transition-all font-semibold text-sm shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <LogIn size={18} />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
