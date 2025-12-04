"use client";

import { useState } from "react";
import { useZxing } from "react-zxing";
import { motion } from "framer-motion";

type QrScanProps = {
  onResult: (value: string) => void;
};

export default function QrScan({ onResult }: QrScanProps) {
  const [result, setResult] = useState("");
  const [cameraReady, setCameraReady] = useState(false);

  const { ref } = useZxing({
    onDecodeResult(result) {
      const text = result.getText();
      console.log("Decoded:", text);
      setResult(text);
      onResult(text);
    },
  });

  return (
    <div className="relative w-full">
      <video
        ref={ref}
        className="w-full rounded-lg border-2 border-gray-200 shadow-sm"
        onPlaying={() => setCameraReady(true)}
      />

      {cameraReady && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* กรอบพื้นที่สแกน */}
          <div className="relative w-48 h-48">
            {/* --- ส่วนตกแต่งมุมกรอบ (เหมือนเดิม) --- */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>

            <motion.div
              initial={{ top: 0, opacity: 0.5 }}
              animate={{
                top: ["0%", "95%"], // วิ่งจากบนลงล่าง (เกือบสุดกรอบ)
                opacity: [0.5, 1, 0.5], // สว่างขึ้นตรงกลาง แล้วจางลง
              }}
              transition={{
                duration: 1.5, // ความเร็วในการวิ่ง (วินาที)
                repeat: Infinity, // วนซ้ำตลอด
                repeatType: "reverse", // สำคัญ: วิ่งไปแล้ววิ่งกลับ (ขึ้น-ลง)
                ease: "linear", // ความเร็วสม่ำเสมอ
              }}
              className="absolute left-0 w-full h-1 bg-linear-to-r from-transparent via-red-400 to-transparent shadow-[0_0_15px_rgba(255, 0, 0, 0.8)]"
            />
          </div>
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm text-green-700 font-medium">
            ✅ สแกนสำเร็จ: {result}
          </p>
        </div>
      )}
    </div>
  );
}
