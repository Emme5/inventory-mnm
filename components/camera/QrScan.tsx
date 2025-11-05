"use client"

import { useState } from "react"
import { useZxing } from "react-zxing"

type QrScanProps = {
  onResult: (value: string) => void
}

export function QrScan({ onResult }: QrScanProps) {
  const [result, setResult] = useState("")

  const { ref } = useZxing({
    onDecodeResult(result) {
      const text = result.getText()
      setResult(text)
      onResult(text)
    },
  })

  return (
    <div className="space-y-2">
      <video ref={ref} className="w-full rounded border" />
      {result && <p className="text-sm text-green-600">✅ สแกนได้: {result}</p>}
    </div>
  )
}
