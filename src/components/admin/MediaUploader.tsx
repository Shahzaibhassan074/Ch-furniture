"use client";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { UploadCloud, Film, CheckCircle2, XCircle } from "lucide-react";

export type UploadedMedia = { url: string; publicId: string; type: "image" | "video"; posterUrl?: string };

type FileState = {
  id: string;
  name: string;
  type: "image" | "video";
  status: "uploading" | "done" | "error";
  progress: number;
  errorMsg?: string;
  result?: UploadedMedia;
  previewUrl?: string;
};

type UploadSignature = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  allowedFormats: string;
  maxBytes: number;
};

const MAX_UNCOMPRESSED_IMAGE_BYTES = 300 * 1024;

async function prepareUploadFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= MAX_UNCOMPRESSED_IMAGE_BYTES) {
    return file;
  }
  return imageCompression(file, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
  });
}

async function fetchUploadSignature(): Promise<UploadSignature> {
  const res = await fetch("/api/cloudinary/sign", { method: "POST" });
  if (!res.ok) throw new Error("Could not get upload signature — are you still logged in?");
  return res.json();
}

async function uploadToCloudinary(
  file: File,
  onProgress: (pct: number) => void
): Promise<UploadedMedia> {
  const sig = await fetchUploadSignature();
  const url = `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("signature", sig.signature);
  fd.append("folder", sig.folder);
  fd.append("allowed_formats", sig.allowedFormats);
  fd.append("max_bytes", String(sig.maxBytes));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        const info = JSON.parse(xhr.responseText);
        const type = info.resource_type === "video" ? "video" : "image";
        resolve({
          url: info.secure_url,
          publicId: info.public_id,
          type,
          posterUrl: type === "video"
            ? info.secure_url.replace(/\.[^/.]+$/, ".jpg")
            : undefined,
        });
      } else {
        const body = JSON.parse(xhr.responseText || "{}");
        reject(new Error(body?.error?.message || `Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(fd);
  });
}

export function MediaUploader({
  onUploaded,
  resourceType = "auto",
}: {
  onUploaded: (items: UploadedMedia[]) => void;
  resourceType?: "image" | "video" | "auto";
}) {
  const [files, setFiles] = useState<FileState[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept =
    resourceType === "image"
      ? "image/*"
      : resourceType === "video"
      ? "video/*"
      : "image/*,video/*";

  const processFiles = useCallback(
    async (raw: File[]) => {
      const filtered = raw.filter((f) => {
        if (resourceType === "image") return f.type.startsWith("image/");
        if (resourceType === "video") return f.type.startsWith("video/");
        return f.type.startsWith("image/") || f.type.startsWith("video/");
      });
      if (!filtered.length) return;

      const entries: FileState[] = filtered.map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        type: f.type.startsWith("video/") ? "video" : "image",
        status: "uploading",
        progress: 0,
        previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
      }));
      setFiles((p) => [...p, ...entries]);

      await Promise.all(
        filtered.map(async (file, i) => {
          const entry = entries[i];
          try {
            const uploadFile = await prepareUploadFile(file);
            const result = await uploadToCloudinary(uploadFile, (pct) => {
              setFiles((p) =>
                p.map((s) => (s.id === entry.id ? { ...s, progress: pct } : s))
              );
            });
            setFiles((p) =>
              p.map((s) =>
                s.id === entry.id ? { ...s, status: "done", progress: 100, result } : s
              )
            );
            onUploaded([result]);
          } catch (err: any) {
            setFiles((p) =>
              p.map((s) => (s.id === entry.id ? { ...s, status: "error", errorMsg: err?.message } : s))
            );
          }
        })
      );
    },
    [resourceType, onUploaded]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const raw = Array.from(e.dataTransfer.files);
      processFiles(raw);
    },
    [processFiles]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Array.from(e.target.files ?? []);
    processFiles(raw);
    e.target.value = "";
  };

  const removeEntry = (id: string) => {
    setFiles((p) => {
      const entry = p.find((s) => s.id === id);
      if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl);
      return p.filter((s) => s.id !== id);
    });
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed py-10 text-linenDim transition-colors
          ${dragging ? "border-brass bg-brass/10 text-brass" : "border-walnut/60 bg-espresso hover:border-brass/60"}`}
      >
        <UploadCloud className={`h-7 w-7 ${dragging ? "text-brass" : "text-brass"}`} />
        <span className="text-sm font-medium">
          {dragging ? "Drop files here" : "Click to browse or drag & drop files"}
        </span>
        <span className="text-xs text-linenDim/60">
          {resourceType === "image" ? "Images only" : resourceType === "video" ? "Videos only" : "Images & videos"} · Select as many as you want
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={onInputChange}
      />

      {/* File progress list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-sm border border-walnut/40 bg-bark p-2.5">
              {/* Thumbnail */}
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-sm bg-walnut">
                {f.type === "image" && f.previewUrl ? (
                  <Image src={f.previewUrl} alt="" fill className="object-cover" unoptimized />
                ) : f.type === "video" && f.result?.url ? (
                  <video src={f.result.url} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Film className="h-5 w-5 text-linenDim" />
                  </div>
                )}
              </div>

              {/* Info + progress */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-linen">{f.name}</p>
                {f.status === "uploading" && (
                  <div className="mt-1.5">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-walnut/60">
                      <div
                        className="h-full rounded-full bg-brass transition-all duration-200"
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-[10px] text-linenDim">{f.progress}%</p>
                  </div>
                )}
                {f.status === "done" && (
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-green-400">
                    <CheckCircle2 className="h-3 w-3" /> Uploaded
                  </p>
                )}
                {f.status === "error" && (
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-red-400">
                    <XCircle className="h-3 w-3" /> {f.errorMsg || "Failed — try again"}
                  </p>
                )}
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeEntry(f.id); }}
                className="flex-shrink-0 text-linenDim hover:text-red-400"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
