// 모든 변환 모듈 통합 인덱스

export * from './lengthConversions';
export * from './weightConversions';
export * from './temperatureConversions';
export * from './areaConversions';

// 변환 카테고리 타입
export type ConversionCategory = 'length' | 'weight' | 'temperature' | 'area';

// 카테고리 라벨
export const categoryLabels: Record<ConversionCategory, string> = {
  length: '길이',
  weight: '무게',
  temperature: '온도',
  area: '면적'
};

// 모든 카테고리 배열
export const allCategories: ConversionCategory[] = ['length', 'weight', 'temperature', 'area'];

// 숫자 포맷팅 함수
export function formatNumber(value: number): string {
  // 큰 숫자나 작은 숫자는 지수 표기법으로 변환
  if (value === 0) {
    return '0';
  } else if (Math.abs(value) < 0.000001 || Math.abs(value) >= 1000000) {
    return value.toExponential(6);
  }
  
  // 소수점 자리수 조정 (최대 10자리까지)
  const fixed = value.toFixed(10);
  // 후행 0 제거
  return fixed.replace(/\.?0+$/, '');
} 