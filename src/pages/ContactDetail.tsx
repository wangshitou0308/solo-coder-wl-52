import { useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  MapPin,
  CalendarDays,
  Send,
  ArrowDownLeft,
  Stamp,
  FileText,
  Globe,
  Mail,
  Clock,
  BarChart3,
  Hash,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format";
import { Letter } from "@/types";

export default function ContactDetail() {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const contacts = useStore((s) => s.contacts);
  const letters = useStore((s) => s.letters);
  const getLettersForContact = useStore((s) => s.getLettersForContact);
  const getContactStats = useStore((s) => s.getContactStats);

  const contact = useMemo(
    () => contacts.find((c) => c.id === contactId),
    [contacts, contactId]
  );

  const contactLetters = useMemo(
    () => (contactId ? getLettersForContact(contactId) : []),
    [getLettersForContact, contactId, letters]
  );

  const stats = useMemo(
    () => (contactId ? getContactStats(contactId) : null),
    [getContactStats, contactId, letters]
  );


  if (!contact) {
    return (
      <div className="card-parchment p-16 text-center">
        <User className="w-16 h-16 text-ink-200 mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-ink-600 mb-2">
          联系人不存在
        </h2>
        <p className="text-ink-400 mb-6">该联系人可能已被删除</p>
        <Link to="/contacts" className="btn-primary inline-flex">
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link to="/contacts" className="btn-ghost self-start -ml-2">
          <ArrowLeft className="w-4 h-4" />
          返回联系人列表
        </Link>
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
                  "w-32 h-32 sm:w-36 sm:h-36 rounded-3xl flex items-center justify-center flex-shrink-0",
                  "bg-gradient-to-br from-ink-500 via-ink-600 to-ink-800 text-white shadow-2xl",
                  "ring-8 ring-ink-200/40"
                )}
              >
                <span className="font-display font-bold text-5xl sm:text-6xl">
                  {contact.name.charAt(0)}
                </span>
              </div>

              <div className="lg:hidden flex-1 space-y-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-800">
                  {contact.name}
                </h1>
                <p className="text-ink-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {contact.city || "未设置城市"}
                  {contact.country && ` · ${contact.country}`}
                </p>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="hidden lg:block space-y-2 mb-8">
                <h1 className="font-display text-4xl font-bold text-ink-800">
                  {contact.name}
                </h1>
                <p className="text-ink-500 flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5" />
                  {contact.city || "未设置城市"}
                  {contact.country && ` · ${contact.country}`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {contact.address && (
                  <div className="p-4 rounded-xl bg-parchment-50/50 border border-parchment-200/50">
                    <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      详细地址
                    </div>
                    <div className="font-display text-base font-medium text-ink-700">
                      {contact.address}
                    </div>
                  </div>
                )}

                {contact.country && (
                  <div className="p-4 rounded-xl bg-parchment-50/50 border border-parchment-200/50">
                    <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      国家/地区
                    </div>
                    <div className="font-display text-base font-medium text-ink-700">
                      {contact.country}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-parchment-50/50 border border-parchment-200/50">
                  <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    添加时间
                  </div>
                  <div className="font-display text-base font-medium text-ink-700">
                    {formatDate(contact.created_at)}
                  </div>
                </div>

                {stats && stats.unrepliedCount > 0 && (
                  <div className="p-4 rounded-xl bg-envelope-50/50 border border-envelope-200/50">
                    <div className="flex items-center gap-2 text-xs text-envelope-500 mb-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      待回信提醒
                    </div>
                    <div className="font-display text-base font-bold text-envelope-600">
                      {stats.unrepliedCount} 封来信等待回复
                    </div>
                  </div>
                )}
              </div>

              {contact.notes && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-ink-600 mb-3 pb-2 border-b border-parchment-200">
                    <FileText className="w-4 h-4" />
                    备注信息
                  </div>
                  <div className="p-5 rounded-xl bg-white/60 border border-parchment-200/70 text-ink-700 leading-relaxed whitespace-pre-wrap font-display">
                    {contact.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {stats && (
        <section className="space-y-5">
          <h2 className="section-title">
            <BarChart3 className="w-6 h-6 text-ink-700" />
            往来统计
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            <div className="card-parchment p-5 lg:p-6 relative overflow-hidden">
              <div
                className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.07] bg-gradient-to-br blur-2xl pointer-events-none"
                style={{ background: "#2C3E50" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-ink-600 bg-ink-50">
                    往来总数
                  </span>
                </div>
                <div className="font-display text-3xl lg:text-4xl font-bold text-ink-800 mb-2 tabular-nums tracking-tight">
                  {stats.totalCount}
                </div>
                <div className="flex items-center gap-3 text-xs text-ink-500">
                  <span className="flex items-center gap-1">
                    <Send className="w-3 h-3 text-stamp-600" />
                    寄 {stats.sentCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowDownLeft className="w-3 h-3 text-ink-600" />
                    收 {stats.receivedCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="card-parchment p-5 lg:p-6 relative overflow-hidden">
              <div
                className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.07] bg-gradient-to-br blur-2xl pointer-events-none"
                style={{ background: "#D4A017" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-stamp-700 bg-stamp-50">
                    平均间隔
                  </span>
                </div>
                <div className="font-display text-3xl lg:text-4xl font-bold text-stamp-700 mb-2 tabular-nums tracking-tight">
                  {stats.avgIntervalDays || 0}
                  <span className="text-lg font-normal ml-1">天</span>
                </div>
                <div className="text-xs text-stamp-600/70">
                  {stats.avgIntervalDays > 0
                    ? "每两次通信之间的平均天数"
                    : "继续保持书信往来吧"}
                </div>
              </div>
            </div>

            <div className="card-parchment p-5 lg:p-6 relative overflow-hidden">
              <div
                className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.07] bg-gradient-to-br blur-2xl pointer-events-none"
                style={{ background: "#C0392B" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-envelope-600 bg-envelope-50">
                    第一封信
                  </span>
                </div>
                <div className="font-display text-xl lg:text-2xl font-bold text-envelope-600 mb-2 tabular-nums tracking-tight">
                  {formatDate(stats.firstLetterDate, "yyyy.MM.dd")}
                </div>
                <div className="text-xs text-envelope-500/70 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  你们的故事从这里开始
                </div>
              </div>
            </div>

            <div className="card-parchment p-5 lg:p-6 relative overflow-hidden">
              <div
                className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.07] bg-gradient-to-br blur-2xl pointer-events-none"
                style={{ background: "#A6874E" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-parchment-700 bg-parchment-100">
                    最后一封信
                  </span>
                </div>
                <div className="font-display text-xl lg:text-2xl font-bold text-parchment-700 mb-2 tabular-nums tracking-tight">
                  {formatDate(stats.lastLetterDate, "yyyy.MM.dd")}
                </div>
                <div className="text-xs text-parchment-600/70 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  最近一次的联系
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-5">
        <h2 className="section-title">
          <Mail className="w-6 h-6 text-ink-700" />
          通信时间线
          <span className="ml-2 text-base font-normal text-ink-400">
            ({contactLetters.length} 条记录)
          </span>
        </h2>

        {contactLetters.length === 0 ? (
          <div className="card-parchment p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-parchment-100 flex items-center justify-center">
              <Stamp className="w-10 h-10 text-ink-300" />
            </div>
            <h3 className="font-display text-xl font-bold text-ink-700 mb-2">
              暂无通信记录
            </h3>
            <p className="text-ink-500 mb-6">
              记录你与 {contact.name} 的第一封往来信件吧
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-stamp-300/50 via-parchment-300/60 to-envelope-300/50" />

            <div className="space-y-8">
              {contactLetters.map((letter: Letter, index: number) => {
                const isReceived = letter.direction === "received";
                const isLeft = index % 2 === 0;
                const dateStr = letter.received_date || letter.sent_date || letter.created_at;

                return (
                  <div
                    key={letter.id}
                    className={cn(
                      "relative flex items-stretch gap-4 lg:gap-6",
                      isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                    )}
                  >
                    <div
                      className={cn(
                        "hidden lg:block flex-1",
                        !isLeft && "text-right"
                      )}
                    />

                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={cn(
                          "timeline-dot",
                          isReceived
                            ? "bg-gradient-to-br from-ink-100 to-ink-200"
                            : "bg-gradient-to-br from-stamp-100 to-stamp-200"
                        )}
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center",
                            isReceived
                              ? "bg-gradient-to-br from-ink-500 to-ink-700"
                              : "bg-gradient-to-br from-stamp-400 to-stamp-600"
                          )}
                        >
                          {isReceived ? (
                            <ArrowDownLeft className="w-3 h-3 text-white" />
                          ) : (
                            <Send className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "flex-1 min-w-0",
                        isLeft ? "lg:pr-4" : "lg:pl-4"
                      )}
                    >
                      <div
                        onClick={() => navigate(`/letters/${letter.id}`)}
                        className={cn(
                          "card-parchment p-5 cursor-pointer hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group relative",
                          isReceived
                            ? "border-l-4 border-l-ink-400"
                            : "border-l-4 border-l-stamp-400"
                        )}
                      >
                        <div className="absolute top-3 right-3 opacity-80">
                          <div
                            className={cn(
                              "w-14 h-10 rounded-sm flex items-center justify-center",
                              "bg-gradient-to-br border-2",
                              isReceived
                                ? "from-ink-50 to-ink-100 border-ink-300/50"
                                : "from-stamp-50 to-stamp-100 border-stamp-300/50"
                            )}
                            style={{
                              clipPath:
                                "polygon(0 0, 100% 0, 100% 100%, 8% 100%, 8% 92%, 0 92%, 0 84%, 8% 84%, 8% 76%, 0 76%, 0 68%, 8% 68%, 8% 60%, 0 60%, 0 52%, 8% 52%, 8% 44%, 0 44%, 0 36%, 8% 36%, 8% 28%, 0 28%, 0 20%, 8% 20%, 8% 12%, 0 12%, 0 4%, 8% 4%, 8% 0)",
                            }}
                          >
                            <Stamp
                              className={cn(
                                "w-5 h-5",
                                isReceived ? "text-ink-400" : "text-stamp-500"
                              )}
                            />
                          </div>
                        </div>

                        <div className="pr-16">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                                isReceived
                                  ? "bg-ink-50 text-ink-700 border border-ink-200/50"
                                  : "bg-stamp-50 text-stamp-700 border border-stamp-200/50"
                              )}
                            >
                              {isReceived ? (
                                <ArrowDownLeft className="w-3 h-3" />
                              ) : (
                                <Send className="w-3 h-3" />
                              )}
                              {isReceived ? "收到" : "寄出"}
                            </span>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                                letter.type === "postcard"
                                  ? "bg-parchment-100 text-parchment-700 border border-parchment-200/50"
                                  : "bg-parchment-50 text-ink-600 border border-parchment-200/50"
                              )}
                            >
                              {letter.type === "postcard" ? "明信片" : "信件"}
                            </span>
                            {isReceived && !letter.is_replied && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-envelope-500 text-white shadow-sm animate-pulse">
                                <Clock className="w-3 h-3" />
                                待回信
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-ink-500 mb-3">
                            <CalendarDays className="w-4 h-4" />
                            <span className="font-medium">
                              {formatDate(dateStr)}
                            </span>
                            {letter.postmark_location && (
                              <>
                                <span className="text-parchment-400">·</span>
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{letter.postmark_location}</span>
                              </>
                            )}
                          </div>

                          {letter.notes ? (
                            <p className="text-ink-700 text-sm leading-relaxed line-clamp-2 font-display">
                              {letter.notes}
                            </p>
                          ) : (
                            <p className="text-ink-400 text-sm italic">
                              （暂无备注内容）
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
