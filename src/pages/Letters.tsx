import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Mail,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
  Plus,
  CalendarDays,
  Users,
  Stamp,
  MessageCircle,
} from "lucide-react";
import LetterCard from "@/components/LetterCard";
import Empty from "@/components/Empty";
import { useStore } from "@/store/useStore";
import { SortField, Contact, LetterType, Direction, RepliedFilter } from "@/types";
import { cn } from "@/lib/utils";

export default function Letters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const loading = useStore((s) => s.loading);
  const filters = useStore((s) => s.filters);
  const setFilters = useStore((s) => s.setFilters);
  const resetFilters = useStore((s) => s.resetFilters);
  const sortField = useStore((s) => s.sortField);
  const sortOrder = useStore((s) => s.sortOrder);
  const setSort = useStore((s) => s.setSort);
  const filteredLetters = useStore((s) => s.filteredLetters);
  const getAvailableYears = useStore((s) => s.getAvailableYears);
  const contacts = useStore((s) => s.contacts);
  const removeLetter = useStore((s) => s.removeLetter);
  const markLetterReplied = useStore((s) => s.markLetterReplied);
  const letters = useStore((s) => s.letters);

  useEffect(() => {
    const initial: Record<string, any> = {};
    const direction = searchParams.get("direction");
    const type = searchParams.get("type");
    const replied = searchParams.get("replied");
    const contactId = searchParams.get("contactId");
    const year = searchParams.get("year");
    const search = searchParams.get("search");

    if (direction === "sent" || direction === "received") initial.direction = direction;
    if (type === "letter" || type === "postcard") initial.type = type;
    if (replied === "pending" || replied === "replied") initial.replied = replied;
    if (contactId) initial.contactId = contactId;
    if (year) initial.year = Number(year);
    if (search) initial.search = search;

    if (Object.keys(initial).length > 0) {
      setFilters(initial);
      searchParams.delete("direction");
      searchParams.delete("type");
      searchParams.delete("replied");
      searchParams.delete("contactId");
      searchParams.delete("year");
      searchParams.delete("search");
      setSearchParams(searchParams, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lettersList = useMemo(() => filteredLetters(), [filteredLetters, letters, filters, sortField, sortOrder]);
  const availableYears = useMemo(() => getAvailableYears(), [getAvailableYears, letters]);

  const sortOptions: { field: SortField; label: string }[] = [
    { field: "created_at", label: "创建时间" },
    { field: "sent_date", label: "寄出日期" },
    { field: "received_date", label: "收到日期" },
    { field: "contact_name", label: "联系人" },
  ];

  const activeFiltersCount = [
    filters.type !== "all",
    filters.direction !== "all",
    filters.contactId !== null,
    filters.year !== null,
    filters.search !== "",
    filters.replied !== "all",
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-parchment-300 border-t-ink-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="section-title">
            <Mail className="w-7 h-7 text-ink-700" />
            信件记录
          </h1>
          <p className="mt-2 text-ink-500 text-sm ml-4">
            共 {lettersList.length} 条记录 · {letters.length} 条总记录
          </p>
        </div>
        <Link to="/letters/new" className="btn-primary flex-shrink-0">
          <Plus className="w-4 h-4" />
          新增记录
        </Link>
      </div>

      <div className="card-parchment p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-ink-600 font-medium">
            <Filter className="w-4 h-4" />
            筛选条件
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] rounded-full bg-envelope-500 text-white font-bold">
                {activeFiltersCount}
              </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="btn-ghost text-xs py-1.5 px-3"
            >
              <X className="w-3.5 h-3.5" />
              清除筛选
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-ink-400">排序：</span>
            <div className="flex items-center gap-1 bg-parchment-100 rounded-xl p-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.field}
                  onClick={() => setSort(opt.field)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1",
                    sortField === opt.field
                      ? "bg-white text-ink-700 shadow-sm"
                      : "text-ink-400 hover:text-ink-600"
                  )}
                >
                  {opt.label}
                  {sortField === opt.field && (
                    sortOrder === "desc" ? (
                      <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUp className="w-3 h-3" />
                    )
                  )}
                </button>
              ))}
              <button
                onClick={() => setSort(sortField, sortOrder === "desc" ? "asc" : "desc")}
                className="px-2 py-1.5 rounded-lg text-ink-500 hover:bg-white/50 transition-all"
                title="切换升序/降序"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="divider-postmark" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div>
            <label className="text-xs font-medium text-ink-500 mb-1.5 block flex items-center gap-1">
              <Stamp className="w-3 h-3" />
              类型
            </label>
            <select
              value={filters.type || "all"}
              onChange={(e) =>
                setFilters({ type: e.target.value as LetterType | "all" })
              }
              className="input-field py-2.5 text-sm"
            >
              <option value="all">全部类型</option>
              <option value="letter">信件</option>
              <option value="postcard">明信片</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-500 mb-1.5 block flex items-center gap-1">
              <Mail className="w-3 h-3" />
              方向
            </label>
            <select
              value={filters.direction || "all"}
              onChange={(e) =>
                setFilters({ direction: e.target.value as Direction | "all" })
              }
              className="input-field py-2.5 text-sm"
            >
              <option value="all">全部方向</option>
              <option value="sent">寄出</option>
              <option value="received">收到</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-500 mb-1.5 block flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              回复状态
            </label>
            <select
              value={filters.replied || "all"}
              onChange={(e) =>
                setFilters({ replied: e.target.value as RepliedFilter })
              }
              className="input-field py-2.5 text-sm"
            >
              <option value="all">全部状态</option>
              <option value="pending">待回信</option>
              <option value="replied">已回复</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-500 mb-1.5 block flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              年份
            </label>
            <select
              value={filters.year || ""}
              onChange={(e) =>
                setFilters({
                  year: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="input-field py-2.5 text-sm"
            >
              <option value="">全部年份</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y} 年
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-ink-500 mb-1.5 block flex items-center gap-1">
              <Users className="w-3 h-3" />
              联系人
            </label>
            <select
              value={filters.contactId || ""}
              onChange={(e) =>
                setFilters({
                  contactId: e.target.value || null,
                })
              }
              className="input-field py-2.5 text-sm"
            >
              <option value="">全部联系人</option>
              {contacts.map((c: Contact) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-medium text-ink-500 mb-1.5 block flex items-center gap-1">
              <Search className="w-3 h-3" />
              搜索
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
              <input
                type="text"
                value={filters.search || ""}
                onChange={(e) => setFilters({ search: e.target.value })}
                placeholder="搜索姓名、地点、备注..."
                className="input-field py-2.5 pl-9 text-sm"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters({ search: "" })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-parchment-100 text-ink-300 hover:text-ink-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {lettersList.length === 0 ? (
        <div className="card-parchment p-16">
          <Empty />
          <div className="text-center mt-4">
            <p className="text-ink-500 mb-4">
              {activeFiltersCount > 0
                ? "没有符合筛选条件的记录"
                : "还没有任何信件记录"}
            </p>
            <div className="flex items-center justify-center gap-3">
              {activeFiltersCount > 0 && (
                <button onClick={resetFilters} className="btn-secondary">
                  清除筛选
                </button>
              )}
              <Link to="/letters/new" className="btn-primary">
                <Plus className="w-4 h-4" />
                添加第一条记录
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {lettersList.map((letter) => (
            <LetterCard
              key={letter.id}
              letter={letter}
              onDelete={removeLetter}
              onMarkReplied={markLetterReplied}
            />
          ))}
        </div>
      )}
    </div>
  );
}
