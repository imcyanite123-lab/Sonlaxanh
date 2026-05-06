import { Leaf, Facebook, Instagram, Mail, Phone, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-24 pb-12 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-emerald-500 rounded-lg text-white">
                <Leaf size={20} />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-emerald-900">
                Sơn La <span className="text-emerald-500">Xanh</span>
              </span>
            </div>
            <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
              Dự án cộng đồng bảo vệ môi trường thành phố Sơn La. Đồng hành cùng thanh thiếu niên xây dựng tương lai bền vững.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Liên kết</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#map" className="hover:text-emerald-600 transition-colors">Bản đồ điểm xanh</a></li>
              <li><a href="#report" className="hover:text-emerald-600 transition-colors">Báo cáo rác thải</a></li>
              <li><a href="#activities" className="hover:text-emerald-600 transition-colors">Hoạt động cộng đồng</a></li>
              <li><a href="#about" className="hover:text-emerald-600 transition-colors">Về đội ngũ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Liên hệ</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-emerald-500" />
                sonlaxanh.project@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-emerald-500" />
                (+84) 123 456 789
              </li>
              <li className="flex items-start gap-2">
                <Leaf size={16} className="text-emerald-500 mt-1" />
                Trường THPT Chuyên Sơn La, TP. Sơn La
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">
            © 2026 Sơn La Xanh. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            Made with <Heart size={14} className="text-red-400 fill-red-400" /> by 
            <span className="text-emerald-600">Student Team Group 10A</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
