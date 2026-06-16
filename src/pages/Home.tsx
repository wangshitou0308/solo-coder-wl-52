import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Map as MapIcon,
  PenLine,
  Users,
  BarChart3,
  CalendarDays,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import StatCard from "@/components/StatCard";
import LetterCard from "@/components/LetterCard";
import { formatMoney, getWaitingBadgeColor } from "@/utils/format";
import { cn } from "@/lib/utils";

export default function Home() {
  const navigate = useNavigate();

  const letters = useStore((s) => s.letters);
  const getDashboardStats = useStore((s) => s.getDashboardStats);
  const getPendingReplies = useStore((s) => s.getPendingReplies);
  const markLetterReplied = useStore((s) => s.markLetterReplied);

  const dashboardStats = useMemo(() => getDashboardStats(), [getDashboardStats, letters]);
  const pendingReplies = useMemo(() => getPendingReplies(), [getPendingReplies, letters]);

  const recentLetters = useMemo(() => {
    return [...letters]
      .sort((a, b) => {
        const da = a.received_date || a.sent_date || a.created_at;
        const db = b.received_date || b.sent_date || b.created_at;
        return db.localeCompare(da);
      })
      .slice(0, 5);
  }, [letters]);

  const handleMarkReplied = async (letterId: string) => {
    await markLetterReplied(letterId);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-ink-800 mb-2">
              欢迎回来
              <Sparkles className="inline-block w-7 h-7 ml-2 text-stamp-500" />
            </h1>
            <p className="text-ink-500">管理你的信件往来，记录每一次鸿雁传书</p>
          </div>
          <Link to="/letters/new" className="btn-primary">
            <PenLine className="w-4 h-4" />
            记录新信件
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          <StatCard
            title="今年信件"
            value={dashboardStats.yearLetters}
            icon={<Mail className="w-full h-full" />}
            accent="ink"
            description={`累计 ${dashboardStats.totalLetters} 封`}
          />
          <StatCard
            title="今年明信片"
            value={dashboardStats.yearPostcards}
            icon={<MapIcon className="w-full h-full" />}
            accent="parchment"
            description={`累计 ${dashboardStats.totalPostcards} 张`}
          />
          <StatCard
            title="待回信数"
            value={dashboardStats.pendingReplies}
            icon={<Clock className="w-full h-full" />}
            accent="envelope"
            description={
              dashboardStats.pendingReplies > 0
                ? "请尽快回复"
                : "暂无待回复信件"
            }
          />
          <StatCard
            title="总邮资"
            value={formatMoney(dashboardStats.totalPostage)}
            icon={<PenLine className="w-full h-full" />}
            accent="stamp"
            description={`寄出 ${dashboardStats.totalSent} 封`}
          />
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="section-title">待回信提醒</h2>
          {pendingReplies.length > 0 && (
            <Link
              to="/letters?direction=received&replied=pending"
              className="text-sm text-ink-500 hover:text-ink-700 flex items-center gap-1 transition-colors"
            >
              查看全部
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {pendingReplies.length === 0 ? (
          <div className="card-parchment p-10 text-center">
            <CheckCircle2 className="w-12 h-12 text-stamp-400 mx-auto mb-3" />
            <p className="text-ink-600 font-medium">太棒了！所有来信都已回复</p>
            <p className="text-sm text-ink-400 mt-1">保持这份积极的书信往来吧</p>
          </div>
        ) : (
          <div className="card-parchment divide-y divide-parchment-200/60 overflow-hidden">
            {pendingReplies.map(({ letter, waitingDays }) => (
              <div
                key={letter.id}
                className="p-4 lg:p-5 flex items-center gap-4 hover:bg-parchment-100/40 transition-colors"
              >
                <div
                  className={cn(
                    "w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                    "bg-gradient-to-br from-ink-500 to-ink-700 text-white shadow-md ring-4 ring-ink-200/40"
                  )}
                >
                  <Mail className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-ink-800 text-lg truncate">
                      {letter.contact_name}
                    </h3>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm",
                        getWaitingBadgeColor(waitingDays)
                      )}
                    >
                      等待 {waitingDays} 天
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      收到：{letter.received_date || "—"}
                    </span>
                    {letter.contact_city && (
                      <span className="flex items-center gap-1.5">
                        <MapIcon className="w-3.5 h-3.5" />
                        {letter.contact_city}
                        {letter.contact_country && ` · ${letter.contact_country}`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleMarkReplied(letter.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-stamp-50 text-stamp-700 border border-stamp-200 hover:bg-stamp-100 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    标记已回复
                  </button>
                  <button
                    onClick={() => navigate(`/letters/${letter.id}`)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-500 hover:bg-parchment-200/60 hover:text-ink-700 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="section-title">最近记录</h2>
          <Link
            to="/letters"
            className="text-sm text-ink-500 hover:text-ink-700 flex items-center gap-1 transition-colors"
          >
            查看全部
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentLetters.length === 0 ? (
          <div className="card-parchment p-10 text-center">
            <Mail className="w-12 h-12 text-ink-300 mx-auto mb-3" />
            <p className="text-ink-500">还没有任何信件记录</p>
            <Link to="/letters/new" className="btn-secondary mt-4 inline-flex">
              <PenLine className="w-4 h-4" />
              添加第一封信
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
            {recentLetters.map((letter) => (
              <LetterCard
                key={letter.id}
                letter={letter}
                compact
                onMarkReplied={handleMarkReplied}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <h2 className="section-title">快捷入口</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          <Link
            to="/letters/new"
            className="card-parchment p-5 lg:p-6 group relative overflow-hidden hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-[0.08] bg-gradient-to-br from-ink-500 to-ink-700 blur-2xl pointer-events-none"
            />
            <div
              className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br from-ink-500 to-ink-700 text-white shadow-lg ring-4 ring-ink-200/50"
            >
              <PenLine className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <h3 className="relative font-display font-bold text-ink-800 text-lg mb-1">
              记录新信件
            </h3>
            <p className="relative text-sm text-ink-500">记录寄出或收到的信件</p>
            <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-ink-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/contacts"
            className="card-parchment p-5 lg:p-6 group relative overflow-hidden hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-[0.08] bg-gradient-to-br from-stamp-400 to-stamp-600 blur-2xl pointer-events-none"
            />
            <div
              className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br from-stamp-400 to-stamp-600 text-white shadow-lg ring-4 ring-stamp-200/50"
            >
              <Users className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <h3 className="relative font-display font-bold text-ink-800 text-lg mb-1">
              浏览笔友
            </h3>
            <p className="relative text-sm text-ink-500">管理你的通信联系人</p>
            <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-ink-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/map"
            className="card-parchment p-5 lg:p-6 group relative overflow-hidden hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-[0.08] bg-gradient-to-br from-parchment-500 to-parchment-700 blur-2xl pointer-events-none"
            />
            <div
              className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br from-parchment-500 to-parchment-700 text-white shadow-lg ring-4 ring-parchment-300/50"
            >
              <MapIcon className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <h3 className="relative font-display font-bold text-ink-800 text-lg mb-1">
              明信片地图
            </h3>
            <p className="relative text-sm text-ink-500">在地图上查看明信片分布</p>
            <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-ink-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/dashboard"
            className="card-parchment p-5 lg:p-6 group relative overflow-hidden hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-[0.08] bg-gradient-to-br from-envelope-400 to-envelope-600 blur-2xl pointer-events-none"
            />
            <div
              className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br from-envelope-400 to-envelope-600 text-white shadow-lg ring-4 ring-envelope-200/50"
            >
              <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <h3 className="relative font-display font-bold text-ink-800 text-lg mb-1">
              数据看板
            </h3>
            <p className="relative text-sm text-ink-500">查看详细统计与趋势</p>
            <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-ink-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </section>
    </div>
  );
}
