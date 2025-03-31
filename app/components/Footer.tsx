"use client";

import { Card, CardContent } from "./ui/card";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-16 py-10 px-4 border-t border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* SEO를 위한 관련 키워드 텍스트 */}
        <div className="mb-12 text-gray-600">
          <h2 className="font-bold text-lg mb-4 text-gray-800">QR 코드 정보</h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              QR 코드(Quick Response code)는 정보를 저장할 수 있는 매트릭스 형태의 이차원 바코드입니다.
              일본의 Denso Wave사에서 1994년에 개발되었으며, 오늘날 다양한 분야에서 활용되고 있습니다.
              URL, 연락처, WiFi 정보 등 다양한 데이터를 저장할 수 있습니다.
            </p>
            <p>
              EaseQR은 URL을 QR 코드로 변환해주는 간편한 도구입니다.
              생성된 QR 코드는 스마트폰 카메라로 스캔하여 바로 웹사이트에 접속할 수 있어,
              명함, 포스터, 제품 포장 등 다양한 용도로 활용할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 상단 광고 */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-12">
          <Card className="border border-gray-200 h-full">
            <CardContent className="flex items-center justify-center h-64 p-0">
              <div className="w-full h-full flex items-center justify-center">
                <ins className="adsbygoogle"
                  style={{ display: 'block', width: '100%', height: '100%' }}
                  data-ad-client="ca-pub-5138554444834908"
                  data-ad-slot="1234567890"
                  data-ad-format="auto"
                  data-full-width-responsive="true">
                </ins>
                <script dangerouslySetInnerHTML={{
                  __html: `
                    (adsbygoogle = window.adsbygoogle || []).push({});
                  `
                }} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 h-full">
            <CardContent className="flex items-center justify-center h-64 p-0">
              <div className="w-full h-full flex items-center justify-center">
                <ins className="adsbygoogle"
                  style={{ display: 'block', width: '100%', height: '100%' }}
                  data-ad-client="ca-pub-5138554444834908"
                  data-ad-slot="9876543210"
                  data-ad-format="auto"
                  data-full-width-responsive="true">
                </ins>
                <script dangerouslySetInnerHTML={{
                  __html: `
                    (adsbygoogle = window.adsbygoogle || []).push({});
                  `
                }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 저작권 정보 */}
        <div className="text-center text-gray-500 text-sm">
          <p>© {currentYear} EaseQR. 모든 권리 보유.</p>
        </div>
      </div>
    </footer>
  );
} 