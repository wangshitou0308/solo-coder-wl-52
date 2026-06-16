import { create } from "zustand";
import {
  Contact,
  Letter,
  LetterFilters,
  ContactStatistics,
  DashboardStats,
  MonthlyData,
  ContactRank,
  HeatmapData,
  PostageTrend,
  LocationGroup,
  PendingReply,
  SortField,
  SortOrder,
} from "@/types";
import {
  getAllContacts,
  getAllLetters,
  createContact as dbCreateContact,
  updateContact as dbUpdateContact,
  deleteContact as dbDeleteContact,
  createLetter as dbCreateLetter,
  updateLetter as dbUpdateLetter,
  deleteLetter as dbDeleteLetter,
  markReplied as dbMarkReplied,
  findOrCreateContact,
  initMockData,
  getLettersByContact,
} from "@/db/indexedDB";
import {
  daysSince,
  getYearMonth,
  getMonth,
  getYear,
  daysBetween,
  parseISO,
} from "@/utils/format";

interface AppState {
  contacts: Contact[];
  letters: Letter[];
  loading: boolean;
  initialized: boolean;
  filters: LetterFilters;
  sortField: SortField;
  sortOrder: SortOrder;

  init: () => Promise<void>;
  loadData: () => Promise<void>;
  setFilters: (f: Partial<LetterFilters>) => void;
  resetFilters: () => void;
  setSort: (field: SortField, order?: SortOrder) => void;

  createContact: (data: Omit<Contact, "id" | "created_at">) => Promise<Contact>;
  updateContact: (id: string, data: Partial<Contact>) => Promise<void>;
  removeContact: (id: string) => Promise<void>;

  createLetter: (
    data: Omit<Letter, "id" | "created_at" | "updated_at">
  ) => Promise<Letter>;
  updateLetter: (id: string, data: Partial<Letter>) => Promise<void>;
  removeLetter: (id: string) => Promise<void>;
  markLetterReplied: (
    letterId: string,
    replyId?: string | null
  ) => Promise<void>;

  filteredLetters: () => Letter[];
  getContactStats: (contactId: string) => ContactStatistics | null;
  getAllContactStats: () => ContactStatistics[];
  getDashboardStats: () => DashboardStats;
  getPendingReplies: () => PendingReply[];
  getMonthlyData: (year?: number) => MonthlyData[];
  getContactRanks: (limit?: number) => ContactRank[];
  getHeatmapData: () => HeatmapData[];
  getPostageTrend: () => PostageTrend[];
  getPostcardLocations: () => LocationGroup[];
  getLettersForContact: (contactId: string) => Letter[];
  getAvailableYears: () => number[];
}

function computeAvgInterval(dates: string[]): number {
  if (dates.length < 2) return 0;
  const sorted = [...dates].sort();
  let total = 0;
  let count = 0;
  for (let i = 1; i < sorted.length; i++) {
    const diff = daysBetween(sorted[i - 1], sorted[i]);
    if (diff !== null) {
      total += diff;
      count++;
    }
  }
  return count > 0 ? Math.round(total / count) : 0;
}

