import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 클래스 이름을 결합하는 유틸리티 함수
 * clsx와 tailwind-merge를 사용하여 클래스 이름을 결합한다
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
