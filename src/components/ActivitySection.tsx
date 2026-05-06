import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Users, ArrowRight, Plus, Edit2, X, Image as ImageIcon, Save, Trash2, Loader2, RotateCcw } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../lib/firebase';

const ADMIN_EMAIL = 'imcyanite123@gmail.com';

export default function ActivitySection() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Undo Delete State
  const [deletedActivity, setDeletedActivity] = useState<any>(null);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimerRef = useRef<any>(null);

  const user = auth.currentUser;
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const q = query(collection(db, 'activities'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivities(data);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    setLoading(true);
    try {
      let imageUrl = editingActivity?.image || '';

      if (selectedFile) {
        const storageRef = ref(storage, `activities/${Date.now()}_${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      
      const data = {
        title: formData.get('title'),
        date: formData.get('date'),
        location: formData.get('location'),
        participants: parseInt(formData.get('participants') as string),
        image: imageUrl,
        category: formData.get('category'),
        updatedAt: serverTimestamp(),
        createdAt: editingActivity?.createdAt || serverTimestamp()
      };

      if (editingActivity?.id) {
        await updateDoc(doc(db, 'activities', editingActivity.id), data);
      } else {
        await addDoc(collection(db, 'activities'), data);
      }
      
      closeEditor();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu hoạt động.');
    } finally {
      setLoading(false);
    }
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingActivity(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  const handleDelete = async (activity: any) => {
    try {
      // Immediate deletion from DB for better UX consistency
      await deleteDoc(doc(db, 'activities', activity.id));
      
      // Store copy for undo
      setDeletedActivity(activity);
      setShowUndo(true);

      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      undoTimerRef.current = setTimeout(() => {
        setShowUndo(false);
      }, 5000);

    } catch (err) {
      console.error(err);
    }
  };

  const handleUndo = async () => {
    if (!deletedActivity) return;
    try {
      const { id, ...data } = deletedActivity;
      await addDoc(collection(db, 'activities'), data);
      setShowUndo(false);
      setDeletedActivity(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="activities" className="py-20 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-6xl font-extrabold font-display text-brand-dark mb-6 italic transition-all tracking-tighter">Green Footmarks</h2>
            <p className="text-slate-600 leading-relaxed text-xl">
              Những dấu chân xanh của cộng đồng Sơn La. Hãy cùng chúng tôi lan tỏa lối sống xanh thông qua các hoạt động thiết thực.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin && (
              <button 
                onClick={() => { setEditingActivity(null); setIsEditorOpen(true); }}
                className="px-6 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-dark transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20 active:scale-95"
              >
                <Plus size={20} />
                Thêm hoạt động
              </button>
            )}
            <button className="px-8 py-4 bg-green-50 text-green-700 rounded-2xl font-bold hover:bg-green-100 transition-colors flex items-center gap-3 active:scale-95">
              Tất cả hoạt động
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {activities.length > 0 ? activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group cursor-pointer relative"
              >
                <div className="relative overflow-hidden rounded-[2.5rem] bg-white aspect-[4/5] shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-green-50">
                  <img 
                    src={activity.image} 
                    alt={activity.title} 
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-900/20 to-transparent" />
                  
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className="px-5 py-2 bg-brand-primary text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-xl shadow-brand-primary/20">
                      {activity.category}
                    </span>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingActivity(activity); setIsEditorOpen(true); }}
                          className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(activity); }}
                          className="w-10 h-10 bg-red-500/20 backdrop-blur-md text-red-200 rounded-full flex items-center justify-center hover:bg-red-500/40 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                    <div className="flex items-center gap-4 text-green-100 text-xs mb-4 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-green-400" />
                        {activity.date}
                      </span>
                      <span className="w-1.5 h-1.5 bg-green-800 rounded-full" />
                      <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-green-400" />
                        {activity.participants} tham gia
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-5 leading-tight group-hover:text-green-400 transition-colors">
                      {activity.title}
                    </h3>
                    <div className="flex items-center gap-2 text-green-200/70 text-sm font-medium italic">
                      <MapPin size={16} />
                      {activity.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
               <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                 <p className="text-slate-400 font-bold italic uppercase tracking-widest">Đang tải hoạt động...</p>
               </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Admin Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsEditorOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="bg-brand-primary p-8 text-white flex justify-between items-center">
                <h2 className="text-2xl font-black italic tracking-tighter">
                  {editingActivity ? 'CHỈNH SỬA HOẠT ĐỘNG' : 'THÊM HOẠT ĐỘNG MỚI'}
                </h2>
                <button onClick={() => setIsEditorOpen(false)} className="hover:rotate-90 transition-transform">
                  <X size={28} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tiêu đề hoạt động</label>
                    <input name="title" defaultValue={editingActivity?.title} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-brand-primary font-medium" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ngày diễn ra</label>
                    <input name="date" defaultValue={editingActivity?.date} placeholder="VD: 25/12/2026" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-brand-primary font-medium" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Thể loại</label>
                    <input name="category" defaultValue={editingActivity?.category} placeholder="VD: Tái chế, Dọn dẹp" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-brand-primary font-medium" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Địa điểm</label>
                    <input name="location" defaultValue={editingActivity?.location} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-brand-primary font-medium" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Số lượng tham gia</label>
                    <input name="participants" type="number" defaultValue={editingActivity?.participants} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-brand-primary font-medium" required />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hình ảnh hoạt động</label>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden" 
                      accept="image/*" 
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative h-40 w-full rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary overflow-hidden group"
                    >
                      {(previewUrl || editingActivity?.image) ? (
                        <>
                          <img src={previewUrl || editingActivity.image} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" alt="Preview" />
                          <ImageIcon className="relative z-10 text-brand-dark mb-1" size={32} />
                          <span className="relative z-10 text-[10px] font-bold text-brand-dark uppercase">Nhấn để thay đổi ảnh</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="text-slate-300 mb-2" size={40} />
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Tải ảnh lên</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={closeEditor}
                    className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-[0.98]"
                  >
                    HỦY
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] py-5 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 disabled:bg-slate-300 active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    LƯU THÔNG TIN
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Undo Toast */}
      <AnimatePresence>
        {showUndo && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[101] bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-6 min-w-[320px]"
          >
            <div className="flex-1">
              <p className="text-sm font-bold italic tracking-tighter">Đã xóa: {deletedActivity?.title}</p>
              <p className="text-[10px] text-slate-400 font-medium">Bấm hoàn tác để khôi phục trong 5s</p>
            </div>
            <button 
              onClick={handleUndo}
              className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-xl font-bold text-xs hover:bg-brand-dark transition-colors"
            >
              <RotateCcw size={14} />
              HOÀN TÁC
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
