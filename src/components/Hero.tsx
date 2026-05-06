import { motion } from 'motion/react';
import { ChevronRight, ShieldCheck, TreePine, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -z-10 opacity-20 blur-3xl">
        <div className="w-[500px] h-[500px] bg-brand-primary rounded-full mix-blend-multiply" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-20 blur-3xl">
        <div className="w-[400px] h-[400px] bg-brand-accent rounded-full mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={14} />
            Dự án học sinh
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold font-display leading-[1.1] text-brand-dark mb-6 transition-all">
            Chung tay bảo vệ <br />
            <span className="text-brand-primary">môi trường</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
            Kiến tạo Thành phố Sơn La xanh - sạch - đẹp thông qua mạng lưới cộng đồng hỗ trợ phân loại và thu gom rác thải thông minh.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href="#report"
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-green-600/25 flex items-center gap-2 group hover:scale-105 active:scale-95"
            >
              Báo cáo rác ngay
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#map"
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-green-100 rounded-2xl font-bold transition-all shadow-sm"
            >
              Xem bản đồ tập kết
            </a>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-emerald-100 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="avatar" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                +15
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              <span className="text-emerald-600 font-bold">20+</span> học sinh đã tham gia tuần này
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2626&auto=format&fit=crop" 
              alt="Environmental Care" 
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
          
          {/* Floating cards */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 p-4 bg-white rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-slate-100"
          >
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <TreePine size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Mục tiêu</p>
              <p className="text-sm font-bold text-emerald-950">500 cây xanh mới</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-6 -left-6 p-4 bg-white rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-slate-100"
          >
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Điểm thu gom</p>
              <p className="text-sm font-bold text-emerald-950">12 vị trí mới</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
