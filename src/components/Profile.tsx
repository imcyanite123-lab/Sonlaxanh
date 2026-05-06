import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, storage } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TrashReport } from '../types';
import { User, Mail, MapPin, Clock, AlertCircle, Image as ImageIcon, Camera, Loader2, Check } from 'lucide-react';

export default function Profile() {
  const [reports, setReports] = useState<TrashReport[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'reports'),
      where('reporterId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrashReport));
      setReports(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      
      await updateProfile(user, { photoURL });
      window.location.reload(); // Refresh to show new avatar across app
    } catch (err) {
      console.error(err);
      alert('Lỗi khi cập nhật ảnh đại diện.');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return (
    <div className="pt-32 px-6 text-center">
      <p className="text-slate-500 font-medium italic">Vui lòng đăng nhập để xem thông tin cá nhân.</p>
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 mb-12 flex flex-col md:flex-row items-center gap-8 border border-slate-100">
          <div className="relative group">
            <div className={`w-32 h-32 rounded-full bg-green-50 flex items-center justify-center text-green-600 relative overflow-hidden border-4 border-white shadow-lg ${uploading ? 'opacity-50' : ''}`}>
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
              ) : (
                <User size={64} />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-1 right-1 w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-dark transition-all cursor-pointer z-10"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-black text-slate-900 mb-2 italic tracking-tighter">
              {user.displayName || 'Người dùng Sơn La Xanh'}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <Mail size={16} className="text-brand-primary" />
                {user.email}
              </span>
              <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                Thành viên cộng đồng
              </span>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Báo cáo của bạn ({reports.length})</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {reports.length > 0 ? (
              reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 shadow-md border border-slate-50 hover:shadow-lg transition-all"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
                      {report.imageUrl ? (
                        <img src={report.imageUrl} alt={report.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900 truncate">{report.title}</h3>
                        {report.priority === 'high' && (
                          <span className="shrink-0 px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold uppercase">Nguy cấp</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                        <MapPin size={12} />
                        {report.locationName}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          report.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          report.status === 'verified' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {report.status === 'pending' ? 'Đang chờ' : 
                           report.status === 'verified' ? 'Đã xác minh' : 'Hoàn thành'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock size={10} />
                          {report.createdAt?.toDate().toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                <AlertCircle size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium italic">Bạn chưa gửi báo cáo nào.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
