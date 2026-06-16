import { useMemo } from "react";
import {
  BarChart3,
  Mail,
  Send,
  Inbox,
  Stamp,
  CalendarCheck,
  Users,
  Flame,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { useStore } from "@/store/useStore";
import StatCard from "@/components/StatCard";
import { formatMoney } from "@/utils/format";
import { cn } from "@/lib/utils";

const COLORS = {
  ink: "#2C3E50",
  stamp: "#D4A017",
  envelope: "#C0392B",
  parchment: "#A6874E",
};

export default function Dashboard() {
  const letters = useStore((s) => s.letters);
  const getDashboardStats = useStore((s) => s.getDashboardStats);
  const getMonthlyData = useStore((s) => s.getMonthlyData);
  const getContactRanks = useStore((s) => s.getContactRanks);
  const getHeatmapData = useStore((s) => s.getHeatmapData);
  const getPostageTrend = useStore((s) => s.getPostageTrend);

  const dashboardStats = useMemo(() => getDashboardStats(), [getDashboardStats, letters]);
  const monthlyData = useMemo(() => getMonthlyData(), [getMonthlyData, letters]);
  const contactRanks = useMemo(() => getContactRanks(10), [getContactRanks, letters]);
  const heatmapData = useMemo(() => getHeatmapData(), [getHeatmapData, letters]);
  const postageTrend = useMemo(() => getPostageTrend(), [getPostageTrend, letters]);

  const chartMonthlyData = useMemo(
    () =>
      monthlyData.map((d) => ({
        ...d,
        monthLabel: d.month.slice(5) + "月",
      })),
    [monthlyData]
  );

  const heatmapMatrix = useMemo(() => {
    const years = Array.from(new Set(heatmapData.map((d) => d.year))).sort();
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const maxCount = Math.max(...heatmapData.map((d) => d.count), 1);

    return {
      years,
      months,
      data: years.map((y) =>
        months.map((m) => {
          const found = heatmapData.find((d) => d.year === y && d.month === m);
          return { year: y, month: m, count: found?.count || 0 };
        })
      ),
      maxCount,
    };
  }, [heatmapData]);

  const getHeatmapColor = (count: number, max: number) => {
    if (count === 0) return "bg-parchment-50 text-ink-300";
    const ratio = count / max;
    if (ratio <= 0.2) return "bg-ink-100 text-ink-600";
    if (ratio <= 0.4) return "bg-ink-200 text-ink-700";
    if (ratio <= 0.6) return "bg-ink-300 text-ink-800";
    if (ratio <= 0.8) return "bg-ink-500 text-white";
    return "bg-ink-700 text-white";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title">
          <BarChart3 className="w-7 h-7 text-envelope-600" />
          数据看板
        </h1>
        <p className="mt-2 text-ink-500 text-sm ml-4">
          全面查看你的书信往来数据与趋势
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <StatCard
          title="总信件数"
          value={dashboardStats.totalLetters}
          icon={<Mail className="w-full h-full" />}
          accent="ink"
          description={`今年 ${dashboardStats.yearLetters} 封`}
        />
        <StatCard
          title="总明信片数"
          value={dashboardStats.totalPostcards}
          icon={<Stamp className="w-full h-full" />}
          accent="parchment"
          description={`今年 ${dashboardStats.yearPostcards} 张`}
        />
        <StatCard
          title="寄出总数"
          value={dashboardStats.totalSent}
          icon={<Send className="w-full h-full" />}
          accent="stamp"
          description="寄出的信与明信片"
        />
        <StatCard
          title="收到总数"
          value={dashboardStats.totalReceived}
          icon={<Inbox className="w-full h-full" />}
          accent="envelope"
          description={`待回信 ${dashboardStats.pendingReplies} 封`}
        />
      </section>

      <section className="card-parchment p-5 lg:p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-ink-500 to-ink-700 text-white shadow-lg ring-4 ring-ink-200/40">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-ink-800">
                年度收发统计
              </h2>
              <p className="text-sm text-ink-500">按月统计寄出与收到的信件数量</p>
            </div>
          </div>
        </div>

        <div className="h-[320px] w-full">
          {chartMonthlyData.every((d) => d.total === 0) ? (
            <div className="h-full flex flex-col items-center justify-center text-ink-400">
              <CalendarCheck className="w-12 h-12 mb-3 opacity-40" />
              <p>暂无数据</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartMonthlyData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#EDE2C9"
                  vertical={false}
                />
                <XAxis
                  dataKey="monthLabel"
                  tick={{ fill: "#67809A", fontSize: 12 }}
                  axisLine={{ stroke: "#D4BD87" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#67809A", fontSize: 12 }}
                  axisLine={{ stroke: "#D4BD87" }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FDFBF5",
                    border: "1px solid #EDE2C9",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(44,62,80,0.1)",
                    fontFamily: "inherit",
                  }}
                  labelStyle={{
                    fontWeight: 600,
                    color: "#2C3E50",
                    marginBottom: 8,
                  }}
                  itemStyle={{
                    color: "#445C78",
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 16 }}
                  iconType="rect"
                />
                <Bar
                  dataKey="sent"
                  name="寄出"
                  fill={COLORS.ink}
                  radius={[6, 6, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="received"
                  name="收到"
                  fill={COLORS.stamp}
                  radius={[6, 6, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        <section className="card-parchment p-5 lg:p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-envelope-400 to-envelope-600 text-white shadow-lg ring-4 ring-envelope-200/40">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-ink-800">
                最常通信联系人 TOP10
              </h2>
              <p className="text-sm text-ink-500">按通信总数量排序</p>
            </div>
          </div>

          <div className="h-[380px] w-full">
            {contactRanks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-ink-400">
                <Users className="w-12 h-12 mb-3 opacity-40" />
                <p>暂无数据</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...contactRanks].reverse()}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#EDE2C9"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#67809A", fontSize: 12 }}
                    axisLine={{ stroke: "#D4BD87" }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#445C78", fontSize: 12 }}
                    axisLine={{ stroke: "#D4BD87" }}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FDFBF5",
                      border: "1px solid #EDE2C9",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(44,62,80,0.1)",
                      fontFamily: "inherit",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
                    iconType="rect"
                  />
                  <Bar
                    dataKey="sent"
                    name="寄出"
                    stackId="a"
                    fill={COLORS.ink}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="received"
                    name="收到"
                    stackId="a"
                    fill={COLORS.stamp}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="card-parchment p-5 lg:p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-parchment-500 to-parchment-700 text-white shadow-lg ring-4 ring-parchment-300/40">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-ink-800">
                热力月份图
              </h2>
              <p className="text-sm text-ink-500">颜色深浅表示当月通信数量</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left py-2 px-2 font-medium text-ink-400 w-14 sticky left-0 bg-parchment-50">
                    年份
                  </th>
                  {heatmapMatrix.months.map((m) => (
                    <th
                      key={m}
                      className="py-2 px-1 font-medium text-ink-400 text-center"
                    >
                      {m}月
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapMatrix.years.map((year, yIdx) => (
                  <tr key={year} className="border-t border-parchment-200/60">
                    <td className="py-2 px-2 font-display font-semibold text-ink-700 sticky left-0 bg-parchment-50">
                      {year}
                    </td>
                    {heatmapMatrix.data[yIdx].map((cell) => (
                      <td key={`${year}-${cell.month}`} className="py-1.5 px-1">
                        <div
                          className={cn(
                            "aspect-square rounded-lg flex items-center justify-center font-medium transition-all hover:scale-105 cursor-default",
                            getHeatmapColor(cell.count, heatmapMatrix.maxCount)
                          )}
                          title={`${year}年${cell.month}月：${cell.count} 封`}
                        >
                          {cell.count > 0 ? cell.count : ""}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="text-xs text-ink-400">少</span>
            <div className="flex gap-1">
              {[
                "bg-parchment-50 border border-parchment-200",
                "bg-ink-100",
                "bg-ink-200",
                "bg-ink-300",
                "bg-ink-500",
                "bg-ink-700",
              ].map((c, i) => (
                <div
                  key={i}
                  className={cn("w-6 h-6 rounded-md", c)}
                />
              ))}
            </div>
            <span className="text-xs text-ink-400">多</span>
          </div>
        </section>
      </div>

      <section className="card-parchment p-5 lg:p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-stamp-400 to-stamp-600 text-white shadow-lg ring-4 ring-stamp-200/40">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-ink-800">
                邮资趋势图
              </h2>
              <p className="text-sm text-ink-500">按月统计累计邮资支出</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <Stamp className="w-4 h-4 text-stamp-500" />
            <span>
              累计邮资：
              <b className="text-stamp-700 font-semibold">
                {formatMoney(
                  postageTrend.reduce((sum, d) => sum + d.postage, 0)
                )}
              </b>
            </span>
          </div>
        </div>

        <div className="h-[320px] w-full">
          {postageTrend.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-ink-400">
              <Stamp className="w-12 h-12 mb-3 opacity-40" />
              <p>暂无邮资数据</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={postageTrend}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="postageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.stamp} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.stamp} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#EDE2C9"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#67809A", fontSize: 12 }}
                  axisLine={{ stroke: "#D4BD87" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#67809A", fontSize: 12 }}
                  axisLine={{ stroke: "#D4BD87" }}
                  tickLine={false}
                  tickFormatter={(v) => `¥${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FDFBF5",
                    border: "1px solid #EDE2C9",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(44,62,80,0.1)",
                    fontFamily: "inherit",
                  }}
                  labelStyle={{
                    fontWeight: 600,
                    color: "#2C3E50",
                    marginBottom: 8,
                  }}
                  formatter={(value: number) => [formatMoney(value), "邮资"]}
                />
                <Area
                  type="monotone"
                  dataKey="postage"
                  name="邮资"
                  stroke={COLORS.stamp}
                  strokeWidth={3}
                  fill="url(#postageGradient)"
                  dot={{
                    r: 4,
                    fill: "#fff",
                    stroke: COLORS.stamp,
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: COLORS.stamp,
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="postage"
                  name="趋势线"
                  stroke={COLORS.envelope}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  legendType="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}
