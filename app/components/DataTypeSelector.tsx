"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Wifi, Mail, Phone, Globe, FileText, AtSign } from "lucide-react";

interface DataTypeSelectorProps {
  onDataChange: (data: string) => void;
  initialData?: string; // 부모 컴포넌트에서 초기 데이터 제공
}

export default function DataTypeSelector({ onDataChange, initialData = "" }: DataTypeSelectorProps) {
  // URL 데이터
  const [url, setUrl] = useState(initialData);
  
  // 연락처 데이터
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  
  // WiFi 데이터
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryptionType, setEncryptionType] = useState("WPA");
  const [isHidden, setIsHidden] = useState(false);
  
  // 이메일 데이터
  const [emailAddress, setEmailAddress] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  
  // SMS 데이터
  const [smsNumber, setSmsNumber] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  
  // 일반 텍스트
  const [text, setText] = useState("");

  // 현재 선택된 탭 저장
  const [activeTab, setActiveTab] = useState("url");

  // 초기 데이터가 변경되면 URL 필드 업데이트
  useEffect(() => {
    if (initialData) {
      setUrl(initialData);
    }
  }, [initialData]);
  
  // URL 변경 핸들러
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    // URL 형식 검사
    if (isValidUrl(newUrl)) {
      const formattedUrl = getFormattedUrl(newUrl);
      onDataChange(formattedUrl);
    } else if (newUrl) {
      onDataChange(newUrl);
    } else {
      onDataChange("");
    }
  };
  
  // 연락처 데이터 변경 시 vCard 포맷 생성
  const handleContactChange = () => {
    if (!name && !phoneNumber && !email) {
      onDataChange("");
      return;
    }
    
    // vCard 형식으로 포맷팅
    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      name ? `FN:${name}` : "",
      phoneNumber ? `TEL:${phoneNumber}` : "",
      email ? `EMAIL:${email}` : "",
      "END:VCARD"
    ].filter(line => line).join("\n");
    
    onDataChange(vCard);
  };
  
  // WiFi 정보 변경 시 WiFi 포맷 생성
  const handleWifiChange = () => {
    if (!ssid) {
      onDataChange("");
      return;
    }
    
    // WiFi 접속 정보 형식으로 포맷팅
    const wifi = `WIFI:S:${ssid};T:${encryptionType};P:${password};H:${isHidden ? 'true' : 'false'};;`;
    onDataChange(wifi);
  };
  
  // 이메일 정보 변경 시 mailto 포맷 생성
  const handleEmailChange = () => {
    if (!emailAddress) {
      onDataChange("");
      return;
    }
    
    // mailto: 스키마 사용
    let mailtoLink = `mailto:${emailAddress}`;
    const params = [];
    
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    
    if (params.length > 0) {
      mailtoLink += `?${params.join('&')}`;
    }
    
    onDataChange(mailtoLink);
  };
  
  // SMS 정보 변경 시 sms 포맷 생성
  const handleSmsChange = () => {
    if (!smsNumber) {
      onDataChange("");
      return;
    }
    
    // sms: 스키마 사용
    let smsLink = `sms:${smsNumber}`;
    
    if (smsMessage) {
      smsLink += `?body=${encodeURIComponent(smsMessage)}`;
    }
    
    onDataChange(smsLink);
  };
  
  // 일반 텍스트 변경 핸들러
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    onDataChange(newText);
  };
  
  // URL 유효성 검증
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
  
  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // 탭 변경 시 해당 탭의 현재 데이터로 업데이트
    switch (value) {
      case "url":
        if (url) {
          onDataChange(getFormattedUrl(url));
        } else {
          onDataChange("");
        }
        break;
      case "contact":
        handleContactChange();
        break;
      case "wifi":
        handleWifiChange();
        break;
      case "email":
        handleEmailChange();
        break;
      case "sms":
        handleSmsChange();
        break;
      case "text":
        onDataChange(text);
        break;
      default:
        onDataChange("");
    }
  };

  return (
    <div className="space-y-2">
      <Tabs defaultValue="url" onValueChange={handleTabChange} value={activeTab}>
        <TabsList className="grid grid-cols-6 mb-4 bg-gray-200 p-1 rounded-xl h-16">
          <TabsTrigger value="url" className="data-[state=active]:bg-white data-[state=active]:shadow rounded-lg flex flex-col items-center justify-center gap-1">
            <Globe className="h-4 w-4" />
            <span className="text-xs">URL</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-white data-[state=active]:shadow rounded-lg flex flex-col items-center justify-center gap-1">
            <Phone className="h-4 w-4" />
            <span className="text-xs">연락처</span>
          </TabsTrigger>
          <TabsTrigger value="wifi" className="data-[state=active]:bg-white data-[state=active]:shadow rounded-lg flex flex-col items-center justify-center gap-1">
            <Wifi className="h-4 w-4" />
            <span className="text-xs">WiFi</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-white data-[state=active]:shadow rounded-lg flex flex-col items-center justify-center gap-1">
            <Mail className="h-4 w-4" />
            <span className="text-xs">이메일</span>
          </TabsTrigger>
          <TabsTrigger value="sms" className="data-[state=active]:bg-white data-[state=active]:shadow rounded-lg flex flex-col items-center justify-center gap-1">
            <AtSign className="h-4 w-4" />
            <span className="text-xs">SMS</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="data-[state=active]:bg-white data-[state=active]:shadow rounded-lg flex flex-col items-center justify-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="text-xs">텍스트</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <TabsContent value="url" className="space-y-2 mt-0">
            <Label htmlFor="url" className="font-medium">웹사이트 URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={handleUrlChange}
                className="h-11"
              />
              {url && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    setUrl("");
                    onDataChange("");
                  }}
                >
                  X
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              QR 코드로 스캔하면 이 URL로 바로 이동합니다.
            </p>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-3 mt-0">
            <div>
              <Label htmlFor="name" className="font-medium">이름</Label>
              <Input
                id="name"
                placeholder="홍길동"
                value={name}
                onChange={(e) => { 
                  setName(e.target.value);
                  setTimeout(handleContactChange, 0);
                }}
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="font-medium">전화번호</Label>
              <Input
                id="phone"
                placeholder="+82 10-1234-5678"
                value={phoneNumber}
                onChange={(e) => { 
                  setPhoneNumber(e.target.value);
                  setTimeout(handleContactChange, 0);
                }}
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="email" className="font-medium">이메일</Label>
              <Input
                id="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => { 
                  setEmail(e.target.value);
                  setTimeout(handleContactChange, 0);
                }}
                className="h-11"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              QR 코드로 스캔하면 연락처가 자동으로 저장됩니다.
            </p>
          </TabsContent>
          
          <TabsContent value="wifi" className="space-y-3 mt-0">
            <div>
              <Label htmlFor="ssid" className="font-medium">네트워크 이름 (SSID)</Label>
              <Input
                id="ssid"
                placeholder="WiFi 이름"
                value={ssid}
                onChange={(e) => { 
                  setSsid(e.target.value);
                  setTimeout(handleWifiChange, 0);
                }}
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="password" className="font-medium">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="WiFi 비밀번호"
                value={password}
                onChange={(e) => { 
                  setPassword(e.target.value);
                  setTimeout(handleWifiChange, 0);
                }}
                className="h-11"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="encryption" className="font-medium">암호화 유형</Label>
                <Select 
                  value={encryptionType} 
                  onValueChange={(value) => {
                    setEncryptionType(value);
                    setTimeout(handleWifiChange, 0);
                  }}
                >
                  <SelectTrigger id="encryption">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">암호화 없음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHidden}
                    onChange={(e) => {
                      setIsHidden(e.target.checked);
                      setTimeout(handleWifiChange, 0);
                    }}
                    className="rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span>숨겨진 네트워크</span>
                </label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              QR 코드로 스캔하면 WiFi에 자동으로 연결됩니다.
            </p>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-3 mt-0">
            <div>
              <Label htmlFor="email-address" className="font-medium">이메일 주소</Label>
              <Input
                id="email-address"
                placeholder="example@example.com"
                value={emailAddress}
                onChange={(e) => { 
                  setEmailAddress(e.target.value);
                  setTimeout(handleEmailChange, 0);
                }}
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="subject" className="font-medium">제목 (선택사항)</Label>
              <Input
                id="subject"
                placeholder="이메일 제목"
                value={subject}
                onChange={(e) => { 
                  setSubject(e.target.value);
                  setTimeout(handleEmailChange, 0);
                }}
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="body" className="font-medium">내용 (선택사항)</Label>
              <Input
                id="body"
                placeholder="이메일 내용"
                value={body}
                onChange={(e) => { 
                  setBody(e.target.value);
                  setTimeout(handleEmailChange, 0);
                }}
                className="h-11"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              QR 코드로 스캔하면 이메일 작성 화면이 열립니다.
            </p>
          </TabsContent>
          
          <TabsContent value="sms" className="space-y-3 mt-0">
            <div>
              <Label htmlFor="sms-number" className="font-medium">전화번호</Label>
              <Input
                id="sms-number"
                placeholder="+82 10-1234-5678"
                value={smsNumber}
                onChange={(e) => { 
                  setSmsNumber(e.target.value);
                  setTimeout(handleSmsChange, 0);
                }}
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="sms-message" className="font-medium">메시지 (선택사항)</Label>
              <Input
                id="sms-message"
                placeholder="SMS 메시지 내용"
                value={smsMessage}
                onChange={(e) => { 
                  setSmsMessage(e.target.value);
                  setTimeout(handleSmsChange, 0);
                }}
                className="h-11"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              QR 코드로 스캔하면 SMS 작성 화면이 열립니다.
            </p>
          </TabsContent>
          
          <TabsContent value="text" className="space-y-2 mt-0">
            <Label htmlFor="text" className="font-medium">일반 텍스트</Label>
            <Input
              id="text"
              placeholder="자유 텍스트 입력"
              value={text}
              onChange={handleTextChange}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              QR 코드로 스캔하면 입력한 텍스트가 표시됩니다.
            </p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
} 