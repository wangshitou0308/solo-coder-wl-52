import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  MapPin,
  Send,
  ArrowDownLeft,
  Clock,
  CalendarDays,
  X,
  UserPlus,
  Save,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format";
import { ContactStatistics } from "@/types";

export default function Contacts() {
  const navigate = useNavigate();
  const loading = useStore((s) => s.loading);
  const contacts = useStore((s) => s.contacts);
  const letters = useStore((s) => s.letters);
  const getAllContactStats = useStore((s) => s.getAllContactStats);
  const createContact = useStore((s) => s.createContact);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formCountry, setFormCountry] = useState("");
  const [formLat, setFormLat] = useState<string>("");
  const [formLng, setFormLng] = useState<string>("");

  const allContactStats = useMemo(() => getAllContactStats(), [getAllContactStats, letters, contacts]);

  const contactsWithStats = useMemo(() => {
    const statsMap = new Map<string, ContactStatistics>();
    allContactStats.forEach((s) => statsMap.set(s.contactId, s));

    return contacts.map((c) => ({
      contact: c,
      stats: statsMap.get(c.id) || null,
    }));
  }, [contacts, allContactStats]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contactsWithStats;
    const q = searchQuery.toLowerCase().trim();
    return contactsWithStats.filter(
      ({ contact }) =>
        contact.name.toLowerCase().includes(q) ||
        contact.city.toLowerCase().includes(q) ||
        contact.country.toLowerCase().includes(q) ||
        contact.address.toLowerCase().includes(q)
    );
  }, [contactsWithStats, searchQuery]);

  const resetForm = () => {
    setFormName("");
    setFormAddress("");
    setFormCity("");
    setFormCountry("");
    setFormLat("");
    setFormLng("");
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setSubmitting(true);
    try {
      const c = await createContact({
        name: formName.trim(),
        address: formAddress.trim(),
        city: formCity.trim(),
        country: formCountry.trim(),
      });
      closeModal();
      navigate(`/contacts/${c.id}`);
    } finally {
      setSubmitting(false);
    }
  };

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
            <Users className="w-7 h-7 text-ink-700" />
            联系人列表
          </h1>
          <p className="mt-2 text-ink-500 text-sm ml-4">
            共 {contacts.length} 位联系人 · {allContactStats.length} 位有往来记录
          </p>
        </div>
        <button onClick={openModal} className="btn-primary flex-shrink-0">
          <Plus className="w-4 h-4" />
          新增联系人
        </button>
      </div>

      <div className="card-parchment p-5">
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索联系人姓名、城市..."
            className="input-field pl-12 pr-10 py-3"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-parchment-100 text-ink-300 hover:text-ink-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="card-parchment p-16">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-parchment-100 flex items-center justify-center">
              <UserPlus className="w-10 h-10 text-ink-300" />
            </div>
            <h3 className="font-display text-xl font-bold text-ink-700 mb-2">
              {searchQuery ? "没有匹配的联系人" : "还没有联系人"}
            </h3>
            <p className="text-ink-500 mb-6">
              {searchQuery
                ? "试试换个搜索关键词，或者"
                : "添加第一位联系人，开始记录你们的书信往来"}
            </p>
            <div className="flex items-center justify-center gap-3">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="btn-secondary"
                >
                  清除搜索
                </button>
              )}
              <button onClick={openModal} className="btn-primary">
                <Plus className="w-4 h-4" />
                添加联系人
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredContacts.map(({ contact, stats }) => (
            <div
              key={contact.id}
              onClick={() => navigate(`/contacts/${contact.id}`)}
              className={cn(
                "card-parchment p-5 lg:p-6 cursor-pointer",
                "hover:-translate-y-1 hover:shadow-letter-hover transition-all duration-300",
                "relative overflow-hidden group"
              )}
            >
              <div
                className="absolute -right-12 -top-12 w-36 h-36 rounded-full opacity-[0.06] blur-2xl pointer-events-none bg-gradient-to-br from-ink-500 to-envelope-500"
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                        "bg-gradient-to-br from-ink-500 to-ink-700 text-white shadow-md ring-4 ring-ink-200/40"
                      )}
                    >
                      <span className="font-display font-bold text-xl">
                        {contact.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-lg text-ink-800 truncate flex items-center gap-2">
                        {contact.name}
                        {stats && stats.unrepliedCount > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-envelope-500 text-white text-[11px] font-bold shadow-sm animate-pulse">
                            {stats.unrepliedCount}
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-ink-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {contact.city || "未设置城市"}
                        {contact.country && ` · ${contact.country}`}
                      </p>
                    </div>
                  </div>
                </div>

                {stats ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 rounded-xl bg-parchment-50/70 border border-parchment-200/50 text-center">
                        <div className="font-display text-2xl font-bold text-ink-800 tabular-nums">
                          {stats.totalCount}
                        </div>
                        <div className="text-[11px] text-ink-400 mt-0.5">往来总数</div>
                      </div>
                      <div className="p-3 rounded-xl bg-stamp-50/70 border border-stamp-200/50 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Send className="w-3.5 h-3.5 text-stamp-600" />
                          <span className="font-display text-2xl font-bold text-stamp-700 tabular-nums">
                            {stats.sentCount}
                          </span>
                        </div>
                        <div className="text-[11px] text-stamp-500 mt-0.5">寄出去</div>
                      </div>
                      <div className="p-3 rounded-xl bg-ink-50/70 border border-ink-200/50 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <ArrowDownLeft className="w-3.5 h-3.5 text-ink-600" />
                          <span className="font-display text-2xl font-bold text-ink-700 tabular-nums">
                            {stats.receivedCount}
                          </span>
                        </div>
                        <div className="text-[11px] text-ink-500 mt-0.5">收到</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-parchment-200/60">
                      <div className="flex items-center gap-1.5 text-xs text-ink-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          平均间隔{" "}
                          <span className="font-semibold text-ink-700">
                            {stats.avgIntervalDays || 0}
                          </span>{" "}
                          天
                        </span>
                      </div>
                      {stats.unrepliedCount > 0 && (
                        <div className="flex items-center gap-1 text-xs text-envelope-600 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{stats.unrepliedCount} 封待回信</span>
                        </div>
                      )}
                    </div>

                    {stats.lastLetterDate && (
                      <div className="flex items-center gap-1.5 text-xs text-ink-400">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>最后往来：{formatDate(stats.lastLetterDate, "yyyy.MM.dd")}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-parchment-100 text-ink-400 text-xs">
                      暂无往来记录
                    </div>
                    <p className="text-xs text-ink-400 mt-3">
                      记录与 {contact.name} 的第一封信吧
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm animate-fade-in">
          <div
            className="card-parchment w-full max-w-lg animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-parchment-200/60">
              <h2 className="font-display font-bold text-xl text-ink-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-ink-600" />
                新增联系人
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-parchment-100 text-ink-400 hover:text-ink-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-ink-500 mb-1.5 block">
                  姓名 *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="请输入联系人姓名"
                  required
                  className="input-field py-2.5"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-500 mb-1.5 block">
                  城市
                </label>
                <input
                  type="text"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  placeholder="例如：上海"
                  className="input-field py-2.5"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-500 mb-1.5 block">
                  国家
                </label>
                <input
                  type="text"
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value)}
                  placeholder="例如：中国"
                  className="input-field py-2.5"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-500 mb-1.5 block">
                  详细地址
                </label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="街道、门牌号等"
                  className="input-field py-2.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-ink-500 mb-1.5 block">
                    纬度
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formLat}
                    onChange={(e) => setFormLat(e.target.value)}
                    placeholder="例如：31.2304"
                    className="input-field py-2.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-500 mb-1.5 block">
                    经度
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formLng}
                    onChange={(e) => setFormLng(e.target.value)}
                    placeholder="例如：121.4737"
                    className="input-field py-2.5"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-ghost"
                  disabled={submitting}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting || !formName.trim()}
                >
                  <Save className="w-4 h-4" />
                  {submitting ? "保存中..." : "保存"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
