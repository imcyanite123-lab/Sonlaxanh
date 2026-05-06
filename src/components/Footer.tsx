import { Leaf, Facebook, Instagram, Mail, Phone, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-24 pb-12 px-6 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-green-600 rounded-xl text-white shadow-lg shadow-green-200">
                <Leaf size={22} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Sơn La <span className="text-green-600">Xanh</span>
              </span>
            </div>
            <p className="text-slate-500 max-w-sm mb-10 leading-relaxed text-lg">
              Dự án cộng đồng bảo vệ môi trường thành phố Sơn La. Đồng hành cùng thanh thiếu niên xây dựng tương lai bền vững.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-all shadow-sm">
                <Facebook size={24} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-all shadow-sm">
                <Instagram size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-8 uppercase text-xs tracking-widest">Khám phá</h4>
            <ul className="space-y-5 text-slate-500 font-medium">
              <li><a href="#map" className="hover:text-green-600 transition-colors">Bản đồ điểm xanh</a></li>
              <li><a href="#report" className="hover:text-green-600 transition-colors">Báo cáo rác thải</a></li>
              <li><a href="#activities" className="hover:text-green-600 transition-colors">Hoạt động cộng đồng</a></li>
              <li><a href="#about" className="hover:text-green-600 transition-colors">Về đội ngũ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-8 uppercase text-xs tracking-widest">Liên kết</h4>
            <ul className="space-y-5 text-slate-500 font-medium italic">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-green-500" />
                contact@sonlaxanh.vn
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-green-500" />
                (+84) 123 456 789
              </li>
              <li className="flex items-start gap-3">
                <Leaf size={18} className="text-green-500 mt-1" />
                THPT Chuyên Sơn La
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <span>FACEBOOK / SONLAXANH</span>
            <span>INSTAGRAM / @GREEN_SONLA</span>
            <span>EMAIL / CONTACT@SONLAXANH.VN</span>
          </div>
          <div className="text-[10px] font-medium text-slate-500 text-center md:text-right">
            Bản quyền © 2026 Dự án Hoạt động trải nghiệm hướng nghiệp - THPT Chuyên Sơn La
          </div>
        </div>
      </div>
    </footer>
  );
}
