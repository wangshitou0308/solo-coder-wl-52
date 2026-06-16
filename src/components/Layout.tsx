import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Mail,
  Users,
  Landmark,
  BarChart3,
  Plus,
  Feather,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "首页", icon: Home, exact: true },
  { to: "/letters", label: "信件记录", icon: Mail },
  { to: "/contacts", label: "笔友往来", icon: Users },
  { to: "/postcards", label: "明信片地图", icon: Landmark },
  { to: "/dashboard", label: "数据看板", icon: BarChart3 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-parchment-100/30">
      {/* 移动版顶栏 */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-parchment-50/95 backdrop-blur-sm border-b border-parchment-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ink-700 to-ink-600 flex items-center justify-center shadow-md">
              <Feather className="w-5 h-5 text-parchment-100" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-ink-800 leading-tight">
                书信时光
              </div>
              <div className="text-[10px] text-ink-400 leading-tight">
                Letter Memories
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-lg hover:bg-parchment-200/50 transition-colors"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-ink-600" />
            ) : (
              <Menu className="w-5 h-5 text-ink-600" />
            )}
          </button>
        </div>
      </div>

      {/* 移动端遮罩 */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-ink-900/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex">
        {/* 侧边栏 */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 left-0 h-screen z-40",
            "w-72 flex-shrink-0",
            "bg-gradient-to-b from-parchment-50 via-parchment-100/50 to-parchment-50",
            "border-r border-parchment-200/70",
            "transition-transform duration-300 ease-out",
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex flex-col h-full p-5 pt-6 lg:pt-8">
            {/* Logo 区 */}
            <div
              className="flex items-center gap-3 mb-8 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ink-700 via-ink-600 to-ink-700 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-stamp-400/20 to-transparent" />
                <Feather className="w-6 h-6 text-parchment-100 relative z-10" />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-ink-800 leading-tight">
                  书信时光
                </div>
                <div className="text-xs text-ink-400 leading-tight mt-0.5 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Letter Memories
                </div>
              </div>
            </div>

            {/* 快捷新建按钮 */}
            <button
              onClick={() => navigate("/letters/new")}
              className="w-full mb-8 group"
            >
              <div className="relative inline-flex items-center justify-center w-full gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-ink-700 to-ink-600 text-white font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-envelope-500/0 via-stamp-400/20 to-envelope-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">记录新信件</span>
              </div>
            </button>

            {/* 导航菜单 */}
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    isActive ? "nav-item-active" : "nav-item"
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* 底部装饰 */}
            <div className="mt-6 pt-6 border-t border-parchment-200/70">
              <div className="card-parchment p-4 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-stamp-100/50 blur-xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-envelope-500 animate-pulse" />
                    <span className="text-xs font-medium text-ink-500">
                      手写信件的温度
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-ink-600 font-display italic">
                    "每一封信都是一段旅程，每一张明信片都是一道风景。"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 min-w-0 pt-16 lg:pt-0">
          <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
