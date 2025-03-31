"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from 'js-cookie';

interface QRHistoryItem {
  id: string;
  url: string;
  createdAt: number;
  bgColor?: string;
  fgColor?: string;
}

interface QRHistoryContextType {
  history: QRHistoryItem[];
  addToHistory: (url: string, bgColor?: string, fgColor?: string) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const QRHistoryContext = createContext<QRHistoryContextType | undefined>(undefined);

// 쿠키 관련 상수
const COOKIE_NAME = 'qr_history';
const COOKIE_EXPIRY = 30; // 30일

export function QRHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<QRHistoryItem[]>([]);

  // 컴포넌트 마운트 시 로컬 스토리지와 쿠키에서 히스토리 로드
  useEffect(() => {
    // 먼저 쿠키에서 확인
    const cookieHistory = Cookies.get(COOKIE_NAME);
    if (cookieHistory) {
      try {
        setHistory(JSON.parse(cookieHistory));
        return; // 쿠키에서 데이터를 가져왔으면 로컬 스토리지 체크는 건너뜀
      } catch (error) {
        console.error("쿠키 히스토리 파싱 오류:", error);
        Cookies.remove(COOKIE_NAME);
      }
    }

    // 쿠키에 없으면 로컬 스토리지 확인
    const savedHistory = localStorage.getItem("qrHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
        
        // 로컬 스토리지에서 가져온 데이터를 쿠키에도 저장
        Cookies.set(COOKIE_NAME, savedHistory, { expires: COOKIE_EXPIRY });
      } catch (error) {
        console.error("로컬 스토리지 히스토리 파싱 오류:", error);
        localStorage.removeItem("qrHistory");
      }
    }
  }, []);

  // 히스토리 변경 시 로컬 스토리지와 쿠키에 저장
  useEffect(() => {
    const historyString = JSON.stringify(history);
    localStorage.setItem("qrHistory", historyString);
    Cookies.set(COOKIE_NAME, historyString, { expires: COOKIE_EXPIRY });
  }, [history]);

  // 히스토리에 추가
  const addToHistory = (url: string, bgColor = "#FFFFFF", fgColor = "#000000") => {
    if (!url) return;
    
    // 중복 URL 체크를 위한 준비
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    
    // 이미 있는 URL인지 정확히 확인
    const existingIndex = history.findIndex(item => 
      item.url.toLowerCase() === normalizedUrl.toLowerCase()
    );

    // 새 히스토리 아이템 생성
    const newItem: QRHistoryItem = {
      id: `qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: normalizedUrl,
      createdAt: Date.now(),
      bgColor,
      fgColor
    };

    if (existingIndex >= 0) {
      // 이미 있는 URL이면 최신 항목으로 업데이트
      const updatedHistory = [...history];
      updatedHistory.splice(existingIndex, 1); // 기존 항목 제거
      setHistory([newItem, ...updatedHistory]); // 새 항목을 맨 앞에 추가
    } else {
      // 새 URL이면 배열 앞에 추가 (최신순)
      setHistory(prev => [newItem, ...prev].slice(0, 10)); // 최대 10개 유지
    }
  };

  // 히스토리에서 제거
  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // 히스토리 전체 삭제
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("qrHistory");
    Cookies.remove(COOKIE_NAME);
  };

  return (
    <QRHistoryContext.Provider value={{ history, addToHistory, removeFromHistory, clearHistory }}>
      {children}
    </QRHistoryContext.Provider>
  );
}

// 커스텀 훅
export function useQRHistory() {
  const context = useContext(QRHistoryContext);
  if (context === undefined) {
    throw new Error("useQRHistory must be used within a QRHistoryProvider");
  }
  return context;
} 