export const useStore = create<AppState>((set, get) => ({
  contacts: [],
  letters: [],
  loading: false,
  initialized: false,
  filters: {
    type: "all",
    direction: "all",
    contactId: null,
    search: "",
    year: null,
  },
  sortField: "created_at",
  sortOrder: "desc",

  init: async () => {
    if (get().initialized) return;
    set({ loading: true });
    try {
      await initMockData();
      await get().loadData();
      set({ initialized: true });
    } finally {
      set({ loading: false });
    }
  },

  loadData: async () => {
    const [contacts, letters] = await Promise.all([
      getAllContacts(),
      getAllLetters(),
    ]);
    set({ contacts, letters });
  },

  setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
  resetFilters: () =>
    set({
      filters: {
        type: "all",
        direction: "all",
        contactId: null,
        search: "",
        year: null,
      },
    }),

  setSort: (field, order) => {
    const current = get();
    const nextOrder: SortOrder =
      order ?? (current.sortField === field && current.sortOrder === "desc"
        ? "asc"
        : "desc");
    set({ sortField: field, sortOrder: nextOrder });
  },

  createContact: async (data) => {
    const c = await dbCreateContact(data);
    await get().loadData();
    return c;
  },

  updateContact: async (id, data) => {
    await dbUpdateContact(id, data);
    await get().loadData();
  },

  removeContact: async (id) => {
    await dbDeleteContact(id);
    await get().loadData();
  },

  createLetter: async (data) => {
    if (data.contact_name && !data.contact_id) {
      const contact = await findOrCreateContact(data.contact_name, {
        address: data.contact_address,
        city: data.contact_city,
        country: data.contact_country,
      });
      data = { ...data, contact_id: contact.id };
    }
    const l = await dbCreateLetter(data);
    await get().loadData();
    return l;
  },

  updateLetter: async (id, data) => {
    await dbUpdateLetter(id, data);
    await get().loadData();
  },

  removeLetter: async (id) => {
    await dbDeleteLetter(id);
    await get().loadData();
  },

  markLetterReplied: async (letterId, replyId = null) => {
    await dbMarkReplied(letterId, replyId);
    await get().loadData();
  },

  filteredLetters: () => {
    const { letters, filters, sortField, sortOrder } = get();
    let result = [...letters];

    if (filters.type && filters.type !== "all") {
      result = result.filter((l) => l.type === filters.type);
    }
    if (filters.direction && filters.direction !== "all") {
      result = result.filter((l) => l.direction === filters.direction);
    }
    if (filters.contactId) {
      result = result.filter((l) => l.contact_id === filters.contactId);
    }
    if (filters.year) {
      result = result.filter(
        (l) =>
          getYear(l.sent_date) === filters.year ||
          getYear(l.received_date) === filters.year
      );
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.contact_name.toLowerCase().includes(q) ||
          l.contact_city.toLowerCase().includes(q) ||
          l.contact_country.toLowerCase().includes(q) ||
          l.stamp_description.toLowerCase().includes(q) ||
          l.postmark_location.toLowerCase().includes(q) ||
          l.notes.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let av: string = "";
      let bv: string = "";
      switch (sortField) {
        case "sent_date":
          av = a.sent_date || "";
          bv = b.sent_date || "";
          break;
        case "received_date":
          av = a.received_date || "";
          bv = b.received_date || "";
          break;
        case "contact_name":
          av = a.contact_name;
          bv = b.contact_name;
          break;
        default:
          av = a.created_at;
          bv = b.created_at;
      }
      return sortOrder === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    return result;
  },

  getContactStats: (contactId) => {
    const contact = get().contacts.find((c) => c.id === contactId);
    if (!contact) return null;
    const letters = get().letters.filter((l) => l.contact_id === contactId);
    if (letters.length === 0) return null;

    const dates = letters
      .map((l) => l.received_date || l.sent_date)
      .filter(Boolean) as string[];

    return {
      contactId: contact.id,
      contactName: contact.name,
      totalCount: letters.length,
      sentCount: letters.filter((l) => l.direction === "sent").length,
      receivedCount: letters.filter((l) => l.direction === "received").length,
      postcardCount: letters.filter((l) => l.type === "postcard").length,
      letterCount: letters.filter((l) => l.type === "letter").length,
      avgIntervalDays: computeAvgInterval(dates),
      firstLetterDate: dates.sort()[0] || null,
      lastLetterDate: dates.sort().reverse()[0] || null,
      unrepliedCount: letters.filter(
        (l) => l.direction === "received" && !l.is_replied
      ).length,
    };
  },

  getAllContactStats: () => {
    return get()
      .contacts.map((c) => get().getContactStats(c.id))
      .filter(Boolean) as ContactStatistics[];
  },

  getDashboardStats: () => {
    const { letters } = get();
    const currentYear = new Date().getFullYear();

    const totalLetters = letters.filter((l) => l.type === "letter").length;
    const totalPostcards = letters.filter((l) => l.type === "postcard").length;

    const yearLetters = letters.filter(
      (l) =>
        l.type === "letter" &&
        (getYear(l.sent_date) === currentYear ||
          getYear(l.received_date) === currentYear)
    ).length;

    const yearPostcards = letters.filter(
      (l) =>
        l.type === "postcard" &&
        (getYear(l.sent_date) === currentYear ||
          getYear(l.received_date) === currentYear)
    ).length;

    const pendingReplies = letters.filter(
      (l) => l.direction === "received" && !l.is_replied
    ).length;

    const totalPostage = letters
      .filter((l) => l.direction === "sent")
      .reduce((sum, l) => sum + (l.stamp_value || 0), 0);

    return {
      totalLetters,
      totalPostcards,
      totalSent: letters.filter((l) => l.direction === "sent").length,
      totalReceived: letters.filter((l) => l.direction === "received").length,
      pendingReplies,
      totalPostage,
      yearLetters,
      yearPostcards,
    };
  },

  getPendingReplies: () => {
    return get()
      .letters.filter((l) => l.direction === "received" && !l.is_replied)
      .map((l) => ({
        letter: l,
        waitingDays: daysSince(l.received_date) || 0,
      }))
      .sort((a, b) => b.waitingDays - a.waitingDays);
  },

  getMonthlyData: (year) => {
    const targetYear = year || new Date().getFullYear();
    const months: Record<string, MonthlyData> = {};

    for (let m = 1; m <= 12; m++) {
      const key = `${targetYear}-${String(m).padStart(2, "0")}`;
      months[key] = { month: key, sent: 0, received: 0, total: 0 };
    }

    for (const l of get().letters) {
      const ym = getYearMonth(l.sent_date || l.received_date);
      if (!ym || getYear(ym + "-01") !== targetYear) continue;
      if (!months[ym]) continue;
      if (l.direction === "sent") months[ym].sent++;
      else months[ym].received++;
      months[ym].total++;
    }

    return Object.values(months);
  },

  getContactRanks: (limit = 10) => {
    const map = new Map<string, ContactRank>();
    for (const l of get().letters) {
      const id = l.contact_id || "__no_contact__";
      if (!map.has(id)) {
        map.set(id, {
          id,
          name: l.contact_name,
          count: 0,
          sent: 0,
          received: 0,
        });
      }
      const r = map.get(id)!;
      r.count++;
      if (l.direction === "sent") r.sent++;
      else r.received++;
    }
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },

  getHeatmapData: () => {
    const { letters } = get();
    const years = new Set<number>();
    for (const l of letters) {
      const y = getYear(l.sent_date) || getYear(l.received_date);
      if (y) years.add(y);
    }
    const sortedYears = Array.from(years).sort();
    if (sortedYears.length === 0) {
      const cy = new Date().getFullYear();
      for (let m = 1; m <= 12; m++) {
        return [{ month: m, year: cy, count: 0 }];
      }
    }

    const minYear = sortedYears[0];
    const maxYear = sortedYears[sortedYears.length - 1];

    const data: HeatmapData[] = [];
    for (let y = minYear; y <= maxYear; y++) {
      for (let m = 1; m <= 12; m++) {
        data.push({ month: m, year: y, count: 0 });
      }
    }

    for (const l of letters) {
      const date = l.sent_date || l.received_date;
      if (!date) continue;
      const y = getYear(date);
      const m = getMonth(date);
      const idx = data.findIndex((d) => d.year === y && d.month === m);
      if (idx >= 0) data[idx].count++;
    }

    return data;
  },

  getPostageTrend: () => {
    const map = new Map<string, number>();
    for (const l of get().letters) {
      if (l.direction !== "sent") continue;
      const ym = getYearMonth(l.sent_date);
      if (!ym) continue;
      map.set(ym, (map.get(ym) || 0) + (l.stamp_value || 0));
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, postage]) => ({ month, postage: Math.round(postage * 100) / 100 }));
  },

  getPostcardLocations: () => {
    const groups = new Map<string, LocationGroup>();
    for (const l of get().letters.filter((x) => x.type === "postcard")) {
      const key = `${l.contact_country}__${l.contact_city}`;
      if (!groups.has(key)) {
        groups.set(key, {
          city: l.contact_city,
          country: l.contact_country,
          count: 0,
          latitude: l.contact_latitude,
          longitude: l.contact_longitude,
          postcards: [],
        });
      }
      const g = groups.get(key)!;
      g.count++;
      g.postcards.push(l);
      if (!g.latitude && l.contact_latitude) g.latitude = l.contact_latitude;
      if (!g.longitude && l.contact_longitude)
        g.longitude = l.contact_longitude;
    }
    return Array.from(groups.values()).sort((a, b) => b.count - a.count);
  },

  getLettersForContact: (contactId) => {
    return get()
      .letters.filter((l) => l.contact_id === contactId)
      .sort((a, b) => {
        const da = a.received_date || a.sent_date || "";
        const db = b.received_date || b.sent_date || "";
        return db.localeCompare(da);
      });
  },

  getAvailableYears: () => {
    const years = new Set<number>();
    for (const l of get().letters) {
      const y = getYear(l.sent_date) || getYear(l.received_date);
      if (y) years.add(y);
    }
    const current = new Date().getFullYear();
    years.add(current);
    return Array.from(years).sort().reverse();
  },
}));
