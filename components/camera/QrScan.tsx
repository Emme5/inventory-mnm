"use client";

import { useState } from "react";
import { useZxing } from "react-zxing";

type QrScanProps = {
  onResult: (value: string) => void;
};

export default function QrScan({ onResult }: QrScanProps) {
  const [result, setResult] = useState("");
  const [cameraReady, setCameraReady] = useState(false);

  const { ref } = useZxing({
    onDecodeResult(result) {
      const text = result.getText();
      setResult(text);
      onResult(text);
    },
  });

  return (
    <div className="relative w-full">
      <video
        ref={ref}
        className="w-full rounded border"
        onPlaying={() => setCameraReady(true)}
      />

      {cameraReady && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-48 h-48">
            {/* มุมบนซ้าย */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
            {/* มุมบนขวา */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
            {/* มุมล่างซ้าย */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
            {/* มุมล่างขวา */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
          </div>
        </div>
      )}

      {result && (
        <p className="text-sm text-green-600 mt-2">✅ สแกนได้: {result}</p>
      )}
    </div>
  );
}
