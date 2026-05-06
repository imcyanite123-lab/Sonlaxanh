import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CollectionPoint } from '../types';
import { MapPin, Info, Recycle } from 'lucide-react';
import { motion } from 'motion/react';

// For leaflet icons in Vite
const customIcon = new Icon({
  iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
  iconSize: [38, 38]
});

const officialPoints: Partial<CollectionPoint>[] = [
  { id: '1', name: 'Điểm thu gom Pin - Chợ Trung Tâm', address: 'P. Chiềng Lề, TP. Sơn La', type: 'Pin cũ, Điện tử', lat: 21.3290, lng: 103.9150 },
  { id: '2', name: 'Trạm xanh - THPT Chuyên Sơn La', address: 'Số 06, đường Tô Hiệu', type: 'Nhựa, Giấy, Lon', lat: 21.3320, lng: 103.9080 },
  { id: '3', name: 'Điểm đổi rác lấy cây - Công viên 26/10', address: 'Quảng trường Tây Bắc', type: 'Tổng hợp', lat: 21.3250, lng: 103.9180 },
];

export default function MapSection() {
  const [points, setPoints] = useState<CollectionPoint[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'collection_points'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CollectionPoint));
      // Combine with local mock data for demo if DB is empty
      if (data.length === 0) {
        setPoints(officialPoints as CollectionPoint[]);
      } else {
        setPoints(data);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="map" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-slate-900 mb-4 transition-all">Bản đồ xanh Sơn La</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Tìm kiếm các địa điểm thu gom rác thải tái chế, pin cũ và các "Trạm Xanh" gần bạn nhất để cùng phân loại rác tại nguồn.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {points.map((point) => (
              <motion.div 
                key={point.id}
                whileHover={{ x: 5 }}
                className="p-5 rounded-2xl border border-green-100 bg-white hover:bg-green-50 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 rounded-xl text-green-600 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight mb-1">{point.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">{point.address}</p>
                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">
                      {point.type}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3 text-blue-800 italic text-sm">
              <Info className="flex-shrink-0" size={20} />
              <p>Mẹo: Bạn có thể nhấn vào các điểm trên bản đồ để xem chi tiết hướng dẫn thu gom.</p>
            </div>
          </div>

          <div className="lg:col-span-2 relative">
            <MapContainer 
              center={[21.3283, 103.9142]} 
              zoom={14} 
              scrollWheelZoom={false}
              className="rounded-[2.5rem] border-8 border-white shadow-2xl relative z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {points.map((point) => (
                <Marker key={point.id} position={[point.lat, point.lng]} icon={customIcon}>
                  <Popup>
                    <div className="p-3 min-w-[200px]">
                      <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2">{point.name}</h3>
                      <p className="text-xs text-slate-600 mb-1"><b>Địa chỉ:</b> {point.address}</p>
                      <p className="text-xs text-slate-600 mb-3"><b>Loại rác:</b> {point.type}</p>
                      <button className="w-full py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                        Chỉ đường
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
