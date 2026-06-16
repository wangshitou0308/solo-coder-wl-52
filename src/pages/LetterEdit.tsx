import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Mail,
  Trash2,
  FileText,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Letter } from "@/types";
import LetterForm from "@/components/LetterForm";

export default function LetterEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const letters = useStore((s) => s.letters);
  const createLetter = useStore((s) => s.createLetter);
  const updateLetter = useStore((s) => s.updateLetter);
  const removeLetter = useStore((s) => s.removeLetter);
  const [initialData, setInitialData] = useState<Letter | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = id !== "new" && id !== undefined;

  useEffect(() => {
    if (isEdit && id && letters.length > 0) {
      const found = letters.find((l) => l.id === id);
      setInitialData(found || null);
    }
  }, [isEdit, id, letters]);

  const handleSubmit = async (
    data: Omit<Letter, "id" | "created_at" | "updated_at">
  ) => {
    setSubmitting(true);
    try {
      if (isEdit && id) {
        await updateLetter(id, data);
        navigate(`/letters/${id}`);
      } else {
        const newLetter = await createLetter(data);
        navigate(`/letters/${newLetter.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEdit && id) {
      navigate(`/letters/${id}`);
    } else {
      navigate("/letters");
    }
  };

  const handleDelete = () => {
    if (!initialData) return;
    if (confirm("确认删除这条信件记录吗？此操作无法撤销。")) {
      removeLetter(initialData.id);
      navigate("/letters");
    }
  };

  if (isEdit && !initialData && letters.length > 0) {
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="btn-ghost -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          <div>
            <h1 className="section-title !mb-0">
              {isEdit ? (
                <>
                  <Pencil className="w-7 h-7 text-ink-700" />
                  编辑信件记录
                </>
              ) : (
                <>
                  <Plus className="w-7 h-7 text-ink-700" />
                  新增信件记录
                </>
              )}
            </h1>
            {isEdit && initialData && (
              <p className="mt-1 ml-4 text-ink-500 text-sm flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                {initialData.contact_name} ·{" "}
                {initialData.direction === "received" ? "收到" : "寄出"}
              </p>
            )}
          </div>
        </div>
        {isEdit && initialData && (
          <button onClick={handleDelete} className="btn-danger sm:ml-auto">
            <Trash2 className="w-4 h-4" />
            删除记录
          </button>
        )}
      </div>

      {submitting && (
        <div className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="animate-spin w-10 h-10 border-4 border-parchment-200 border-t-ink-500 rounded-full" />
            <p className="font-medium text-ink-600">
              {isEdit ? "保存修改中..." : "创建记录中..."}
            </p>
          </div>
        </div>
      )}

      <LetterForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
