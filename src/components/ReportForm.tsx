import React, { useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Camera, Send, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ReportForm() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'trash',
    description: '',
    locationName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('Vui lòng đăng nhập để gửi báo cáo.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'reports'), {
        ...formData,
        reporterId: auth.currentUser.uid,
        status: 'pending',
        lat: 21.3283 + (Math.random() - 0.5) * 0.01, // Mock lat/lng near center
        lng: 103.9142 + (Math.random() - 0.5) * 0.01,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setFormData({ title: '', type: 'trash', description: '', locationName: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="report" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <AlertCircle size={14} />
              Báo cáo rác thải
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold font-display text-slate-900 mb-6 leading-tight">
              Thấy điểm rác? <br />
              Hãy báo cho chúng tôi!
            </h2>
            <p className="text-slate-600 mb-10 leading-relaxed text-lg">
              Dữ liệu của bạn sẽ được gửi tới nhóm tình nguyện viên để kịp thời xử lý. Mọi hành động của bạn đều góp phần làm Sơn La sạch đẹp hơn.
            </p>

            <div className="space-y-6">
              {[
                { title: 'Chụp ảnh', desc: 'Chụp lại hiện trạng điểm rác' },
                { title: 'Ghim vị trí', desc: 'Xác định tọa độ qua GPS' },
                { title: 'Gửi thông tin', desc: 'Nhấn gửi để hoàn tất báo cáo' }
              ].map((step, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold shadow-lg shadow-green-200 shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-0.5">{step.title}</h4>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-green-900/5 p-8 md:p-10 border border-green-100 relative overflow-hidden">
            <AnimatePresence>
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 px-8 text-center"
                >
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle2 size={56} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">Gửi báo cáo thành công!</h3>
                  <p className="text-slate-600 mb-8 max-w-xs">Cảm ơn bạn đã đóng góp cho cộng đồng. Chúng tôi sẽ sớm xác minh và xử lý.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="px-10 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all shadow-xl shadow-green-200"
                  >
                    Gửi báo cáo khác
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Tiêu đề báo cáo</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="VD: Đống rác tự phát ngõ 200"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder:text-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Loại rác</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-5 py-4 rounded-full bg-slate-50 border border-slate-100 focus:border-green-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="trash">Rác sinh hoạt</option>
                    <option value="con">Rác xây dựng</option>
                    <option value="elec">Rác điện tử</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Địa điểm</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={formData.locationName}
                      onChange={e => setFormData({...formData, locationName: e.target.value})}
                      placeholder="VD: Phường Quyết Thắng"
                      className="w-full px-5 py-4 pl-12 rounded-full bg-slate-50 border border-slate-100 focus:border-green-500 outline-none placeholder:text-slate-300"
                      required
                    />
                    <MapPin className="absolute left-4 top-4 text-slate-400" size={20} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Mô tả chi tiết</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="Ghi rõ tình trạng, lượng rác và chỉ dẫn cụ thể..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-green-500 outline-none resize-none placeholder:text-slate-300"
                ></textarea>
              </div>

              <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:border-green-300 hover:text-green-600 transition-colors cursor-pointer group">
                <Camera size={44} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-tighter">TẢI ẢNH MINH HỌA</span>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-2xl font-bold transition-all shadow-xl shadow-green-600/20 flex items-center justify-center gap-3 active:scale-95 translate-y-1"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} />
                    Gửi thông tin ngay
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
