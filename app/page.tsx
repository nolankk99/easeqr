"use client";

import { useRef } from "react";
import Header from "./components/Header";
import QRGenerator, { QRGeneratorRef } from "./components/QRGenerator";
import QRHistory from "./components/QRHistory";
import Footer from "./components/Footer";

export default function Home() {
  // QR 생성기 상태를 위한 ref
  const qrGeneratorRef = useRef<QRGeneratorRef>(null);

  // 히스토리 항목 선택 시 QR 생성기에 적용
  const handleSelectHistory = (url: string, bgColor: string, fgColor: string) => {
    if (qrGeneratorRef.current) {
      qrGeneratorRef.current.setUrl(url);
      qrGeneratorRef.current.setColors(bgColor, fgColor);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <QRGenerator ref={qrGeneratorRef} />
          </div>
          
          <div>
            <QRHistory onSelectHistory={handleSelectHistory} />
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
