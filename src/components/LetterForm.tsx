import { useState, useCallback, useRef } from "react";
import {
  Mail,
  MapPin,
  CalendarDays,
  Image,
  Send,
  X,
  User,
  Globe,
  Navigation,
  Stamp,
  StickyNote,
  MessageCircle,
  Reply,
  Upload,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Letter, LetterType, Direction } from "@/types";
import { generateId } from "@/utils/id";
import { cn } from "@/lib/utils";

interface Props {
  initialData?: Letter;
  onSubmit: (data: Letter) => Promise<void>;
  onCancel: () => void;
}

interface FormState {
  type: LetterType;
  direction: Direction;
  contact_name: string;
  contact_address: string;
  contact_city: string;
  contact_country: string;
  contact_latitude: string;
  contact_longitude: string;
  sent_date: string;
  received_date: string;
  stamp_value: string;
  stamp_description: string;
  postmark_date: string;
  postmark_location: string;
  notes: string;
  is_replied: boolean;
  photos: string[];
}

const defaultFormState: FormState = {
  type: "letter",
  direction: "sent",
  contact_name: "",
  contact_address: "",
  contact_city: "",
  contact_country: "",
  contact_latitude: "",
  contact_longitude: "",
  sent_date: "",
  received_date: "",
  stamp_value: "",
  stamp_description: "",
  postmark_date: "",
  postmark_location: "",
  notes: "",
  is_replied: false,
  photos: [],
};

function letterToFormState(letter: Letter): FormState {
  return {
    type: letter.type,
    direction: letter.direction,
    contact_name: letter.contact_name,
    contact_address: letter.contact_address,
    contact_city: letter.contact_city,
    contact_country: letter.contact_country,
    contact_latitude: letter.contact_latitude?.toString() ?? "",
    contact_longitude: letter.contact_longitude?.toString() ?? "",
    sent_date: letter.sent_date ?? "",
    received_date: letter.received_date ?? "",
    stamp_value: letter.stamp_value?.toString() ?? "",
    stamp_description: letter.stamp_description,
    postmark_date: letter.postmark_date ?? "",
    postmark_location: letter.postmark_location,
    notes: letter.notes,
    is_replied: letter.is_replied,
    photos: letter.photos ?? [],
  };
}

