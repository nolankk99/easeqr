'use client';

export default function Header() {
  return (
    <header className="py-6 px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          EaseQR
        </h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto mb-5 rounded-full"></div>
        <p className="text-xl text-gray-600 leading-relaxed">
          URL, 연락처, WiFi 등 다양한 정보를 손쉽게 QR 코드로 변환할 수 있습니다.
        </p>
        <p className="text-xl text-gray-600 leading-relaxed">
          또한, 로고 추가와 색상 커스터마이징을 통해 나만의 QR 코드를 만들 수 있습니다.
        </p>
      </div>
    </header>
  );
} 