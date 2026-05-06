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
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold font-display text-emerald-950 mb-4 italic">Green Footmarks</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Những dấu chân xanh của cộng đồng Sơn La. Hãy cùng chúng tôi lan tỏa lối sống xanh thông qua các hoạt động thiết thực sắp tới.
            </p>
          </div>
          <button className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-100 transition-colors flex items-center gap-2">
            Tất cả hoạt động
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-[2rem] aspect-[4/5] shadow-lg group-hover:shadow-2xl transition-all duration-500">
                <img 
                  src={activity.image} 
                  alt={activity.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/20 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    {activity.category}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-4 text-emerald-100 text-xs mb-3 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-emerald-400" />
                      {activity.date}
                    </span>
                    <span className="w-1 h-1 bg-emerald-800 rounded-full" />
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-emerald-400" />
                      {activity.participants} tham gia
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-emerald-400 transition-colors">
                    {activity.title}
                  </h3>
                  <div className="flex items-center gap-2 text-emerald-200/80 text-sm italic">
                    <MapPin size={14} />
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
