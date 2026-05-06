import { motion } from 'motion/react';
import { MapPin, Users, Leaf, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Statistics() {
  const [counts, setCounts] = useState({
    points: 0,
    activities: 0,
    volunteers: 0,
    reports: 0
  });

  useEffect(() => {
    const unsubPoints = onSnapshot(collection(db, 'collection_points'), s => setCounts(prev => ({ ...prev, points: s.size })));
    const unsubActs = onSnapshot(collection(db, 'activities'), s => setCounts(prev => ({ ...prev, activities: s.size })));
    const unsubReports = onSnapshot(collection(db, 'reports'), s => setCounts(prev => ({ ...prev, reports: s.size })));
    
    // For volunteers, we could count users if we had a users collection, 
    // or just use a placeholder that starts at 1 (the founder)
    setCounts(prev => ({ ...prev, volunteers: 1 }));

    return () => {
      unsubPoints();
      unsubActs();
      unsubReports();
    };
  }, []);

  const stats = [
    { label: 'Điểm thu gom', value: counts.points.toString(), icon: MapPin, color: 'text-green-600', bg: 'bg-white', border: 'border-green-100' },
    { label: 'Hoạt động', value: counts.activities.toString(), icon: Leaf, color: 'text-white', bg: 'bg-green-600', border: 'border-transparent', isDark: true },
    { label: 'Tình nguyện viên', value: counts.volunteers.toString(), icon: Users, color: 'text-green-600', bg: 'bg-white', border: 'border-green-100' },
    { label: 'Điểm rác báo cáo', value: counts.reports.toString(), icon: Trash2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  ];

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
              className={`p-8 rounded-[2rem] border ${stat.border} ${stat.bg} shadow-xl shadow-green-900/5 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300`}
            >
              <div className={`p-4 ${stat.isDark ? 'bg-white/20' : 'bg-slate-50'} ${stat.isDark ? 'text-white' : stat.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon size={32} />
              </div>
              <p className={`text-4xl font-black ${stat.isDark ? 'text-white' : 'text-slate-900'} mb-1`}>{stat.value}</p>
              <p className={`text-xs font-bold uppercase tracking-widest ${stat.isDark ? 'text-green-100' : 'text-slate-400'}`}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
