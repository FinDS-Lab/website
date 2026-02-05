// Common Director Data - Single source of truth
// Update here and all director pages will reflect the changes

// Citation Statistics (Google Scholar) - Fallback values
// Real data is fetched from /data/scholar.json (auto-updated daily)
export const citationStats = [
  { label: 'Citations', count: 161, key: 'totalCitations' },
  { label: 'g-index', count: 12, key: 'gIndex' },
  { label: 'h-index', count: 8, key: 'hIndex' },
  { label: 'i5-index', count: 10, key: 'i5Index' },
  { label: 'i10-index', count: 7, key: 'i10Index' },
]

// Google Scholar configuration
export const scholarConfig = {
  id: 'p9JwRLwAAAAJ',
  url: 'https://scholar.google.com/citations?user=p9JwRLwAAAAJ&hl=en',
  dataPath: '/data/scholar.json'
}

// Professional Affiliations
export const affiliations = [
  { organization: 'Korean Institute of Industrial Engineers (KIIE)', krOrg: '대한산업공학회 (KIIE)', role: 'Lifetime Member', period: '2025-06 – Present' },
  { organization: 'Korean Securities Association (KSA)', krOrg: '한국증권학회 (KSA)', role: 'Lifetime Member', period: '2023-09 – Present' },
  { organization: 'Korean Academic Society of Business Administration (KASBA)', krOrg: '한국경영학회 (KASBA)', role: 'Lifetime Member', period: '2023-06 – Present' },
  { organization: 'Korea Intelligent Information Systems Society (KIISS)', krOrg: '한국지능정보시스템학회 (KIISS)', role: 'Lifetime Member', period: '2022-06 – Present' },
]

// Research Interests - Must match focusAreas in introduction.tsx and researchAreas in research.tsx
export const researchInterests = [
  {
    category: 'Financial Data Science',
    categoryKo: '금융 데이터 사이언스',
    items: [
      'Asset Allocation Strategies',
      'Financial Time-Series Modeling and Forecasting',
      'Personalized Finance and Behavioral Decision Modeling'
    ],
    itemsKo: [
      '포트폴리오 최적화, 자산 배분, 알고리즘 트레이딩',
      '변동성 예측, 국면 전환 모형, 수익률 예측 등 금융 시계열 연구',
      '개인화 금융, 투자자 행동 분석, 행동재무학 기반 의사결정'
    ]
  },
  {
    category: 'Business Analytics',
    categoryKo: '비즈니스 애널리틱스',
    items: [
      'Cross-Industry Data Analytics and Integration',
      'Data Visualization and Interpretive Transparency',
      'Statistical Methods for Actionable Business Insights'
    ],
    itemsKo: [
      '다양한 산업 간 융합을 위한 데이터 분석',
      '복잡한 데이터를 직관적으로 표현하는 시각화 기법',
      '통계적 방법론을 활용한 비즈니스 인사이트 도출'
    ]
  },
  {
    category: 'Data-Informed Decision Making',
    categoryKo: '데이터 기반 의사결정',
    items: [
      'Trustworthy, Effective Decision Systems Design',
      'Risk-Aware Decision Support Frameworks',
      'Multi-Perspective Insight Extraction for Decision Making'
    ],
    itemsKo: [
      '신뢰할 수 있는 의사결정 시스템 설계와 최적화',
      '경영 환경과 산업 현장의 위험을 고려한 의사결정 지원 도구',
      '데이터 기반 의사결정을 위한 다각적 인사이트 도출과 종합'
    ]
  },
]

// Director Info
export const directorInfo = {
  name: 'Insu Choi',
  nameKo: '최인수',
  title: 'Assistant Professor',
  titleKo: '조교수',
  email: 'insu.choi@gachon.ac.kr',
  organization: 'Gachon University',
  organizationKo: '가천대학교',
  department: 'Big Data Business Management Major, Department of Finance & Big Data, College of Business',
  departmentKo: '빅데이터경영전공',
}

// Helper function to sort lecture periods (most recent first, but -1 before -2 within same semester)
export const sortLecturePeriods = (periods: string[]): string[] => {
  return [...periods].sort((a, b) => {
    const [yearA, semA] = a.split(' ')
    const [yearB, semB] = b.split(' ')
    if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA)
    // Extract base semester (Fall, Spring) and number suffix (-1, -2)
    const baseA = semA.replace(/-\d+$/, '')
    const baseB = semB.replace(/-\d+$/, '')
    if (baseA !== baseB) return baseB.localeCompare(baseA) // Fall > Spring in same year
    // Same base semester, sort by number suffix ascending (1 before 2)
    const numA = parseInt(semA.match(/-(\d+)$/)?.[1] || '0')
    const numB = parseInt(semB.match(/-(\d+)$/)?.[1] || '0')
    return numA - numB
  })
}
