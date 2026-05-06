import { motion } from 'motion/react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

const activities = [
  {
    id: 1,
    title: "Chủ nhật Xanh - Dọn sạch Suối Nậm La",
    date: "25/08/2026",
    location: "Khu vực Cầu trắng, TP. Sơn La",
    participants: 45,
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fafa5?q=80&w=2670&auto=format&fit=crop",
    category: "Dọn dẹp"
  },
  {
    id: 2,
    title: "Trạm đổi Pin cũ lấy Sen đá",
    date: "12/09/2026",
    location: "Cổng THPT Chuyên Sơn La",
    participants: 120,
    image: "https://images.unsplash.com/photo-1594498257602-0175c0733799?q=80&w=2670&auto=format&fit=crop",
    category: "Tái chế"
  },
  {
    id: 3,
    title: "Workshop: Tái chế nhựa thành đồ dùng",
    date: "30/09/2026",
    location: "Nhà văn hóa thành phố",
    participants: 30,
    image: "https://images.unsplash.com/photo-1544333346-646706e30018?q=80&w=2670&auto=format&fit=crop",
    category: "Giáo dục"
  }
];

export default function ActivitySection() {
  return (
    <section id="activities" className="py-20 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-6xl font-extrabold font-display text-slate-900 mb-6 italic transition-all">Green Footmarks</h2>
            <p className="text-slate-600 leading-relaxed text-xl">
              Những dấu chân xanh của cộng đồng Sơn La. Hãy cùng chúng tôi lan tỏa lối sống xanh thông qua các hoạt động thiết thực sắp tới.
            </p>
          </div>
          <button className="px-8 py-4 bg-green-50 text-green-700 rounded-2xl font-bold hover:bg-green-100 transition-colors flex items-center gap-3 active:scale-95">
            Tất cả hoạt động
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-[2.5rem] bg-white aspect-[4/5] shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-green-50">
                <img 
                  src={activity.image} 
                  alt={activity.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-900/20 to-transparent" />
                
                <div className="absolute top-6 left-6">
                  <span className="px-5 py-2 bg-green-600 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-xl shadow-green-950/20">
                    {activity.category}
                  </span>
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
          ))}
        </div>
      </div>
    </section>
  );
}
