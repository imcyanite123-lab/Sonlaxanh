import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { TrashReport } from '../types';
import { User, Mail, MapPin, Clock, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function Profile() {
  const [reports, setReports] = useState<TrashReport[]>([]);
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

  if (!user) return (
    <div className="pt-32 px-6 text-center">
      <p className="text-slate-500">Vui lòng đăng nhập để xem thông tin cá nhân.</p>
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 mb-12 flex flex-col md:flex-row items-center gap-8 border border-slate-100">
          <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center text-green-600 relative overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
            ) : (
              <User size={64} />
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-black text-slate-900 mb-2">{user.displayName || 'Người dùng Sơn La Xanh'}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <Mail size={16} />
                {user.email}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                Tình nguyện viên
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
