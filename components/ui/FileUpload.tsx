"use client";

import { useState, DragEvent } from "react";
import Image from "next/image";

export function FileUpload({
  onFileSelect,
}: {
  onFileSelect: (file: File | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [progress, setProgress] = useState(0);

  function handleFile(selectedFile: File) {
    setFile(selectedFile);
    onFileSelect(selectedFile);

    // อ่านขนาดจริงของรูป
    const img = new window.Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(selectedFile);

    // จำลอง progress bar
    setProgress(0);
    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(value);
      if (value >= 100) clearInterval(interval);
    }, 200);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) handleFile(selectedFile);
  }

  function handleRemove() {
    setFile(null);
    setDimensions(null);
    setProgress(0);
    onFileSelect(null);
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
    >
      {!file ? (
        <>
          <p className="text-gray-600 text-sm">Drag & drop image here</p>
          <p className="text-gray-400 text-xs mb-2">
            Or click to browse (1 file, max 5MB)
          </p>
          <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
            Browse file
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </>
      ) : (
        <div className="relative w-full">
          {/* Preview ด้วย Next/Image */}
          {dimensions && (
            <Image
              src={URL.createObjectURL(file)}
              alt="preview"
              width={dimensions.width}
              height={dimensions.height}
              unoptimized
              className="w-full h-48 object-contain rounded-lg border"
            />
          )}

          {/* ปุ่มลบ */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            ✕
          </button>

          {/* Progress bar */}
          {progress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* ข้อมูลไฟล์ */}
          <div className="mt-2 text-sm text-gray-700">
            <p>
              {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
            {dimensions && (
              <p className="text-xs text-gray-500">
                ขนาดจริง: {dimensions.width} × {dimensions.height}px
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
