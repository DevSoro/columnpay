# ColumnPay - 모던 결제 솔루션

ColumnPay는 기업을 위한 현대적이고 직관적인 결제 관리 솔루션입니다. 빠르고 안전한 결제 처리와 강력한 분석 도구를 제공하여 비즈니스의 성장을 돕습니다.

## 주요 기능

- 📊 **실시간 대시보드**: 결제 상태와 수익을 한눈에 파악
- 💳 **다양한 결제 수단**: 신용카드, 이체, 가상화폐 등 지원
- 📱 **반응형 디자인**: 모든 기기에서 완벽하게 작동
- 🔒 **강력한 보안**: 엔드투엔드 암호화와 보안 표준 준수
- ⚡ **빠른 처리 속도**: 최적화된 결제 처리 과정

## 설치 방법

### 필수 조건

- Node.js 20.0.0 이상
- npm 10.0.0 이상 또는 yarn 1.22.0 이상

### 설치 단계

1. 저장소 복제:
   ```bash
   git clone https://github.com/your-username/columnpay.git
   cd columnpay
   ```

2. 의존성 설치:
   ```bash
   npm install
   # 또는
   yarn install
   ```

3. 환경 변수 설정:
   ```bash
   cp .env.example .env.local
   # .env.local 파일을 편집하여 필요한 API 키와 환경 변수를 설정하세요
   ```

4. 개발 서버 실행:
   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

5. 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인하세요.

## 사용 방법

### 로그인 및 대시보드 접근

```jsx
import { useAuth } from '@/hooks/useAuth';

function Login() {
  const { login } = useAuth();
  
  const handleLogin = async (credentials) => {
    await login(credentials);
    // 로그인 성공 후 대시보드로 리다이렉트
  };
  
  return (
    // 로그인 폼 렌더링
  );
}
```

### 결제 처리 예제

```jsx
import { processPayment } from '@/lib/payment';

async function handlePayment(paymentData) {
  try {
    const result = await processPayment(paymentData);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## 프로젝트 스크린샷

![대시보드](https://example.com/dashboard.png)
![결제 처리](https://example.com/payment.png)
![분석 화면](https://example.com/analytics.png)

## 폴더 구조

```
columnpay/
├── .next/               # Next.js 빌드 출력
├── node_modules/        # 프로젝트 의존성
├── public/              # 정적 자산 (이미지, 아이콘 등)
├── src/
│   ├── app/             # Next.js 앱 라우터
│   │   ├── page.tsx     # 메인 랜딩 페이지
│   │   ├── layout.tsx   # 앱 레이아웃
│   │   └── globals.css  # 전역 스타일
│   ├── components/      # 재사용 가능한 컴포넌트
│   │   └── ui/          # UI 컴포넌트 (버튼, 카드 등)
│   ├── hooks/           # 커스텀 React 훅
│   └── lib/             # 유틸리티 함수 및 서비스
├── .env.example         # 환경 변수 예제
├── .gitignore           # Git 무시 파일 목록
├── package.json         # 프로젝트 메타데이터 및 의존성
├── tailwind.config.ts   # Tailwind CSS 구성
└── tsconfig.json        # TypeScript 구성
```

## 기여 방법

1. 이 저장소를 포크합니다.
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`).
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`).
4. 브랜치를 푸시합니다 (`git push origin feature/amazing-feature`).
5. Pull Request를 생성합니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 참고 링크

- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Framer Motion 문서](https://www.framer.com/motion/)
- [Radix UI 문서](https://www.radix-ui.com/docs/primitives/overview/introduction)
