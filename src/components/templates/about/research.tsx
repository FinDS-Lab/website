import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

// Image Imports
import banner1 from '@/assets/images/banner/1.webp'
import icon10 from '@/assets/images/icons/10.png'
import icon11 from '@/assets/images/icons/11.png'
import icon12 from '@/assets/images/icons/12.png'

// 연구 분야 데이터
const researchAreas = [
  {
    id: 'fds',
    badge: '핀테크 혁신의 핵심 동력',
    titleEn: 'Financial Data Science',
    titleKo: '금융 데이터 사이언스',
    image: icon12,
    items: [
      {
        en: 'AI in Quantitative Finance & Asset Management',
        ko: '인공지능을 활용한 포트폴리오 최적화, 자산 배분, 알고리즘 트레이딩',
      },
      {
        en: 'Financial Time-Series Modeling & Forecasting',
        ko: '변동성 예측, 국면 전환 모형, 선·후행 관계 분석, 수익률 예측 등 금융 시계열 모형 연구',
      },
      {
        en: 'Household Finance & Behavioral Decision Modeling',
        ko: '가계 금융과 투자자 행동 분석, 행동재무학 기반 의사결정 모형화',
      },
    ],
  },
  {
    id: 'ba',
    badge: '디지털 전환 시대의 경쟁력',
    titleEn: 'Business Analytics',
    titleKo: '비즈니스 애널리틱스',
    image: icon11,
    items: [
      {
        en: 'Data Analytics for Cross-Industry and Cross-Domain Convergence',
        ko: '다양한 산업과 분야 간의 결합과 융합을 위한 데이터 분석',
      },
      {
        en: 'Data Visualization & Transparency in Business Analytics',
        ko: '복잡한 데이터를 직관적으로 표현하고 투명성을 높이는 시각화 기법',
      },
      {
        en: 'Business Insights from Data Science Techniques',
        ko: '데이터 사이언스 기법을 활용한 비즈니스 인사이트 발굴',
      },
    ],
  },
  {
    id: 'dim',
    badge: '불확실성을 기회로 바꾸는 방법',
    titleEn: 'Data-Informed Decision Making',
    titleKo: '데이터 기반 의사결정',
    image: icon10,
    items: [
      {
        en: 'Trustworthy Decision Systems & Optimization',
        ko: '신뢰할 수 있는 의사결정 시스템 설계와 최적화 기법',
      },
      {
        en: 'Risk-Aware & User-Friendly Decision Tools',
        ko: '금융·경영 위험을 반영하고 사용자 친화성을 갖춘 의사결정 도구',
      },
      {
        en: 'Decision Analytics for Complex Business Problems',
        ko: '복잡한 경영 및 투자 의사결정 문제 해결을 위한 분석 및 최적화 방법론',
      },
    ],
  },
]

export const AboutResearchTemplate = () => {
  return (
    <div className="flex flex-col bg-white">
      {/* Banner - Introduction과 동일한 스타일 */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2000ms]"
          style={{ backgroundImage: `url(${banner1})` }}
        />
        
        {/* Luxurious Gold Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-amber-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Floating Accent */}
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-amber-400/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <span className="text-amber-300/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase mb-16 md:mb-20">
            About FINDS
          </span>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">
            Research Areas
          </h1>
          
          {/* Divider - < . > style */}
          <div className="flex items-center justify-center gap-8 md:gap-12">
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-amber-300" />
            <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/50" />
            <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent via-amber-300/50 to-amber-300" />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20">
        <div className="py-20 md:py-32 border-b border-gray-100">
          <div className="flex items-center gap-8 md:gap-12 flex-wrap">
            <Link to="/" className="text-gray-400 hover:text-primary transition-all duration-300 hover:scale-110">
              <Home size={16} />
            </Link>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-gray-400 font-medium">About FINDS</span>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-primary font-semibold">Research Areas</span>
          </div>
        </div>
      </div>

      {/* Hero Section - Introduction 스타일 */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 pt-32 md:pt-48 pb-20 md:pb-32">
        <div className="relative text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-[1.3] mb-16 md:mb-24">
            <span className="inline-block">Driving</span>
            <span className="inline-block mx-4"> </span>
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary via-amber-600 to-primary bg-clip-text text-transparent">
                Innovation
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-amber-200/60 to-primary/20 -skew-x-6 rounded" />
            </span>
            <span className="inline-block mx-4"> </span>
            <span className="inline-block">via Data</span>
          </h2>
          
          <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
            FINDS Lab은 금융데이터사이언스, 비즈니스 애널리틱스, 데이터 기반 의사결정의 세 가지 핵심 연구 분야를 통해 
            실질적인 가치를 창출하는 혁신적인 연구를 수행합니다.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-1480 mx-auto w-full px-16 md:px-20 pb-60 md:pb-100">
        <div className="flex flex-col gap-20 md:gap-32">
          {researchAreas.map((area, index) => (
            <article
              key={area.id}
              className={`
                relative bg-gradient-to-br from-white via-white to-amber-50/30
                border border-amber-100/50 rounded-2xl md:rounded-3xl p-24 md:p-48 
                shadow-sm hover:shadow-xl hover:border-primary/30 
                transition-all duration-500 group overflow-hidden
              `}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-xl" />
              
              <div className={`
                relative grid gap-24 md:gap-40
                ${index % 2 === 0 ? 'md:grid-cols-[1.2fr_1fr]' : 'md:grid-cols-[1fr_1.2fr]'}
              `}>
                {/* 텍스트 영역 */}
                <div className={`flex flex-col ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  {/* 헤더 */}
                  <div className="mb-20 md:mb-24">
                    <div className="inline-flex items-center gap-8 px-12 md:px-14 py-6 md:py-8 bg-gradient-to-r from-amber-50 to-primary/5 border border-amber-200/50 rounded-full mb-12 md:mb-16">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-[10px] md:text-xs font-bold text-amber-700 tracking-wide">
                        {area.badge}
                      </span>
                    </div>
                    <h2>
                      <span className="block text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-amber-600 to-primary bg-clip-text text-transparent mb-6">
                        {area.titleEn}
                      </span>
                      <span className="text-base md:text-lg font-semibold text-gray-600">
                        {area.titleKo}
                      </span>
                    </h2>
                  </div>

                  {/* 항목 리스트 */}
                  <ul className="flex flex-col gap-16 md:gap-20">
                    {area.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="relative pl-20 md:pl-24 group/item"
                      >
                        <span className="absolute left-0 top-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-amber-400/20 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        </span>
                        <span className="block text-sm md:text-base font-semibold text-gray-800 leading-snug group-hover/item:text-primary transition-colors">
                          {item.en}
                        </span>
                        <span className="block text-xs md:text-sm text-gray-500 mt-6 leading-relaxed">
                          {item.ko}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 이미지 영역 */}
                <div
                  className={`
                    flex items-center justify-center 
                    bg-gradient-to-br from-amber-50/50 via-white to-primary/5
                    rounded-xl md:rounded-2xl p-24 md:p-40
                    border border-amber-100/30
                    group-hover:border-primary/20 transition-all duration-500
                    ${index % 2 === 1 ? 'md:order-1' : ''}
                  `}
                >
                  <img
                    src={area.image}
                    alt={area.titleEn}
                    className="w-100 h-100 md:w-160 md:h-160 object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(AboutResearchTemplate)
