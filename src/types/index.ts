export type LetterType = "letter" | "postcard";
export type Direction = "sent" | "received";

export interface Contact {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  avatar?: string;
  notes?: string;
  created_at: string;
}

export interface Letter {
  id: string;
  type: LetterType;
  direction: Direction;
  contact_id: string | null;
  contact_name: string;
  contact_address: string;
  contact_city: string;
  contact_country: string;
  contact_latitude?: number | null;
  contact_longitude?: number | null;
  sent_date: string | null;
  received_date: string | null;
  stamp_value: number | null;
  stamp_description: string;
  postmark_date: string | null;
  postmark_location: string;
  notes: string;
  is_replied: boolean;
  reply_to_id: string | null;
  photos: string[];
  created_at: string;
  updated_at: string;
}

export interface ContactStatistics {
  contactId: string;
  contactName: string;
  totalCount: number;
  sentCount: number;
  receivedCount: number;
  postcardCount: number;
  letterCount: number;
  avgIntervalDays: number;
  firstLetterDate: string | null;
  lastLetterDate: string | null;
  unrepliedCount: number;
}

export interface DashboardStats {
  totalLetters: number;
  totalPostcards: number;
  totalSent: number;
  totalReceived: number;
  pendingReplies: number;
  totalPostage: number;
  yearLetters: number;
  yearPostcards: number;
}

export interface MonthlyData {
  month: string;
  sent: number;
  received: number;
  total: number;
}

export interface ContactRank {
  id: string;
  name: string;
  count: number;
  sent: number;
  received: number;
}

export interface HeatmapData {
  month: number;
  year: number;
  count: number;
}

export interface PostageTrend {
  month: string;
  postage: number;
}

export interface LocationGroup {
  city: string;
  country: string;
  count: number;
  latitude?: number | null;
  longitude?: number | null;
  postcards: Letter[];
}

export interface PendingReply {
  letter: Letter;
  waitingDays: number;
}

export type SortField =
  | "created_at"
  | "sent_date"
  | "received_date"
  | "contact_name";
export type SortOrder = "asc" | "desc";

export interface LetterFilters {
  type?: LetterType | "all";
  direction?: Direction | "all";
  contactId?: string | null;
  search?: string;
  year?: number | null;
}
