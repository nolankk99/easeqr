# 프로젝트 개발 가이드

이 가이드는 프로젝트 개발 시 따라야 할 핵심 지침과 모범 사례를 제공합니다.

## 개발 환경 설정

1. **패키지 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

## 폴더 구조 및 규칙

```
new-project-template/
├── public/             # 정적 파일 (이미지, 아이콘, SEO 파일)
├── src/
│   ├── app/            # 앱 라우터 페이지
│   ├── components/     # 재사용 가능한 컴포넌트
│   │   └── ui/         # ShadCN UI 컴포넌트
│   └── lib/            # 유틸리티 함수 및 컨텍스트
│       ├── utils.ts    # 공통 유틸리티 함수
│       ├── LanguageContext.tsx  # 다국어 지원 컨텍스트
│       └── MetadataContext.tsx  # SEO 메타데이터 컨텍스트
└── ...
```

## 코드 작성 규칙

### 1. 기본 원칙
- **타입스크립트 활용**: 모든 파일에 타입 정의 사용
- **코드 포맷팅**: ESLint와 Prettier 규칙 준수
- **함수형 컴포넌트**: React 함수형 컴포넌트와 훅 사용
- **변수명 규칙**: camelCase 사용 (컴포넌트는 PascalCase)

### 2. 컴포넌트 개발
- **단일 책임 원칙**: 각 컴포넌트는 한 가지 역할만 수행
- **재사용성**: 공통 UI 요소는 재사용 가능한 컴포넌트로 분리
- **Props 타입 정의**: 모든 props에 인터페이스/타입 정의
- **상태 관리**: 지역 상태는 useState, 전역 상태는 컨텍스트 API 사용

```tsx
// 컴포넌트 예시
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button 
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
```

### 3. ShadCN UI 사용
- 필요한 컴포넌트만 설치하여 사용
- 설치 명령어:
  ```bash
  npx shadcn@latest add [component-name]
  ```
- 기존 컴포넌트를 최대한 활용하고 불필요한 중복 방지

### 4. 아이콘 사용
- Lucide React 아이콘만 사용
- 사용 예시:
  ```tsx
  import { Search, Menu } from "lucide-react";
  
  const Component = () => {
    return (
      <div>
        <Search className="w-5 h-5" />
        <Menu className="w-5 h-5" />
      </div>
    );
  };
  ```

## 다국어 지원 개발 가이드

1. **번역 파일 구성**
   - `/public/locales/` 디렉토리에 언어별 JSON 파일 생성
   - 키-값 쌍으로 번역 데이터 관리
   - 중첩 객체 형태로 구조화 권장

2. **번역 사용 방법**
   ```tsx
   import { useLanguage } from '@/lib/LanguageContext';
   
   const Component = () => {
     const { t, language, setLanguage } = useLanguage();
     
     return (
       <div>
         <h1>{t('common.title')}</h1>
         <p>{t('common.description')}</p>
         <button onClick={() => setLanguage('en')}>
           {t('common.switchToEnglish')}
         </button>
       </div>
     );
   };
   ```

3. **언어 선택 UI 구현**
   - 상단 내비게이션 또는 푸터에 언어 선택기 배치
   - 현재 언어 표시 및 다른 언어로 전환 기능 제공
   - 선택한 언어는 localStorage에 저장하여 재방문 시 유지

## SEO 최적화 가이드

1. **메타데이터 관리**
   - 각 페이지별 메타데이터 설정
   - 타이틀, 설명, 키워드, OG 태그 최적화
   - 다국어 메타데이터 지원

2. **메타데이터 사용 방법**
   ```tsx
   import { useMetadata } from '@/lib/MetadataContext';
   
   const Page = () => {
     const { updateMetadata } = useMetadata();
     
     // 컴포넌트 마운트 시 메타데이트 업데이트
     useEffect(() => {
       updateMetadata({
         title: '페이지 제목',
         description: '페이지 설명'
       });
     }, [updateMetadata]);
     
     return <div>페이지 내용</div>;
   };
   ```

3. **SEO 최적화 요소**
   - 시맨틱 HTML 태그 사용 (header, nav, main, section, footer 등)
   - 이미지에 alt 텍스트 추가
   - 내부 링크 최적화
   - 페이지 로딩 속도 최적화

## 배포 전 검증

배포 전에는 `.cursorrules.md` 파일의 체크리스트를 참고하여 모든 요소가 준비되었는지 확인하세요.

주요 검증 항목:
- SEO 메타데이터 완성
- 검색엔진 인증 파일 설정
- 성능 최적화
- 다국어 지원 검증
- 모든 페이지 기능 테스트

## 문제 해결 및 지원

개발 중 문제가 발생하면 다음을 참조하세요:
- Next.js 공식 문서: https://nextjs.org/docs
- ShadCN UI 문서: https://ui.shadcn.com
- Tailwind CSS 문서: https://tailwindcss.com/docs 