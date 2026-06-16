import { Link } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Stamp,
  MapPin,
  CalendarDays,
  Image,
  MoreHorizontal,
  Pencil,
  Trash2,
  Reply,
  CheckCircle2,
} from "lucide-react";
import { Letter } from "@/types";
import { formatDate, formatMoney, formatDateShort } from "@/utils/format";
import { useState } from "react";

interface Props {
  letter: Letter;
  compact?: boolean;
  onDelete?: (id: string) => void;
  onMarkReplied?: (id: string) => void;
}

export default function LetterCard({
  letter,
  compact = false,
  onDelete,
  onMarkReplied,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isReceived = letter.direction === "received";
  const isPostcard = letter.type === "postcard";

  const directionBg = isReceived
    ? "from-ink-500 to-ink-600"
    : "from-stamp-400 to-stamp-500";
  const directionLabel = isReceived ? "收到" : "寄出";
  const DirectionIcon = isReceived ? ArrowDownLeft : ArrowUpRight;

  const typeBadge = isPostcard ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-parchment-200 to-parchment-300/70 text-parchment-800 text-xs font-medium border border-parchment-300/80">
      <MapPin className="w-3 h-3" />
      明信片
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-ink-50 text-ink-600 text-xs font-medium border border-ink-100">
      <Stamp className="w-3 h-3" />
      信件
    </span>
  );

  return (
    <div
      className="card-parchment group relative overflow-hidden animate-stamp-in"
      style={{
        animationDuration: "400ms",
        animationDelay: compact ? "0ms" : undefined,
      }}
    >
      {/* 邮票齿孔装饰 */}
      <div className="absolute top-3 right-3 pointer-events-none select-none z-10">
        <div
          className={`w-16 h-20 rounded-md bg-gradient-to-br ${directionBg} text-white/90 flex flex-col items-center justify-center shadow-md relative`}
          style={{
            clipPath:
              "polygon(8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%, 0 8%)",
          }}
        >
          <DirectionIcon className="w-5 h-5 mb-0.5 opacity-90" />
          <div className="text-[10px] font-bold opacity-90">
            {directionLabel}
          </div>
          <div className="text-[9px] opacity-70 mt-0.5">
            {formatDateShort(letter.sent_date || letter.received_date)}
          </div>
        </div>
      </div>

      <Link
        to={`/letters/${letter.id}`}
        className="block p-5 pr-24 hover:opacity-95 transition-opacity"
      >
        <div className="flex items-start justify-between mb-3 gap-3">
          <div>
            <h3 className="font-display text-lg font-bold text-ink-800 mb-1 flex items-center gap-2">
              {letter.contact_name}
              {isReceived && !letter.is_replied && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-envelope-500 text-white shadow-sm animate-pulse">
                  待回信
                </span>
              )}
              {isReceived && letter.is_replied && (
                <CheckCircle2 className="w-4 h-4 text-ink-400" />
              )}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {typeBadge}
              <span className="text-xs text-ink-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {letter.contact_city || "—"}
                {letter.contact_country && ` · ${letter.contact_country}`}
              </span>
            </div>
          </div>
        </div>

        {!compact && letter.notes && (
          <p className="text-sm text-ink-600 leading-relaxed line-clamp-2 mb-4 pr-2">
            {letter.notes}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 border-t border-parchment-200/70">
          <div className="flex items-center gap-1.5 text-xs text-ink-500">
            <CalendarDays className="w-3.5 h-3.5 text-stamp-500" />
            {isReceived ? (
              <span>
                收到：<b className="text-ink-700">{formatDate(letter.received_date)}</b>
              </span>
            ) : (
              <span>
                寄出：<b className="text-ink-700">{formatDate(letter.sent_date)}</b>
              </span>
            )}
          </div>

          {letter.stamp_value !== null && letter.direction === "sent" && (
            <div className="flex items-center gap-1.5 text-xs text-ink-500">
              <Stamp className="w-3.5 h-3.5 text-envelope-500" />
              <span>
                邮资：<b className="text-stamp-600 font-semibold">{formatMoney(letter.stamp_value)}</b>
              </span>
            </div>
          )}

          {letter.postmark_location && (
            <div className="flex items-center gap-1.5 text-xs text-ink-500">
              <MapPin className="w-3.5 h-3.5 text-ink-400" />
              <span>邮戳：{letter.postmark_location}</span>
            </div>
          )}

          {letter.photos && letter.photos.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-ink-500 ml-auto">
              <Image className="w-3.5 h-3.5" />
              {letter.photos.length} 张照片
            </div>
          )}
        </div>
      </Link>

      {/* 操作菜单 */}
      <div className="absolute bottom-3 right-3 z-20">
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen((v) => !v);
            }}
            className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-parchment-200/50 opacity-0 group-hover:opacity-100 transition-all"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 bottom-full mb-2 z-20 w-40 py-1.5 rounded-xl bg-white shadow-xl border border-parchment-200 animate-fade-in">
                <Link
                  to={`/letters/${letter.id}/edit`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-ink-700 hover:bg-parchment-100"
                >
                  <Pencil className="w-4 h-4" />
                  编辑记录
                </Link>
                {isReceived && !letter.is_replied && onMarkReplied && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onMarkReplied(letter.id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-stamp-700 hover:bg-stamp-50"
                  >
                    <Reply className="w-4 h-4" />
                    标记已回信
                  </button>
                )}
                <div className="divider-postmark my-1" />
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm("确认删除这条记录吗？")) {
                        onDelete(letter.id);
                      }
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-envelope-600 hover:bg-envelope-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    删除记录
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
