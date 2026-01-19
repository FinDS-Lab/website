# FINDS Lab Website

가천대학교 경영대학 금융·빅데이터학부 FINDS Lab 연구실 웹사이트입니다.

🔗 **웹사이트**: https://finds-lab.github.io/website/

---

## 설치 및 실행 방법

### 요구사항

- **Node.js** 20 이상
- **pnpm** 9 이상

### 설치

```bash
# pnpm 설치 (없는 경우)
npm install -g pnpm

# 의존성 설치
pnpm install
```

### 실행

개발 환경에서 실행:
```bash
pnpm run dev
```

빌드 미리보기:
```bash
pnpm run build
pnpm run preview
```

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | React 19 + TypeScript |
| 빌드 도구 | Vite 7 |
| 스타일링 | Tailwind CSS 4 |
| 상태 관리 | Zustand |
| 라우팅 | React Router DOM v7 |
| 패키지 매니저 | pnpm |
| 호스팅 | GitHub Pages |
| CI/CD | GitHub Actions |

---

## 배포 및 관리

### 자동 배포 (권장)

`main` 브랜치에 push하면 **GitHub Actions**가 자동으로 빌드 및 배포합니다.

```
main 브랜치 push → GitHub Actions 빌드 → gh-pages 브랜치 배포 → 웹사이트 반영
```

**별도 작업 필요 없음!** 파일 수정 후 commit & push만 하면 됩니다.

### 수동 배포 (필요시)

```bash
pnpm run deploy
```

---

## 브랜치 구조

| 브랜치 | 용도 |
|--------|------|
| `main` | 소스 코드 (여기서 작업) |
| `gh-pages` | 빌드된 정적 파일 (자동 생성, **직접 수정 ❌**) |

---

## 프로젝트 구조

```
website/
├── public/
│   └── data/                    # 📊 데이터 파일 (JSON/Markdown)
│       ├── pubs.json            # 논문
│       ├── lectures.json        # 강의
│       ├── projects.json        # 프로젝트
│       ├── honors.json          # 수상 내역
│       ├── alumni.json          # 졸업생
│       ├── members/             # 현재 멤버
│       ├── news/                # 뉴스 (Markdown)
│       ├── notice/              # 공지사항 (Markdown)
│       ├── gallery/             # 갤러리
│       └── playlist/            # 플레이리스트
│
├── src/
│   ├── assets/                  # CSS, 폰트, 이미지
│   ├── components/
│   │   ├── atoms/               # 기본 UI 컴포넌트
│   │   ├── organisms/           # 레이아웃 (헤더, 푸터)
│   │   └── templates/           # 페이지 템플릿
│   ├── pages/                   # 라우트별 페이지
│   ├── store/                   # Zustand 상태 관리
│   └── types/                   # TypeScript 타입
│
├── .github/workflows/           # GitHub Actions 배포 설정
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 데이터 수정 방법

### 📁 데이터 파일 위치

모든 데이터는 `public/data/` 폴더의 JSON 파일에 저장됩니다.

| 데이터 | 파일 |
|--------|------|
| 논문 | `pubs.json` |
| 강의 | `lectures.json` |
| 프로젝트 | `projects.json` |
| 수상 내역 | `honors.json` |
| 졸업생 | `alumni.json` |
| 현재 멤버 | `members/*.json` |

### 예시: 강의 추가

`public/data/lectures.json` 파일 열고 배열에 추가:

```json
{
  "role": "Lecturer",
  "periods": ["2025 Fall"],
  "school": "Gachon University",
  "courses": [
    {
      "en": "Data Science (DS101)",
      "ko": "데이터사이언스 (DS101)"
    }
  ]
}
```

### 예시: 프로젝트 추가

`public/data/projects.json` 파일 열고 배열에 추가:

```json
{
  "titleEn": "AI-based Financial Analysis",
  "titleKo": "AI 기반 금융 분석",
  "period": "2025-01-01 – 2025-12-31",
  "fundingAgency": "National Research Foundation",
  "fundingAgencyKo": "한국연구재단",
  "amount": "₩50,000,000",
  "type": "government",
  "roles": {
    "principalInvestigator": "홍길동",
    "leadResearcher": "홍길동",
    "researchers": ["김철수"]
  }
}
```

---

## 페이지 구조

| URL | 페이지 |
|-----|--------|
| `/` | Home |
| `/about/introduction` | 연구실 소개 |
| `/about/research` | 연구 분야 |
| `/about/honors` | 수상 내역 |
| `/about/location` | 위치 |
| `/members/director` | 지도교수 |
| `/members/current` | 현재 멤버 |
| `/members/alumni` | 졸업생 |
| `/publications` | 논문 |
| `/lectures` | 강의 |
| `/projects` | 프로젝트 |
| `/archives/news` | 뉴스 |
| `/archives/notice` | 공지사항 |
| `/archives/gallery` | 갤러리 |
| `/archives/playlist` | 플레이리스트 |

---

## 문제 해결

### 흰 화면이 나올 때
1. 브라우저 캐시 삭제: `Ctrl + Shift + R`
2. 개발자 도구: `F12` → Console 탭에서 에러 확인

### 배포 후 반영 안 될 때
1. GitHub → **Actions** 탭에서 빌드 상태 확인
2. 빌드 실패 시 에러 로그 확인

### 로컬 실행 안 될 때
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 라이선스

© 2025 FINDS Lab, Gachon University. All rights reserved.
