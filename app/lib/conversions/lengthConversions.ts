// 길이 단위 변환 관련 함수

// 기본 단위는 미터(meter)

type LengthUnit = 
  | 'mm' | 'cm' | 'm' | 'km' 
  | 'inch' | 'foot' | 'yard' | 'mile'
  | 'nauticalMile';

// 각 단위의 미터 환산 값
const unitToMeter: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
  nauticalMile: 1852
};

// 단위 표시 이름
export const lengthUnitLabels: Record<LengthUnit, string> = {
  mm: '밀리미터 (mm)',
  cm: '센티미터 (cm)',
  m: '미터 (m)',
  km: '킬로미터 (km)',
  inch: '인치 (in)',
  foot: '피트 (ft)',
  yard: '야드 (yd)',
  mile: '마일 (mi)',
  nauticalMile: '해리 (nmi)'
};

export const lengthUnits: LengthUnit[] = [
  'mm', 'cm', 'm', 'km', 
  'inch', 'foot', 'yard', 'mile', 
  'nauticalMile'
];

/**
 * 길이 단위 변환 함수
 * @param value 변환할 값
 * @param fromUnit 원본 단위
 * @param toUnit 변환 대상 단위
 * @returns 변환된 값
 */
export function convertLength(
  value: number,
  fromUnit: LengthUnit,
  toUnit: LengthUnit
): number {
  // 입력값을 미터로 변환
  const valueInMeters = value * unitToMeter[fromUnit];
  
  // 미터에서 목표 단위로 변환
  const result = valueInMeters / unitToMeter[toUnit];
  
  return result;
} 