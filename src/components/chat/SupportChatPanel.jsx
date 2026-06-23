import React, { useEffect, useRef, useState } from "react";
import { Paperclip, Send, X, Loader2, FileText } from "lucide-react";
import { api } from "@/api/apiClient";
import { isStaffSender, messageReadLabel } from "@/lib/supportChat";
import { cn } from "@/lib/utils";

function MessageAttachments({ attachments = [], fromStaff }) {
  if (!attachments?.length) return null;
  const images = attachments.filter((a) => a.type?.startsWith("image/") || /\.(jpe?g|png|gif|webp)$/i.test(a.url || ""));
  const files = attachments.filter((a) => !images.includes(a));

  return (
    <div className="space-y-2 mt-1">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((file) => (
            <a
              key={file.url}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-28 h-28 rounded-xl overflow-hidden border border-white/20"
            >
              <img src={file.url} alt={file.name || "Adjunto"} className="w-full h-full object-cover" />
            </a>
          ))}
        </div>
      )}
      {files.map((file) => (
        <a
          key={file.url}
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold underline underline-offset-2",
            fromStaff ? "text-foreground" : "text-white/95"
          )}
        >
          <FileText className="size-3.5 shrink-0" />
          {file.name || "Archivo adjunto"}
        </a>
      ))}
    </div>
  );
}

export default function SupportChatPanel({
  messages = [],
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Escribe un mensaje…",
  emptyHint = "Inicia la conversación con el equipo HABIBAR.",
  viewerIsUser = true,
  allowAttachments = true,
}) {
  const bottomRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, attachments.length]);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files.slice(0, 4 - attachments.length)) {
        const { file_url } = await api.integrations.Core.UploadFile({ file });
        uploaded.push({ url: file_url, name: file.name, type: file.type });
      }
      setAttachments((prev) => [...prev, ...uploaded].slice(0, 4));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeAttachment = (url) => setAttachments((prev) => prev.filter((a) => a.url !== url));

  const canSend = Boolean(value.trim() || attachments.length);

  const submit = () => {
    if (!canSend || disabled || uploading) return;
    onSend({ body: value.trim(), attachments });
    setAttachments([]);
  };

  return (
    <div className="bg-white rounded-2xl border border-border/40 min-h-[360px] flex flex-col">
      <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[420px]">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12 px-4">{emptyHint}</p>
        ) : (
          messages.map((m) => {
            const fromStaff = isStaffSender(m.sender_role);
            const readLabel = messageReadLabel(m, { viewerIsUser });
            return (
              <div key={m.id} className={cn("flex flex-col", fromStaff ? "items-start" : "items-end")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    fromStaff ? "bg-secondary text-foreground" : "bg-brand-violet text-white"
                  )}
                >
                  {m.body && <p>{m.body}</p>}
                  <MessageAttachments attachments={m.attachments} fromStaff={fromStaff} />
                </div>
                {readLabel && (
                  <p className={cn("text-[10px] mt-1 px-1", m.read ? "text-muted-foreground" : "text-muted-foreground/70")}>
                    {readLabel}
                  </p>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {attachments.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {attachments.map((file) => (
            <div key={file.url} className="relative">
              {file.type?.startsWith("image/") ? (
                <img src={file.url} alt="" className="w-14 h-14 rounded-lg object-cover border border-border/50" />
              ) : (
                <div className="h-14 px-3 rounded-lg border border-border/50 flex items-center gap-1 text-[10px] font-semibold max-w-[120px] truncate">
                  <FileText className="size-3.5 shrink-0" />
                  {file.name}
                </div>
              )}
              <button
                type="button"
                onClick={() => removeAttachment(file.url)}
                className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-foreground text-white flex items-center justify-center"
                aria-label="Quitar adjunto"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 border-t flex gap-2 items-center">
        {allowAttachments && (
          <label className="h-10 w-10 rounded-xl border border-border flex items-center justify-center cursor-pointer hover:bg-secondary/50 shrink-0">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-brand-violet" />
            ) : (
              <Paperclip className="w-4 h-4 text-muted-foreground" />
            )}
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFiles}
              disabled={disabled || uploading || attachments.length >= 4}
            />
          </label>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && canSend && submit()}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 h-10 px-4 rounded-xl border text-sm disabled:opacity-60"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || uploading || !canSend}
          className="h-10 w-10 rounded-xl gradient-cta text-white flex items-center justify-center disabled:opacity-50 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
