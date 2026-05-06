import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { Icon } from 'leaflet';
import 'leaflet.heat';
import { useState, useEffect, useRef, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CollectionPoint, TrashReport } from '../types';
import { MapPin, Info, Recycle, Search, X, Filter, Share2, Check, Navigation, Trash, AlertTriangle, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// For leaflet icons in Vite
const customIcon = new Icon({
  iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
  iconSize: [38, 38]
});

const reportIcon = new Icon({
  iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678110-map-marker-512.png',
  iconSize: [32, 32]
});

const userIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/711/711769.png',
  iconSize: [32, 32]
});

const officialPoints: Partial<CollectionPoint>[] = [
  { id: '1', name: 'Điểm thu gom Pin - Chợ Trung Tâm', address: 'P. Chiềng Lề, TP. Sơn La', type: 'Pin cũ, Điện tử', lat: 21.3290, lng: 103.9150 },
  { id: '2', name: 'Trạm xanh - THPT Chuyên Sơn La', address: 'Số 06, đường Tô Hiệu', type: 'Nhựa, Giấy, Lon', lat: 21.3320, lng: 103.9080 },
  { id: '3', name: 'Điểm đổi rác lấy cây - Công viên 26/10', address: 'Quảng trường Tây Bắc', type: 'Tổng hợp', lat: 21.3250, lng: 103.9180 },
];

const WASTE_TYPES = ['Tất cả', 'Nhựa', 'Giấy', 'Pin', 'Kim loại', 'Tổng hợp'];
const REPORT_STATUSES = ['Tất cả', 'pending', 'verified', 'cleaned'];

// Heatmap Layer Component
function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map || points.length === 0) return;
    // @ts-ignore
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

// Map Controller for centering
function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15, { animate: true });
    }
  }, [map, center]);
  return null;
}

