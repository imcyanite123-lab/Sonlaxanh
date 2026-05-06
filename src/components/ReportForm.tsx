import React, { useState, useRef } from 'react';
import { db, auth, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GoogleGenAI, Type } from "@google/genai";
import { Camera, Send, MapPin, AlertCircle, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ReportForm() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'trash',
    description: '',
    locationName: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [lastReport, setLastReport] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const analyzeDescription = async (description: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this trash report description and determine if it involves hazardous waste (chemicals, medical waste, batteries, sharp objects, etc.). 
        Return "high" if hazardous, otherwise "low".
        Description: ${description}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              priority: { type: Type.STRING }
            }
          }
        }
      });
      
      const result = JSON.parse(response.text);
      return result.priority === 'high' ? 'high' : 'low';
    } catch (err) {
      console.error("AI Analysis failed:", err);
      return 'low';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('Vui lòng đăng nhập để gửi báo cáo.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let imageUrl = '';
      if (file) {
        try {
          const storageRef = ref(storage, `reports/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(snapshot.ref);
        } catch (uploadErr) {
          throw new Error('Lỗi tải ảnh lên. Vui lòng thử lại.');
        }
      }

      const priority = await analyzeDescription(formData.description);
      const reportData = {
        ...formData,
        imageUrl,
        priority,
        reporterId: auth.currentUser.uid,
        reporterName: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Người dùng ẩn danh',
        status: 'pending',
        lat: 21.3283 + (Math.random() - 0.5) * 0.01,
        lng: 103.9142 + (Math.random() - 0.5) * 0.01,
        createdAt: serverTimestamp()
      };

      const reportRef = await addDoc(collection(db, 'reports'), reportData);

      setLastReport({ ...reportData, id: reportRef.id });
      setSubmitted(true);
      setFormData({ title: '', type: 'trash', description: '', locationName: '' });
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkCleaned = async () => {
    if (!lastReport?.id) return;
    setIsSubmitting(true);
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'reports', lastReport.id), {
        status: 'cleaned'
      });
      setSubmitted(false);
      alert('Đã cập nhật trạng thái: Đã dọn dẹp!');
    } catch (err) {
      console.error(err);
      setError('Không thể cập nhật trạng thái.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdmin = auth.currentUser?.email === 'imcyanite123@gmail.com';

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
                  <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold shadow-lg shadow-brand-primary/20 shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark mb-0.5">{step.title}</h4>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-green-900/5 p-8 md:p-10 border border-green-100 relative overflow-hidden min-h-[600px]">
            <AnimatePresence>
              {submitted ? (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 px-8 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Gửi báo cáo thành công!</h3>
                  <div className="bg-slate-50 p-6 rounded-2xl mb-6 w-full text-left border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Chi tiết báo cáo</p>
                    <p className="font-bold text-slate-800 mb-1">{lastReport?.title}</p>
                    <p className="text-sm text-slate-500 mb-2">{lastReport?.locationName}</p>
                    <div className="flex items-center gap-2">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${lastReport?.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        Mức độ: {lastReport?.priority === 'high' ? 'Ưu tiên cao' : 'Thường'}
                       </span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-8 max-w-xs text-sm">
                    Dự kiến đội ngũ sẽ xác minh trong vòng <strong>24-48 giờ</strong> tới. Bạn có thể theo dõi trạng thái tại Trang Cá Nhân.
                  </p>
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

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative p-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:border-brand-primary/50 hover:text-brand-primary transition-colors cursor-pointer group overflow-hidden"
              >
                {previewUrl ? (
                  <div className="absolute inset-0">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <ImageIcon size={32} className="mb-2 text-brand-primary" />
                      <span className="text-xs font-bold text-brand-dark">Đã chọn ảnh: {file?.name}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Camera size={44} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-tighter">TẢI ẢNH MINH HỌA</span>
                  </>
                )}
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
                className="w-full py-5 bg-brand-primary hover:bg-brand-dark disabled:bg-slate-300 text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 active:scale-95 translate-y-1"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={24} className="animate-spin" />
                    <span>Đang phân tích & gửi...</span>
                  </div>
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
