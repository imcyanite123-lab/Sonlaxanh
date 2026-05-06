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
    <section id="report" className="py-20 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <AlertCircle size={14} />
              Báo cáo rác thải
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-emerald-950 mb-6">
              Thấy điểm rác? <br />
              Hãy báo cho chúng tôi!
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Dữ liệu của bạn sẽ được gửi tới nhóm tình nguyện viên để kịp thời xử lý. Mọi hành động của bạn đều góp phần làm Sơn La sạch đẹp hơn.
            </p>

            <div className="space-y-4">
              {[
                { title: 'Chụp ảnh', desc: 'Chụp lại hiện trạng điểm rác' },
                { title: 'Ghim vị trí', desc: 'Xác định tọa độ qua GPS' },
                { title: 'Gửi thông tin', desc: 'Nhấn gửi để hoàn tất báo cáo' }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 text-sm">{step.title}</h4>
                    <p className="text-xs text-slate-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 relative overflow-hidden">
            <AnimatePresence>
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 px-6 text-center"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-950 mb-2">Gửi báo cáo thành công!</h3>
                  <p className="text-slate-600 mb-6">Cảm ơn bạn đã đóng góp cho cộng đồng. Chúng tôi sẽ sớm xác minh và xử lý.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold"
                  >
                    Gửi tiếp báo cáo khác
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tiêu đề báo cáo</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="VD: Đống rác tự phát ngõ 200"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Loại rác</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  >
                    <option value="trash">Rác sinh hoạt</option>
                    <option value="con">Rác xây dựng</option>
                    <option value="elec">Rác điện tử</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Địa điểm</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={formData.locationName}
                      onChange={e => setFormData({...formData, locationName: e.target.value})}
                      placeholder="VD: Phường Quyết Thắng"
                      className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                      required
                    />
                    <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="Ghi rõ tình trạng, lượng rác và chỉ dẫn cụ thể..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors cursor-pointer group">
                <Camera size={40} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">Tải ảnh lên (Optional)</span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Gửi báo cáo ngay
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
