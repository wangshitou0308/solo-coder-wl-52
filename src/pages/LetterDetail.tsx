import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  MapPin,
  CalendarDays,
  Stamp,
  Send,
  ArrowDownLeft,
  FileText,
  Image,
  Globe,
  CheckCircle2,
  Clock,
  Reply,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Letter } from "@/types";
import { formatDate, formatMoney, daysSince } from "@/utils/format";
import { cn } from "@/lib/utils";

export default function LetterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const letters = useStore((s) => s.letters);
  const removeLetter = useStore((s) => s.removeLetter);
  const markLetterReplied = useStore((s) => s.markLetterReplied);
  const [letter, setLetter] = useState<Letter | null>(null);
  const [photoViewer, setPhotoViewer] = useState<string | null>(null);

  useEffect(() => {
    if (id && letters.length > 0) {
      const found = letters.find((l) => l.id === id);
      setLetter(found || null);
    }
  }, [id, letters]);

  const handleDelete = () => {
    if (!letter) return;
    if (confirm("确认删除这条信件记录吗？此操作无法撤销。")) {
      removeLetter(letter.id);
      navigate("/letters");
    }
  };

  const handleMarkReplied = () => {
    if (!letter) return;
    markLetterReplied(letter.id);
  };

  if (!letter) {
    return (
      <div className="card-parchment p-16 text-center">
        <FileText className="w-16 h-16 text-ink-200 mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-ink-600 mb-2">
          记录不存在
        </h2>
        <p className="text-ink-400 mb-6">这条信件记录可能已被删除</p>
        <Link to="/letters" className="btn-primary inline-flex">
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </Link>
      </div>
    );
  }

  const isReceived = letter.direction === "received";
  const isPostcard = letter.type === "postcard";
  const directionBg = isReceived
    ? "from-ink-500 via-ink-600 to-ink-700"
    : "from-stamp-400 via-stamp-500 to-stamp-600";
  const directionLabel = isReceived ? "收到" : "寄出";
  const DirectionIcon = isReceived ? ArrowDownLeft : Send;
  const waitingDays = isReceived && !letter.is_replied ? daysSince(letter.received_date) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost self-start -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>
        <div className="flex items-center gap-2 sm:ml-auto">
          <Link
            to={`/letters/${letter.id}/edit`}
            className="btn-secondary"
          >
            <Pencil className="w-4 h-4" />
            编辑
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 className="w-4 h-4" />
            删除
          </button>
        </div>
      </div>

      <div className="card-parchment relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-parchment-200/50 via-parchment-100/30 to-transparent" />
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-stamp-100/30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-envelope-100/30 blur-3xl" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-shrink-0 flex lg:flex-col gap-6 lg:gap-4 items-start">
              <div
                className={cn(
                  "w-32 h-40 sm:w-36 sm:h-44 rounded-2xl bg-gradient-to-br",
                  directionBg,
                  "text-white shadow-xl relative flex-shrink-0"
                )}
                style={{
                  clipPath:
                    "polygon(6% 0, 94% 0, 100% 6%, 100% 94%, 94% 100%, 6% 100%, 0 94%, 0 6%)",
                }}
              >
                <div className="absolute inset-2 border-2 border-white/20 rounded-xl" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <DirectionIcon className="w-10 h-10 mb-2 opacity-90" strokeWidth={2} />
                  <div className="text-sm font-bold tracking-wide opacity-90">
                    {directionLabel}
                  </div>
                  <div className="mt-1 text-[10px] opacity-70">
                    {isPostcard ? "明信片" : "信件"}
                  </div>
                  <div className="mt-3 px-3 py-1 rounded-full bg-white/15 text-[10px] font-medium backdrop-blur-sm">
                    {formatDate(letter.sent_date || letter.received_date, "yyyy.MM.dd")}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/10" />
                <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white/15" />
              </div>

              <div className="lg:hidden flex-1 space-y-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-800 flex items-center gap-3 flex-wrap">
                  {letter.contact_name}
                  {isReceived && !letter.is_replied && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-envelope-500 text-white shadow-sm animate-pulse">
                      <Clock className="w-3 h-3" />
                      待回信 · {waitingDays} 天
                    </span>
                  )}
                  {isReceived && letter.is_replied && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-ink-50 text-ink-500 border border-ink-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-stamp-500" />
                      已回信
                    </span>
                  )}
                </h1>
                <p className="text-ink-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {letter.contact_city || "—"}
                  {letter.contact_country && ` · ${letter.contact_country}`}
                </p>
              </div>

              <div className="hidden lg:flex flex-col gap-3 w-36">
                {isReceived && !letter.is_replied && (
                  <button
                    onClick={handleMarkReplied}
                    className="w-full py-2.5 rounded-xl bg-stamp-500 text-white text-sm font-medium hover:bg-stamp-600 transition-colors shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Reply className="w-4 h-4" />
                    标记已回信
                  </button>
                )}
                <Link
                  to={`/letters/${letter.id}/edit`}
                  className="w-full py-2.5 rounded-xl bg-ink-700 text-white text-sm font-medium hover:bg-ink-800 transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <Pencil className="w-4 h-4" />
                  编辑记录
                </Link>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="hidden lg:block space-y-2 mb-6">
                <h1 className="font-display text-3xl font-bold text-ink-800 flex items-center gap-3 flex-wrap">
                  {letter.contact_name}
                  {isReceived && !letter.is_replied && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-envelope-500 text-white shadow-sm animate-pulse">
                      <Clock className="w-3 h-3" />
                      待回信 · {waitingDays} 天
                    </span>
                  )}
                  {isReceived && letter.is_replied && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-ink-50 text-ink-500 border border-ink-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-stamp-500" />
                      已回信
                    </span>
                  )}
                </h1>
                <p className="text-ink-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {letter.contact_city || "—"}
                  {letter.contact_country && ` · ${letter.contact_country}`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-parchment-50/50 border border-parchment-200/50">
                  <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {isReceived ? "收到日期" : "寄出日期"}
                  </div>
                  <div className="font-display text-lg font-bold text-ink-700">
                    {formatDate(isReceived ? letter.received_date : letter.sent_date)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-parchment-50/50 border border-parchment-200/50">
                  <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
                    <Send className="w-3.5 h-3.5" />
                    {isReceived ? "寄出日期" : "收到日期"}
                  </div>
                  <div className="font-display text-lg font-bold text-ink-700">
                    {formatDate(isReceived ? letter.sent_date : letter.received_date)}
                  </div>
                </div>

                {letter.postmark_date && (
                  <div className="p-4 rounded-xl bg-parchment-50/50 border border-parchment-200/50">
                    <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
                      <Stamp className="w-3.5 h-3.5" />
                      邮戳日期
                    </div>
                    <div className="font-display text-lg font-bold text-ink-700">
                      {formatDate(letter.postmark_date)}
                    </div>
                  </div>
                )}

                {letter.postmark_location && (
                  <div className="p-4 rounded-xl bg-parchment-50/50 border border-parchment-200/50">
                    <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      邮戳地点
                    </div>
                    <div className="font-display text-lg font-bold text-ink-700">
                      {letter.postmark_location}
                    </div>
                  </div>
                )}

                {letter.stamp_value !== null && letter.direction === "sent" && (
                  <div className="p-4 rounded-xl bg-stamp-50/50 border border-stamp-200/50">
                    <div className="flex items-center gap-2 text-xs text-stamp-600 mb-1.5">
                      <Stamp className="w-3.5 h-3.5" />
                      邮资金额
                    </div>
                    <div className="font-display text-xl font-bold text-stamp-700">
                      {formatMoney(letter.stamp_value)}
                    </div>
                  </div>
                )}

                {letter.stamp_description && (
                  <div className="p-4 rounded-xl bg-parchment-50/50 border border-parchment-200/50 sm:col-span-2">
                    <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
                      <Stamp className="w-3.5 h-3.5" />
                      邮票描述
                    </div>
                    <div className="font-medium text-ink-700">
                      {letter.stamp_description}
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm font-medium text-ink-600 mb-3 pb-2 border-b border-parchment-200">
                  <User className="w-4 h-4" />
                  联系人信息
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {letter.contact_address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-ink-300 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-ink-400 text-xs">详细地址</div>
                        <div className="text-ink-700">{letter.contact_address}</div>
                      </div>
                    </div>
                  )}
                  {letter.contact_country && (
                    <div className="flex items-start gap-2">
                      <Globe className="w-4 h-4 text-ink-300 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-ink-400 text-xs">国家/地区</div>
                        <div className="text-ink-700">{letter.contact_country}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {letter.notes && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-sm font-medium text-ink-600 mb-3 pb-2 border-b border-parchment-200">
                    <FileText className="w-4 h-4" />
                    备注与内容
                  </div>
                  <div className="p-5 rounded-xl bg-white/60 border border-parchment-200/70 text-ink-700 leading-relaxed whitespace-pre-wrap font-display">
                    {letter.notes}
                  </div>
                </div>
              )}

              {letter.photos && letter.photos.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-ink-600 mb-3 pb-2 border-b border-parchment-200">
                    <Image className="w-4 h-4" />
                    照片画廊
                    <span className="text-ink-400 font-normal">
                      ({letter.photos.length} 张)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {letter.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setPhotoViewer(photo)}
                        className="aspect-square rounded-xl overflow-hidden border-2 border-parchment-200 hover:border-ink-400 transition-all group relative"
                      >
                        <img
                          src={photo}
                          alt={`照片 ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/20 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full bg-white/90 text-ink-700 text-xs font-medium shadow-lg">
                            点击查看大图
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {photoViewer && (
        <div
          className="fixed inset-0 z-50 bg-ink-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPhotoViewer(null)}
        >
          <button
            onClick={() => setPhotoViewer(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <img
            src={photoViewer}
            alt="查看大图"
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
