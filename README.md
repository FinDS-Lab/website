## 설치 및 실행 방법

### 요구사항

- **Node.js** 24

### 설치

1. pnpm과 의존성 모듈을 설치합니다.

```bash
nvm use 24
npm i -g pnpm
pnpm install
```

### 실행

개발 환경에서 실행:

```bash
pnpm run dev
```

프로덕션 환경에서 실행:

```bash
pnpm run start
```

### 기술스택

- 프레임워크: Next.js
- 호스팅: AWS

### 배포 및 관리

#### 배포

1. AWS CLI 설치

```bash
brew install awscli
aws configure --profile [유저명 ex: s3]
ap-northeast-2
json
```

2. 배포

```bash
pnpm run deploy
```
