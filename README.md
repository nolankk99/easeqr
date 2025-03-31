# Next.js + shadcn/ui 스타터 템플릿

이 템플릿은 새로운 웹 프로젝트를 빠르게 시작할 수 있도록 구성된 기본 설정입니다.

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- ESLint
- Prettier

## 시작하기

1. 이 템플릿을 사용하여 새 프로젝트 생성:
```bash
# 템플릿 복사
cp -r next-shadcn-template my-new-project
cd my-new-project

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

2. 프로젝트 설정 수정:
   - `package.json`의 프로젝트 이름 변경
   - `.env` 파일 설정 (필요한 경우)
   - `app/layout.tsx`의 메타데이터 수정

## 폴더 구조

```
├── app/                  # Next.js 앱 라우터
│   ├── layout.tsx       # 루트 레이아웃
│   └── page.tsx         # 홈페이지
├── components/          # 재사용 가능한 컴포넌트
├── lib/                 # 유틸리티 함수
├── public/             # 정적 파일
└── styles/            # 전역 스타일
```

## shadcn/ui 컴포넌트 추가

새로운 shadcn/ui 컴포넌트를 추가하려면:

```bash
npx shadcn-ui@latest add [component-name]
```

## 배포

1. Vercel 배포:
```bash
npm i -g vercel
vercel deploy --prod
```

2. Google 애드센스 설정:
   - `app/layout.tsx`에 애드센스 스크립트 추가
   - `public/ads.txt` 파일 생성

## 커스텀 지침 추가

프로젝트에 대한 특별한 지침이나 아이디어가 있다면 `.cursorrules.md` 파일을 생성하여 추가하세요:

```markdown
<custom_instructions>
여기에 프로젝트 특별 지침 추가
</custom_instructions>
```

## 라이선스

MIT 