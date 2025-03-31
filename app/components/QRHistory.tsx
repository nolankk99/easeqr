"use client";

import { useState } from "react";
import { useQRHistory } from "../contexts/QRHistoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, ExternalLink, Clock, RefreshCw, Clipboard, ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "../hooks/use-toast";

// QR 코드 설정 적용 함수 타입 정의
interface QRHistoryProps {
  onSelectHistory?: (url: string, bgColor: string, fgColor: string) => void;
}

export default function QRHistory({ onSelectHistory }: QRHistoryProps) {
  const { history, removeFromHistory, clearHistory } = useQRHistory();
  const [expanded, setExpanded] = useState(false);

  // 히스토리 날짜 포맷팅 (예: 3일 전, 5시간 전)
  const formatDate = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { 
      addSuffix: true,
      locale: ko
    });
  };

  // URL 표시용 짧게 만들기 (너무 긴 경우)
  const shortenUrl = (url: string) => {
    return url.length > 30 ? url.substring(0, 30) + "..." : url;
  };
  
  // URL 복사 기능
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "URL이 클립보드에 복사되었습니다",
        description: url,
      });
    }).catch(err => {
      toast({
        title: "복사 실패",
        description: "클립보드 접근 권한이 없거나 오류가 발생했습니다",
        variant: "destructive",
      });
    });
  };
  
  // 히스토리 항목 선택 처리
  const handleSelectHistory = (url: string, bgColor = "#FFFFFF", fgColor = "#000000") => {
    if (onSelectHistory) {
      onSelectHistory(url, bgColor, fgColor);
      toast({
        title: "히스토리에서 불러옴",
        description: "선택한 QR 코드를 에디터에 적용했습니다",
      });
    }
  };

  // 표시할 히스토리 항목 선택
  const displayedHistory = expanded ? history : history.slice(0, 3);
  const hasMoreHistory = history.length > 3;

  if (history.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            히스토리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-4">
            아직 생성된 QR 코드가 없습니다. QR 코드를 생성하고 다운로드하거나 공유하면 여기에 표시됩니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            최근 생성한 QR 코드
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearHistory} 
            className="h-8 px-2 text-gray-500"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            모두 삭제
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayedHistory.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div 
                className="flex items-center space-x-3 cursor-pointer flex-1" 
                onClick={() => handleSelectHistory(item.url, item.bgColor, item.fgColor)}
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <QRCodeSVG
                    value={item.url}
                    size={40}
                    bgColor={item.bgColor}
                    fgColor={item.fgColor}
                    level="M"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {shortenUrl(item.url)}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex space-x-1 ml-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => copyToClipboard(item.url)}
                >
                  <Clipboard className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  asChild
                >
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-500" 
                  onClick={() => removeFromHistory(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {hasMoreHistory && (
          <Button
            variant="ghost"
            className="w-full mt-3 text-sm"
            onClick={() => setExpanded(!expanded)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {expanded ? "접기" : `더보기 (${history.length - 3})`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 