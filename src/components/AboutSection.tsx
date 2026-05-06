import { motion } from 'motion/react';
import { Target, Lightbulb, Users2, Award } from 'lucide-react';

export default function AboutSection() {
  const points = [
    { 
      title: "Ý tưởng sáng tạo", 
      desc: "Dự án xuất phát từ những trăn trở về môi trường của nhóm học sinh THPT Chuyên Sơn La.", 
      icon: Lightbulb, 
      color: "bg-amber-100 text-amber-600" 
    },
    { 
      title: "Mục tiêu cộng đồng", 
      desc: "Xây dựng nền tảng kết nối người dân, chính quyền và các đội nhóm tình nguyện xử lý rác thải.", 
      icon: Target, 
      color: "bg-emerald-100 text-emerald-600" 
    },
    { 
      title: "Kết nối thế hệ", 
      desc: "Lan tỏa ý thức bảo vệ môi trường từ trường học đến từng hộ gia đình tại thành phố.", 
      icon: Users2, 
      color: "bg-blue-100 text-blue-600" 
    },
    { 
      title: "Dự án tiêu biểu", 
      desc: "Được xây dựng như một minh chứng cho sự chủ động của thế hệ trẻ trong các vấn đề xã hội.", 
      icon: Award, 
      color: "bg-purple-100 text-purple-600" 
    },
  ];

  return (
    <section id="about" className="py-24 px-6 bg-emerald-950 text-white overflow-hidden relative">
      {/* Decorative pattern */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4 block">Về dự án</span>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-8 leading-tight">
              Sơn La Xanh: <br />
              Dự án từ tâm huyết của <br />
              <span className="text-emerald-400 underline decoration-emerald-500/50 underline-offset-8">Thanh thiếu niên</span>
            </h2>
            <p className="text-emerald-100/70 text-lg leading-relaxed mb-10">
              Không chỉ là một ứng dụng di động, Sơn La Xanh là một lời cam kết. Chúng mình tin rằng, mỗi cá nhân dù nhỏ bé đều có thể góp phần tạo nên sự thay đổi lớn lao cho môi trường sống xung quanh.
            </p>
            
            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <img 
                src="https://api.dicebear.com/7.x/pixel-art/svg?seed=SonLa" 
                alt="Logo Chuyên Sơn La" 
                className="w-16 h-16 rounded-2xl bg-white"
              />
              <div>
                <p className="font-bold text-white uppercase text-xs tracking-tighter">Một sáng kiến từ</p>
                <p className="text-emerald-300 font-bold italic">Học sinh THPT Chuyên Sơn La</p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {points.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${point.color}`}>
                  <point.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{point.title}</h3>
                <p className="text-sm text-emerald-100/60 leading-relaxed">{point.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