export default function LetterForm({ initialData, onSubmit, onCancel }: Props) {
  const [formState, setFormState] = useState<FormState>(
    initialData ? letterToFormState(initialData) : defaultFormState
  );
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const newPhotos: string[] = [];

      for (const file of Array.from(files)) {
        try {
          const base64 = await fileToBase64(file);
          newPhotos.push(base64);
        } catch (err) {
          console.error("Failed to convert file to base64:", err);
        }
      }

      setFormState((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    []
  );

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = useCallback((index: number) => {
    setFormState((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const letter: Letter = {
        id: initialData?.id ?? generateId(),
        type: formState.type,
        direction: formState.direction,
        contact_id: initialData?.contact_id ?? null,
        contact_name: formState.contact_name.trim(),
        contact_address: formState.contact_address.trim(),
        contact_city: formState.contact_city.trim(),
        contact_country: formState.contact_country.trim(),
        contact_latitude: formState.contact_latitude
          ? parseFloat(formState.contact_latitude)
          : null,
        contact_longitude: formState.contact_longitude
          ? parseFloat(formState.contact_longitude)
          : null,
        sent_date: formState.sent_date || null,
        received_date: formState.received_date || null,
        stamp_value: formState.stamp_value
          ? parseFloat(formState.stamp_value)
          : null,
        stamp_description: formState.stamp_description.trim(),
        postmark_date: formState.postmark_date || null,
        postmark_location: formState.postmark_location.trim(),
        notes: formState.notes.trim(),
        is_replied: formState.is_replied,
        reply_to_id: initialData?.reply_to_id ?? null,
        photos: formState.photos,
        created_at: initialData?.created_at ?? now,
        updated_at: now,
      };

      await onSubmit(letter);
    } finally {
      setSubmitting(false);
    }
  };

  const TypeOption = ({
    value,
    label,
    icon: Icon,
  }: {
    value: LetterType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => {
    const active = formState.type === value;
    return (
      <button
        type="button"
        onClick={() => updateField("type", value)}
        className={cn(
          "flex-1 flex flex-col items-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-200",
          active
            ? "border-ink-600 bg-ink-50 text-ink-800"
            : "border-parchment-200 bg-white/50 text-ink-500 hover:border-parchment-300 hover:bg-white"
        )}
      >
        <Icon className={cn("w-5 h-5", active ? "text-ink-700" : "text-ink-400")} />
        <span className="text-sm font-medium">{label}</span>
      </button>
    );
  };

  const DirectionOption = ({
    value,
    label,
    icon: Icon,
  }: {
    value: Direction;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => {
    const active = formState.direction === value;
    return (
      <button
        type="button"
        onClick={() => updateField("direction", value)}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-200",
          active
            ? value === "sent"
              ? "border-stamp-500 bg-stamp-50 text-stamp-700"
              : "border-ink-500 bg-ink-50 text-ink-700"
            : "border-parchment-200 bg-white/50 text-ink-500 hover:border-parchment-300 hover:bg-white"
        )}
      >
        <Icon
          className={cn(
            "w-4 h-4",
            active
              ? value === "sent"
                ? "text-stamp-600"
                : "text-ink-600"
              : "text-ink-400"
          )}
        />
        <span className="text-sm font-medium">{label}</span>
      </button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="card-parchment p-6 space-y-6">
        <h2 className="section-title">
          <Mail className="w-6 h-6 text-stamp-500" />
          基础信息
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="input-label flex items-center gap-2">
              <Stamp className="w-4 h-4 text-stamp-500" />
              类型
            </label>
            <div className="flex gap-3">
              <TypeOption value="letter" label="信件" icon={Mail} />
              <TypeOption value="postcard" label="明信片" icon={MapPin} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="input-label flex items-center gap-2">
              <Navigation className="w-4 h-4 text-ink-500" />
              收发方向
            </label>
            <div className="flex gap-3">
              <DirectionOption value="sent" label="寄出" icon={Send} />
              <DirectionOption value="received" label="收到" icon={MessageCircle} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-parchment-50 border border-parchment-200">
          <button
            type="button"
            onClick={() => updateField("is_replied", !formState.is_replied)}
            className={cn(
              "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200",
              formState.is_replied
                ? "bg-ink-600 border-ink-600 text-white"
                : "border-parchment-300 bg-white hover:border-ink-400"
            )}
          >
            {formState.is_replied && <CheckCircle2 className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2">
            <Reply
              className={cn(
                "w-4 h-4",
                formState.is_replied ? "text-ink-600" : "text-ink-400"
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                formState.is_replied ? "text-ink-800" : "text-ink-500"
              )}
            >
              已回复
            </span>
          </div>
        </div>
      </section>

      <section className="card-parchment p-6 space-y-6">
        <h2 className="section-title">
          <User className="w-6 h-6 text-envelope-500" />
          联系人信息
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 md:col-span-2">
            <label className="input-label flex items-center gap-2">
              <User className="w-4 h-4 text-envelope-500" />
              联系人姓名 *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="请输入联系人姓名"
              value={formState.contact_name}
              onChange={(e) => updateField("contact_name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="input-label flex items-center gap-2">
              <MapPin className="w-4 h-4 text-envelope-500" />
              地址
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="请输入详细地址"
              value={formState.contact_address}
              onChange={(e) => updateField("contact_address", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="input-label flex items-center gap-2">
              <Globe className="w-4 h-4 text-envelope-500" />
              城市
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="城市"
              value={formState.contact_city}
              onChange={(e) => updateField("contact_city", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="input-label flex items-center gap-2">
              <Globe className="w-4 h-4 text-envelope-500" />
              国家
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="国家"
              value={formState.contact_country}
              onChange={(e) => updateField("contact_country", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="input-label flex items-center gap-2">
              <Navigation className="w-4 h-4 text-envelope-500" />
              纬度
            </label>
            <input
              type="number"
              step="any"
              className="input-field"
              placeholder="例如：39.9042"
              value={formState.contact_latitude}
              onChange={(e) => updateField("contact_latitude", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="input-label flex items-center gap-2">
              <Navigation className="w-4 h-4 text-envelope-500" />
              经度
            </label>
            <input
              type="number"
              step="any"
              className="input-field"
              placeholder="例如：116.4074"
              value={formState.contact_longitude}
              onChange={(e) => updateField("contact_longitude", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="card-parchment p-6 space-y-6">
        <h2 className="section-title">
          <CalendarDays className="w-6 h-6 text-ink-500" />
          日期与邮戳
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="input-label flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-stamp-500" />
              寄出日期
            </label>
            <input
              type="date"
              className="input-field"
              value={formState.sent_date}
              onChange={(e) => updateField("sent_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="input-label flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-ink-500" />
              收到日期
            </label>
            <input
              type="date"
              className="input-field"
              value={formState.received_date}
              onChange={(e) => updateField("received_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="input-label flex items-center gap-2">
              <Stamp className="w-4 h-4 text-envelope-500" />
              邮票面值（元）
            </label>
            <input
              type="number"
              step="any"
              min="0"
              className="input-field"
              placeholder="例如：1.20"
              value={formState.stamp_value}
              onChange={(e) => updateField("stamp_value", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="input-label flex items-center gap-2">
              <MapPin className="w-4 h-4 text-ink-500" />
              邮戳地点
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="例如：北京海淀"
              value={formState.postmark_location}
              onChange={(e) => updateField("postmark_location", e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="input-label flex items-center gap-2">
              <Stamp className="w-4 h-4 text-stamp-500" />
              邮票图案描述
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="例如：故宫博物院纪念邮票"
              value={formState.stamp_description}
              onChange={(e) => updateField("stamp_description", e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="input-label flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-envelope-500" />
              邮戳日期
            </label>
            <input
              type="date"
              className="input-field"
              value={formState.postmark_date}
              onChange={(e) => updateField("postmark_date", e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="input-label flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-ink-500" />
              备注
            </label>
            <textarea
              className="input-field min-h-[100px] resize-y"
              placeholder="记录这封信的故事、心情、内容摘要..."
              value={formState.notes}
              onChange={(e) => updateField("notes", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="card-parchment p-6 space-y-6">
        <h2 className="section-title">
          <Image className="w-6 h-6 text-parchment-600" />
          照片
        </h2>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {formState.photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-5">
              {formState.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-parchment-200 shadow-sm"
                >
                  <img
                    src={photo}
                    alt={`照片 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-envelope-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-envelope-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-white text-xs">照片 {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-3 py-10 px-6 rounded-xl border-2 border-dashed border-parchment-300 bg-parchment-50/50 text-ink-500 hover:border-ink-400 hover:bg-parchment-100/50 hover:text-ink-700 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-parchment-100 flex items-center justify-center">
              <Upload className="w-6 h-6 text-ink-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">点击上传照片</p>
              <p className="text-xs text-ink-400 mt-1">
                支持 JPG、PNG 等格式，可多选
              </p>
            </div>
          </button>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1 order-2 sm:order-1"
          disabled={submitting}
        >
          <X className="w-4 h-4" />
          取消
        </button>
        <button
          type="submit"
          className="btn-primary flex-1 order-1 sm:order-2"
          disabled={submitting || !formState.contact_name.trim()}
        >
          <Send className="w-4 h-4" />
          {submitting ? "保存中..." : initialData ? "保存修改" : "创建记录"}
        </button>
      </div>
    </form>
  );
}
