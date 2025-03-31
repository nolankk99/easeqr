# 프로젝트 설정 가이드

이 가이드는 프로젝트를 시작하기 위한 단계별 설정 방법을 제공합니다.

## 1. 기본 설정

1. **package.json 업데이트**
   - 프로젝트 이름, 설명, 버전 등을 변경합니다.

2. **환경 변수 설정**
   - `.env.local` 파일을 생성하고 필요한 환경 변수를 설정합니다.

## 2. SEO 설정

1. **메타데이터 수정**
   - `app/layout.tsx` 파일에서 메타데이터를 프로젝트에 맞게 수정합니다.
   - 타이틀, 설명, 키워드, OG 이미지 등을 업데이트합니다.

2. **검색엔진 인증 파일 설정**
   - Google Search Console 인증
     - Google Search Console에서 사이트 등록 후 인증 HTML 파일명 확인
     - `public/google-verification.html` 파일을 해당 파일명으로 변경하고 내용 업데이트
     - `app/layout.tsx`의 verification 섹션 업데이트

   - Naver Search Advisor 인증
     - Naver Search Advisor에서 사이트 등록 후 인증 HTML 파일명 확인
     - `public/naver-verification.html` 파일을 해당 파일명으로 변경하고 내용 업데이트
     - `app/layout.tsx`의 verification 섹션 업데이트

   - Yandex Webmaster 인증
     - Yandex Webmaster에서 사이트 등록 후 인증 코드 확인
     - `public/yandex-verification.html` 파일 내용 업데이트
     - `app/layout.tsx`의 verification 섹션 업데이트

3. **robots.txt 수정**
   - `public/robots.txt` 파일에서 도메인 주소를 실제 사이트 URL로 변경합니다.

4. **sitemap.xml 수정**
   - `public/sitemap.xml` 파일에서 도메인 주소와 날짜를 업데이트합니다.
   - 추가 페이지가 있을 경우 새 `<url>` 항목을 추가합니다.

## 3. 다국어 설정

1. **번역 파일 업데이트**
   - `public/locales/` 디렉토리의 각 언어별 JSON 파일을 수정합니다.
   - 프로젝트에 필요한 텍스트에 대한 번역을 추가합니다.

2. **지원 언어 조정 (선택사항)**
   - 특정 언어만 지원하려면:
     - `lib/LanguageContext.tsx` 파일에서 `Language` 타입 수정
     - `components/LanguageSwitcher.tsx` 파일에서 `languages` 배열 수정
     - 불필요한 번역 파일 제거

## 4. UI 컴포넌트 설정

ShadCN UI 컴포넌트를 추가하려면 다음 명령어를 사용합니다:

```bash
# ShadCN UI 컴포넌트 추가 예시
npx shadcn@latest add button
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
```

## 5. 배포 설정

1. **Vercel 배포**
   ```bash
   # Vercel CLI 설치
   npm install -g vercel

   # 로그인
   vercel login

   # 배포
   vercel
   ```

2. **커스텀 도메인 설정**
   - Vercel 대시보드에서 프로젝트 선택
   - Settings > Domains에서 커스텀 도메인 추가

## 6. 분석 도구 설정 (선택사항)

1. **Google Analytics 설정**
   - Google Analytics 계정 생성 및 측정 ID 발급
   - `app/layout.tsx`에 Google Analytics 스크립트 추가

2. **Google Search Console 연동**
   - Google Search Console에 사이트 등록
   - Vercel 배포 후 소유권 확인 