// 무게 단위 변환 관련 함수

// 기본 단위는 그램(g)

type WeightUnit = 
  | 'mg' | 'g' | 'kg' | 't' 
  | 'oz' | 'lb' | 'st' | 'ton';

// 각 단위의 그램 환산 값
const unitToGram: Record<WeightUnit, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  t: 1000000,
  oz: 28.349523125,
  lb: 453.59237,
  st: 6350.29318,
  ton: 907184.74
};

// 단위 표시 이름
export const weightUnitLabels: Record<WeightUnit, string> = {
  mg: '밀리그램 (mg)',
  g: '그램 (g)',
  kg: '킬로그램 (kg)',
  t: '톤 (t)',
  oz: '온스 (oz)',
  lb: '파운드 (lb)',
  st: '스톤 (st)',
  ton: '미국 톤 (ton)'
};

export const weightUnits: WeightUnit[] = [
  'mg', 'g', 'kg', 't', 
  'oz', 'lb', 'st', 'ton'
];

/**
 * 무게 단위 변환 함수
 * @param value 변환할 값
 * @param fromUnit 원본 단위
 * @param toUnit 변환 대상 단위
 * @returns 변환된 값
 */
export function convertWeight(
  value: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number {
  // 입력값을 그램으로 변환
  const valueInGrams = value * unitToGram[fromUnit];
  
  // 그램에서 목표 단위로 변환
  const result = valueInGrams / unitToGram[toUnit];
  
  return result;
} 