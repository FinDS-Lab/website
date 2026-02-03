# FINDS Lab 데이터 템플릿

이 폴더는 새로운 멤버/동문 데이터를 추가할 때 참조할 수 있는 템플릿을 포함합니다.

## 📁 파일 구조

```
_templates/
├── README.md                    # 이 파일
├── CURRENT_MEMBER_TEMPLATE.json # 현재 멤버 추가 템플릿
├── ALUMNI_TEMPLATE.json         # 동문 추가 템플릿
└── EXAMPLE_DATA.json            # 임시 예시 데이터 (정박사, 박석사 등)
```

## 🎓 Current Member 추가 방법

1. `/public/data/members/` 폴더에 새 JSON 파일 생성
2. 파일명 규칙: `{이니셜}{번호}-{degree}.json`
   - 예: `kim1-phd.json`, `park2-ms.json`, `lee3-undergrad.json`
3. `CURRENT_MEMBER_TEMPLATE.json` 참조하여 작성

### Degree 종류
- `phd`: 박사과정
- `ms`: 석사과정  
- `undergrad`: 학부연구생

## 👥 Alumni 추가 방법

1. `/public/data/alumni.json` 파일 수정
2. 대학원 졸업생: `graduateAlumni` 배열에 추가
3. 학부연구생 졸업: `undergradAlumni` 배열에 추가
4. `ALUMNI_TEMPLATE.json` 참조하여 작성

### Degree 종류 (Alumni)
- `phd`: 박사
- `ms`: 석사
- `ur`: 학부연구생

## ⚠️ 주의사항

- 이미지 파일은 `/public/images/members/` 폴더에 저장
- 이미지 파일명: `{이니셜}-{번호}.webp` 형식 권장
- 기본 이미지: `woman_default.png`, `man_default.png`
- Period 형식: `YYYY.MM` 또는 `YYYY.MM – YYYY.MM`

---
Last Updated: 2025-01-21
