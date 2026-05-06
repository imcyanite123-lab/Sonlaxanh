import { motion } from 'motion/react';
import { MapPin, Users, Leaf, Trash2 } from 'lucide-react';

const stats = [
  { label: 'Điểm thu gom', value: '12', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Hoạt động Xanh', value: '58', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Tình nguyện viên', value: '250+', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Số điểm đã dọn', value: '104', icon: Trash2, color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function Statistics() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon size={32} />
              </div>
              <p className="text-4xl font-black text-slate-900 mb-1">{stat.value}</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
