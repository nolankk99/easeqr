// 면적 단위 변환 관련 함수

// 기본 단위는 제곱미터(m²)

type AreaUnit = 
  | 'sqMm' | 'sqCm' | 'sqM' | 'are' | 'hectare' | 'sqKm' 
  | 'sqInch' | 'sqFoot' | 'sqYard' | 'acre' | 'sqMile';

// 각 단위의 제곱미터 환산 값
const unitToSqMeter: Record<AreaUnit, number> = {
  sqMm: 0.000001,
  sqCm: 0.0001,
  sqM: 1,
  are: 100,
  hectare: 10000,
  sqKm: 1000000,
  sqInch: 0.00064516,
  sqFoot: 0.09290304,
  sqYard: 0.83612736,
  acre: 4046.8564224,
  sqMile: 2589988.110336
};

// 단위 표시 이름
export const areaUnitLabels: Record<AreaUnit, string> = {
  sqMm: '제곱밀리미터 (mm²)',
  sqCm: '제곱센티미터 (cm²)',
  sqM: '제곱미터 (m²)',
  are: '아르 (a)',
  hectare: '헥타르 (ha)',
  sqKm: '제곱킬로미터 (km²)',
  sqInch: '제곱인치 (in²)',
  sqFoot: '제곱피트 (ft²)',
  sqYard: '제곱야드 (yd²)',
  acre: '에이커 (ac)',
  sqMile: '제곱마일 (mi²)'
};

export const areaUnits: AreaUnit[] = [
  'sqMm', 'sqCm', 'sqM', 'are', 'hectare', 'sqKm',
  'sqInch', 'sqFoot', 'sqYard', 'acre', 'sqMile'
];

/**
 * 면적 단위 변환 함수
 * @param value 변환할 값
 * @param fromUnit 원본 단위
 * @param toUnit 변환 대상 단위
 * @returns 변환된 값
 */
export function convertArea(
  value: number,
  fromUnit: AreaUnit,
  toUnit: AreaUnit
): number {
  // 입력값을 제곱미터로 변환
  const valueInSqMeters = value * unitToSqMeter[fromUnit];
  
  // 제곱미터에서 목표 단위로 변환
  const result = valueInSqMeters / unitToSqMeter[toUnit];
  
  return result;
} 