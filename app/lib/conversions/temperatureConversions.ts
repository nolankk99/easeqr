// 온도 단위 변환 관련 함수

type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin';

// 단위 표시 이름
export const temperatureUnitLabels: Record<TemperatureUnit, string> = {
  celsius: '섭씨 (°C)',
  fahrenheit: '화씨 (°F)',
  kelvin: '켈빈 (K)'
};

export const temperatureUnits: TemperatureUnit[] = ['celsius', 'fahrenheit', 'kelvin'];

/**
 * 온도 단위 변환 함수
 * @param value 변환할 값
 * @param fromUnit 원본 단위
 * @param toUnit 변환 대상 단위
 * @returns 변환된 값
 */
export function convertTemperature(
  value: number,
  fromUnit: TemperatureUnit,
  toUnit: TemperatureUnit
): number {
  // 모든 온도를 먼저 섭씨로 변환
  let celsius = value;
  
  if (fromUnit === 'fahrenheit') {
    celsius = (value - 32) * (5 / 9);
  } else if (fromUnit === 'kelvin') {
    celsius = value - 273.15;
  }
  
  // 섭씨에서 목표 단위로 변환
  if (toUnit === 'celsius') {
    return celsius;
  } else if (toUnit === 'fahrenheit') {
    return celsius * (9 / 5) + 32;
  } else { // kelvin
    return celsius + 273.15;
  }
} 