export default function MapSection() {
  const [points, setPoints] = useState<CollectionPoint[]>([]);
  const [reports, setReports] = useState<TrashReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const listRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Geolocation on load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(loc);
          setMapCenter(loc);
        },
        (error) => console.warn("Geolocation permission denied or error:", error)
      );
    }

    // Fetch Collection Points
    const qPoints = query(collection(db, 'collection_points'));
    const unsubPoints = onSnapshot(qPoints, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CollectionPoint));
      if (data.length === 0) {
        setPoints(officialPoints as CollectionPoint[]);
      } else {
        setPoints(data);
      }
    });

    // Fetch Reports
    const qReports = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    const unsubReports = onSnapshot(qReports, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrashReport));
      setReports(data);
    });

    return () => {
      unsubPoints();
      unsubReports();
    };
  }, []);

  const filteredPoints = useMemo(() => {
    return points.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'Tất cả' || p.type.toLowerCase().includes(selectedType.toLowerCase());
      return matchesSearch && matchesType;
    });
  }, [points, searchQuery, selectedType]);

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'Tất cả' || r.type.toLowerCase().includes(selectedType.toLowerCase());
      const matchesStatus = selectedStatus === 'Tất cả' || r.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reports, searchQuery, selectedType, selectedStatus]);

  const heatmapPoints = useMemo((): [number, number, number][] => {
    return reports.map(r => [r.lat, r.lng, r.priority === 'high' ? 1.0 : 0.5]);
  }, [reports]);

  const handleMarkerClick = (id: string) => {
    setSelectedId(id);
    listRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleShare = (point: CollectionPoint | TrashReport) => {
    const name = 'name' in point ? point.name : (point as TrashReport).title;
    const address = 'address' in point ? point.address : (point as TrashReport).locationName;
    const type = point.type;
    const shareText = `Điểm [${type}]: ${name} tại ${address}. Cùng Sơn La Xanh bảo vệ môi trường!`;
    const url = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: 'Sơn La Xanh',
        text: shareText,
        url: url
      });
    } else {
      navigator.clipboard.writeText(`${shareText} - ${url}`);
      setCopiedId(point.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(loc);
          setMapCenter(loc);
        },
        (error) => alert("Không thể lấy vị trí: " + error.message)
      );
    }
  };

  return (
    <section id="map" className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-slate-900 mb-4 transition-all">Bản đồ xanh Sơn La</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Tìm kiếm các địa điểm thu gom rác thải tái chế và theo dõi các điểm nóng rác thải được cộng đồng báo cáo.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {/* Control Bar */}
            <div className="flex gap-2">
              <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border font-bold transition-all ${showHeatmap ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-200' : 'bg-white border-slate-100 text-slate-500 shadow-sm hover:bg-slate-50'}`}
              >
                <Layers size={18} />
                Heatmap: {showHeatmap ? 'Bật' : 'Tắt'}
              </button>
              <button 
                onClick={handleMyLocation}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-100 text-slate-500 font-bold shadow-sm hover:bg-green-50 hover:text-green-600 transition-all"
              >
                <Navigation size={18} />
                Vị trí của tôi
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-5 py-4 pl-10 rounded-2xl bg-white border border-green-100 focus:border-green-500 outline-none appearance-none cursor-pointer font-bold text-xs text-slate-700 shadow-sm"
                >
                  <option value="Tất cả">Loại: Tất cả</option>
                  {WASTE_TYPES.slice(1).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <Filter className="absolute left-3.5 top-4.5 text-green-600" size={14} />
              </div>
              <div className="relative">
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-5 py-4 pl-10 rounded-2xl bg-white border border-green-100 focus:border-green-500 outline-none appearance-none cursor-pointer font-bold text-xs text-slate-700 shadow-sm"
                >
                  <option value="Tất cả">Trạng thái: Tất cả</option>
                  <option value="pending">Đang chờ</option>
                  <option value="verified">Đã xác minh</option>
                  <option value="cleaned">Đã dọn dẹp</option>
                </select>
                <AlertTriangle className="absolute left-3.5 top-4.5 text-amber-500" size={14} />
              </div>
            </div>

            {/* Search Input */}
            <div className="relative group">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm địa điểm..."
                className="w-full px-5 py-4 pl-12 rounded-2xl bg-white border border-green-100 focus:border-green-500 outline-none transition-all shadow-sm placeholder:text-slate-300 font-medium"
              />
              <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-green-500 transition-colors" size={20} />
            </div>

            <div className="max-h-[460px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {/* Collection Points in List */}
              {filteredPoints.map((point) => (
                <motion.div 
                  key={point.id}
                  ref={el => listRefs.current[point.id] = el}
                  whileHover={{ x: 5 }}
                  onClick={() => handleMarkerClick(point.id)}
                  className={`p-5 rounded-2xl border bg-white shadow-sm transition-all cursor-pointer group ${selectedId === point.id ? 'border-green-500 ring-2 ring-green-100' : 'border-green-50'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${selectedId === point.id ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600'}`}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight mb-1">{point.name}</h4>
                      <p className="text-xs text-slate-500 mb-2">{point.address}</p>
                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-bold uppercase tracking-wider">
                        {point.type}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Reports in List */}
              {filteredReports.map((report) => (
                <motion.div 
                  key={report.id}
                  ref={el => listRefs.current[report.id] = el}
                  whileHover={{ x: 5 }}
                  onClick={() => handleMarkerClick(report.id)}
                  className={`p-5 rounded-2xl border bg-white shadow-sm transition-all cursor-pointer group ${selectedId === report.id ? 'border-amber-500 ring-2 ring-amber-100' : 'border-red-50'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${selectedId === report.id ? 'bg-amber-600 text-white' : 'bg-red-50 text-red-600'}`}>
                      <Trash size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight mb-1">{report.title}</h4>
                      <p className="text-xs text-slate-500 mb-2">{report.locationName}</p>
                      <div className="flex gap-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          report.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          report.status === 'verified' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {report.status}
                        </span>
                        {report.priority === 'high' && (
                          <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-bold uppercase tracking-wider">
                            Cấp bách
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredPoints.length === 0 && filteredReports.length === 0 && (
                <div className="text-center py-10 text-slate-400 font-medium italic">
                  Không tìm thấy kết quả phù hợp.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 relative h-[600px] lg:h-full min-h-[400px]">
            <MapContainer 
              center={[21.3283, 103.9142]} 
              zoom={14} 
              scrollWheelZoom={false}
              className="rounded-[2.5rem] border-8 border-white shadow-2xl relative z-0 h-full w-full"
            >
              <MapController center={mapCenter} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {showHeatmap && <HeatmapLayer points={heatmapPoints} />}

              {/* User Location Marker */}
              {userLocation && (
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>Bạn đang ở đây</Popup>
                </Marker>
              )}

              {/* Collection Points Markers */}
              {filteredPoints.map((point) => (
                <Marker 
                  key={point.id} 
                  position={[point.lat, point.lng]} 
                  icon={customIcon}
                  eventHandlers={{ click: () => handleMarkerClick(point.id) }}
                >
                  <Popup>
                    <div className="p-3 min-w-[200px]">
                      <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2 italic">{point.name}</h3>
                      <p className="text-xs text-slate-600 mb-1"><b>Địa chỉ:</b> {point.address}</p>
                      <p className="text-xs text-slate-600 mb-3"><b>Loại rác:</b> {point.type}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`, '_blank')}
                          className="flex-1 py-2 bg-green-600 text-white rounded-lg text-[10px] uppercase font-bold tracking-wider hover:bg-green-700 transition-colors"
                        >
                          Chỉ đường
                        </button>
                        <button 
                          onClick={() => handleShare(point)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg border ${copiedId === point.id ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-100 text-slate-400'}`}
                        >
                          {copiedId === point.id ? <Check size={16} /> : <Share2 size={16} />}
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Report Markers */}
              {filteredReports.map((report) => (
                <Marker 
                  key={report.id} 
                  position={[report.lat, report.lng]} 
                  icon={reportIcon}
                  eventHandlers={{ click: () => handleMarkerClick(report.id) }}
                >
                  <Popup>
                    <div className="p-3 min-w-[220px]">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                         <h3 className="font-bold text-slate-900 italic uppercase tracking-tighter text-sm">{report.title}</h3>
                         <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest ${report.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                           {report.priority === 'high' ? 'NGUY CẤP' : 'THƯỜNG'}
                         </span>
                      </div>
                      
                      <div className="space-y-1.5 mb-4">
                        <p className="text-[11px] text-slate-600 flex items-center gap-1">
                          <MapPin size={10} className="text-slate-400" />
                          {report.locationName}
                        </p>
                        <p className="text-[11px] text-slate-500 italic">"{report.description}"</p>
                        <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                          <span>BV: {report.reporterName || `User #${report.reporterId.slice(-4)}`}</span>
                          <span>{report.createdAt ? (report.createdAt as any).toDate?.().toLocaleString('vi-VN') : 'Hiện nay'}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                         <button 
                          onClick={() => handleShare(report)}
                          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${copiedId === report.id ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-100 text-slate-500'}`}
                        >
                           {copiedId === report.id ? <Check size={14} /> : <Share2 size={14} />}
                           {copiedId === report.id ? 'Đã sao chép' : 'Chia sẻ'}
                         </button>
                      </div>
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
