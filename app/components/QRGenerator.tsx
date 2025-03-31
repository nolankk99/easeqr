"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Download, Share2, AlertCircle, RefreshCw, Upload, Image } from "lucide-react";
import { toast } from "../hooks/use-toast";
import { useQRHistory } from "../contexts/QRHistoryContext";
import { Alert, AlertDescription } from "./ui/alert";
import DataTypeSelector from "./DataTypeSelector";

// QRGenerator 컴포넌트 ref의 타입 정의
export interface QRGeneratorRef {
  setUrl: (url: string) => void;
  setColors: (bgColor: string, fgColor: string) => void;
}

const QRGenerator = forwardRef<QRGeneratorRef>((props, ref) => {
  const [url, setUrl] = useState<string>("");
  const [qrSize, setQrSize] = useState<number>(256);
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [fgColor, setFgColor] = useState<string>("#000000");
  const [colorContrastWarning, setColorContrastWarning] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number>(50);
  const [logoEnabled, setLogoEnabled] = useState<boolean>(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToHistory } = useQRHistory();
  const [shouldAddToHistory, setShouldAddToHistory] = useState(false);
  
  // 부모 컴포넌트에 노출할 메서드 정의
  useImperativeHandle(ref, () => ({
    setUrl: (newUrl: string) => {
      setUrl(newUrl);
    },
    setColors: (newBgColor: string, newFgColor: string) => {
      setBgColor(newBgColor);
      setFgColor(newFgColor);
    }
  }));
  
  // URL이 변경될 때 히스토리 추가 로직 (자동 추가 제거)
  useEffect(() => {
    // URL이 비어있거나 유효하지 않으면 아무 동작도 하지 않음
    if (!url || !isValidUrl(url) || !shouldAddToHistory) return;
    
    const formattedUrl = getFormattedUrl(url);
    addToHistory(formattedUrl, bgColor, fgColor);
    setShouldAddToHistory(false); // 추가 후 플래그 리셋
  }, [url, bgColor, fgColor, addToHistory, shouldAddToHistory]);

  // 색상 대비 체크
  useEffect(() => {
    const contrastRatio = getColorContrastRatio(bgColor, fgColor);
    
    if (contrastRatio < 2.0) {
      setColorContrastWarning("심각: QR 색상 대비가 너무 낮아 스캔이 불가능할 수 있습니다!");
    } else if (contrastRatio < 3.0) {
      setColorContrastWarning("주의: QR 색상 대비가 낮아 일부 스캐너에서 인식이 어려울 수 있습니다.");
    } else {
      setColorContrastWarning(null);
    }
  }, [bgColor, fgColor]);

  // 로고 이미지 업로드 핸들러
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 파일 크기 체크 (2MB 제한)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "파일 크기 제한",
          description: "로고 이미지는 2MB 이하여야 합니다.",
          variant: "destructive",
        });
        return;
      }
      
      // 파일 타입 체크
      if (!file.type.match('image.*')) {
        toast({
          title: "지원되지 않는 파일 형식",
          description: "이미지 파일(.jpg, .png, .gif 등)만 업로드 가능합니다.",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setLogoImage(loadEvent.target.result as string);
          setLogoEnabled(true);
          
          toast({
            title: "로고 업로드 완료",
            description: "QR 코드에 로고가 적용되었습니다.",
          });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // 로고 제거 함수
  const removeLogo = () => {
    setLogoImage(null);
    setLogoEnabled(false);
    
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "로고 제거 완료",
      description: "QR 코드에서 로고가 제거되었습니다.",
    });
  };

  // URL 입력 핸들러
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    // 유효한 URL 입력 시 자동 히스토리 추가 비활성화
    // setShouldAddToHistory(true); - 제거
  };
  
  // 데이터 유형 변경 핸들러
  const handleDataChange = (data: string) => {
    setUrl(data);
  };
  
  // 설정 초기화 함수
  const resetCustomSettings = () => {
    setQrSize(256);
    setBgColor("#FFFFFF");
    setFgColor("#000000");
    setLogoImage(null);
    setLogoEnabled(false);
    setLogoSize(50);
    
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "설정 초기화",
      description: "QR 코드 설정이 기본값으로 초기화되었습니다",
    });
  };

  // QR 코드 유효성 검증
  const isValidUrl = (text: string) => {
    if (!text) return false;
    try {
      // 입력된 URL에 http 프로토콜이 없는 경우 추가
      const urlWithProtocol = text.startsWith('http') ? text : `https://${text}`;
      new URL(urlWithProtocol);
      return true;
    } catch (e) {
      return false;
    }
  };

  // URL 형식 보정
  const getFormattedUrl = (text: string) => {
    if (!text) return "";
    return text.startsWith('http') ? text : `https://${text}`;
  };

  // 색상 HEX -> RGB 변환
  const hexToRgb = (hex: string) => {
    // #로 시작하면 제거
    hex = hex.replace('#', '');
    
    // 3자리 HEX 코드를 6자리로 변환 (예: #FFF -> #FFFFFF)
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    // RGB 값 계산
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  };

  // 색상의 상대적 휘도 계산 (WCAG 2.0 공식)
  const getLuminance = (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    
    // 표준화된 RGB 값 계산
    const sR = r / 255;
    const sG = g / 255;
    const sB = b / 255;
    
    // 감마 보정
    const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
    const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
    const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
    
    // 휘도 계산
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };

  // 색상 대비 비율 계산 (WCAG 2.0 공식)
  const getColorContrastRatio = (color1: string, color2: string) => {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    
    // 명암비 계산 (밝은 색 / 어두운 색)
    return l1 > l2 
      ? (l1 + 0.05) / (l2 + 0.05) 
      : (l2 + 0.05) / (l1 + 0.05);
  };

  // QR 코드 다운로드
  const downloadQRCode = () => {
    if (!url) {
      toast({
        title: "URL을 입력해주세요",
        description: "QR 코드를 생성하려면 URL을 입력하세요",
        variant: "destructive",
      });
      return;
    }

    // 색상 대비가 너무 낮으면 경고
    const contrastRatio = getColorContrastRatio(bgColor, fgColor);
    if (contrastRatio < 2.0) {
      toast({
        title: "QR 코드 색상 대비가 너무 낮습니다",
        description: "QR 코드를 스캔하지 못할 수 있습니다. 색상을 조정해 주세요.",
        variant: "destructive",
      });
      return;
    }

    // 다운로드할 때 히스토리에 추가
    if (isValidUrl(url)) {
      setShouldAddToHistory(true);
    }

    // Canvas를 이미지로 변환하여 다운로드
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");
      if (canvas) {
        try {
          // 다운로드 링크 생성
          const a = document.createElement("a");
          a.download = "qrcode.png";
          a.href = canvas.toDataURL("image/png");
          a.click();
        } catch (e) {
          toast({
            title: "QR 코드 다운로드 실패",
            description: "QR 코드 생성 중 오류가 발생했습니다",
            variant: "destructive",
          });
        }
      }
    }
  };

  // URL 공유하기
  const shareUrl = async () => {
    if (!url) {
      toast({
        title: "URL을 입력해주세요",
        description: "공유할 URL을 입력하세요",
        variant: "destructive",
      });
      return;
    }

    // 공유할 때 히스토리에 추가
    if (isValidUrl(url)) {
      setShouldAddToHistory(true);
    }

    const formattedUrl = getFormattedUrl(url);

    try {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "QR 코드 공유",
            text: "QR 코드로 생성된 링크입니다",
            url: formattedUrl,
          });
        } catch (error) {
          console.error("공유하기 실패:", error);
          // 공유 실패시 클립보드에 복사
          navigator.clipboard.writeText(formattedUrl).then(() => {
            toast({
              title: "URL이 클립보드에 복사되었습니다",
              description: formattedUrl,
            });
          });
        }
      } else {
        // 클립보드에 복사
        navigator.clipboard.writeText(formattedUrl).then(() => {
          toast({
            title: "URL이 클립보드에 복사되었습니다",
            description: formattedUrl,
          });
        });
      }
    } catch (e) {
      toast({
        title: "URL 공유 실패",
        description: "클립보드 접근 권한이 없거나 오류가 발생했습니다",
        variant: "destructive",
      });
    }
  };

  // QR 코드 로고 옵션
  const logoOptions = logoEnabled && logoImage ? {
    src: logoImage,
    width: logoSize,
    height: logoSize,
    excavate: true,
  } : undefined;

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-center">QR 코드 생성기</CardTitle>
        <CardDescription className="text-center">
          URL, 연락처, WiFi 등 다양한 정보를 QR 코드로 변환하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="generate" className="text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
              생성하기
            </TabsTrigger>
            <TabsTrigger value="customize" className="text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
              커스텀
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-6">
            <DataTypeSelector onDataChange={handleDataChange} initialData={url} />
            
            <div 
              className="flex justify-center items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm" 
              ref={qrRef}
            >
              {url ? (
                <QRCodeCanvas
                  value={url}
                  size={qrSize}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level="H"
                  includeMargin={true}
                  imageSettings={logoOptions}
                />
              ) : (
                <div className="text-gray-400 h-[256px] flex items-center justify-center text-center p-6">
                  데이터를 입력하면<br />QR 코드가 여기에 표시됩니다
                </div>
              )}
            </div>
            
            {/* 생성하기 탭의 다운로드/공유 버튼 */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button 
                className="w-full h-12" 
                onClick={downloadQRCode}
                disabled={!url || (!!colorContrastWarning?.startsWith("심각"))}
              >
                <Download className="mr-2 h-5 w-5" />
                QR 코드 다운로드
              </Button>
              <Button 
                className="w-full h-12" 
                variant="outline" 
                onClick={shareUrl}
                disabled={!url}
              >
                <Share2 className="mr-2 h-5 w-5" />
                URL 공유하기
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="customize" className="space-y-6">
            {colorContrastWarning && (
              <Alert variant={colorContrastWarning.startsWith("심각") ? "destructive" : "warning"} className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {colorContrastWarning}
                </AlertDescription>
              </Alert>
            )}

            <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-lg font-medium">QR 코드 커스터마이징</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetCustomSettings}
                  className="text-sm"
                >
                  <RefreshCw className="mr-2 h-3 w-3" />
                  초기화
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <Label htmlFor="qr-size" className="font-medium">QR 코드 크기</Label>
                  <Input
                    id="qr-size"
                    type="range"
                    min="128"
                    max="512"
                    step="16"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="cursor-pointer"
                  />
                  <div className="text-center text-sm text-muted-foreground">{qrSize}px</div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="bg-color" className="font-medium">배경색</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-11 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 h-11"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="fg-color" className="font-medium">QR 코드 색상</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fg-color"
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-12 h-11 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="flex-1 h-11"
                    />
                  </div>
                </div>
                
                {/* 로고 커스터마이징 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="logo-toggle" className="font-medium">로고 추가</Label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked={logoEnabled}
                        onChange={(e) => setLogoEnabled(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  {logoEnabled && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-9"
                        >
                          <Upload className="mr-2 h-3 w-3" />
                          로고 업로드
                        </Button>
                        
                        {logoImage && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={removeLogo}
                            className="h-9"
                          >
                            제거
                          </Button>
                        )}
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      
                      <Label htmlFor="logo-size" className="font-medium text-sm">로고 크기</Label>
                      <Input
                        id="logo-size"
                        type="range"
                        min="20"
                        max="100"
                        step="5"
                        value={logoSize}
                        onChange={(e) => setLogoSize(Number(e.target.value))}
                        disabled={!logoEnabled}
                        className="cursor-pointer"
                      />
                      <div className="text-center text-sm text-muted-foreground">{logoSize}px</div>
                      
                      {logoImage && (
                        <div className="flex justify-center mt-2">
                          <div className="w-12 h-12 border rounded overflow-hidden">
                            <img 
                              src={logoImage} 
                              alt="로고 미리보기" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* QR 코드 미리보기 */}
                <div className="space-y-3 md:col-span-2">
                  <Label className="font-medium">미리보기</Label>
                  <div className="flex justify-center items-center p-5 bg-white rounded-xl border border-gray-200">
                    {url ? (
                      <QRCodeCanvas
                        value={url}
                        size={qrSize > 300 ? 300 : qrSize}
                        bgColor={bgColor}
                        fgColor={fgColor}
                        level="H"
                        includeMargin={true}
                        imageSettings={logoOptions}
                      />
                    ) : (
                      <div className="text-gray-400 h-[200px] flex items-center justify-center text-center p-6">
                        데이터를 입력하면<br />미리보기가 표시됩니다
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 커스텀 탭에 현재 입력된 URL 표시 */}
            <div className="p-5 bg-white rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <Label className="text-lg font-medium">현재 데이터</Label>
                {url && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setUrl("")}
                    className="text-xs h-8 px-3 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    초기화
                  </Button>
                )}
              </div>
              {url ? (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm break-all">
                    {url}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic p-3">
                  생성하기 탭에서 데이터를 입력해주세요
                </p>
              )}
            </div>
            
            {/* 커스텀 탭의 다운로드/공유 버튼 */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button 
                className="w-full h-12" 
                onClick={downloadQRCode}
                disabled={!url || (!!colorContrastWarning?.startsWith("심각"))}
              >
                <Download className="mr-2 h-5 w-5" />
                QR 코드 다운로드
              </Button>
              <Button 
                className="w-full h-12" 
                variant="outline" 
                onClick={shareUrl}
                disabled={!url}
              >
                <Share2 className="mr-2 h-5 w-5" />
                URL 공유하기
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});

QRGenerator.displayName = "QRGenerator";

export default QRGenerator; 