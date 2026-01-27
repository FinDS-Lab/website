// Common Director Data - Single source of truth
// Update here and all director pages will reflect the changes

// Citation Statistics (Google Scholar)
export const citationStats = [
  { label: 'Citations', count: 160 },
  { label: 'g-index', count: 12 },
  { label: 'h-index', count: 8 },
  { label: 'i10-index', count: 7 },
]

// Professional Affiliations
export const affiliations = [
  { organization: 'Korean Institute of Industrial Engineers (KIIE)', krOrg: '대한산업공학회 (KIIE) 종신회원', role: 'Lifetime Member', period: '2025-06 – Present' },
  { organization: 'Korean Securities Association (KSA)', krOrg: '한국증권학회 (KSA) 종신회원', role: 'Lifetime Member', period: '2023-09 – Present' },
  { organization: 'Korean Academic Society of Business Administration (KASBA)', krOrg: '한국경영학회 (KASBA) 종신회원', role: 'Lifetime Member', period: '2023-06 – Present' },
  { organization: 'Korea Intelligent Information Systems Society (KIISS)', krOrg: '한국지능정보시스템학회 (KIISS) 종신회원', role: 'Lifetime Member', period: '2022-06 – Present' },
]

// Research Interests
export const researchInterests = [
  {
    category: 'Financial Data Science',
    categoryKo: '금융 데이터 사이언스',
    items: [
      'Portfolio Optimization & Algorithmic Trading',
      'Financial Time-Series Modeling & Forecasting',
      'Personalized Finance & Behavioral Decision Modeling'
    ]
  },
  {
    category: 'Business Analytics',
    categoryKo: '비즈니스 애널리틱스',
    items: [
      'Cross-Industry Data Analytics',
      'Data Visualization & Transparency',
      'Business Insights from Statistical Methods'
    ]
  },
  {
    category: 'Data-Informed Decision Making',
    categoryKo: '데이터 기반 의사결정',
    items: [
      'Evidence-Based Policy Support',
      'AI-Augmented Decision Systems',
      'Human-Centered Decision Analytics'
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
  department: 'Department of Big Data Business Management',
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
