import { memo, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Award, Trophy, Medal, Home, ChevronDown, ChevronUp } from 'lucide-react'
import type { HonorsData, HonorItem } from '@/types/data'

// Image Imports
import banner1 from '@/assets/images/banner/1.webp'

type FilterType = 'all' | 'honor' | 'award'

export const AboutHonorsTemplate = () => {
  const [honorsData, setHonorsData] = useState<HonorsData>({})
  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedYear, setExpandedYear] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const safeJsonFetch = async (url: string) => {
      const response = await fetch(url)
      const text = await response.text()
      const cleaned = text.replace(/,(\s*[\}\]])/g, '$1')
      return JSON.parse(cleaned)
    }

    safeJsonFetch('/website/data/honors.json')
      .then((data: HonorsData) => {
        // 2025년 6월 14일 이후 데이터만 필터링
        const cutoffDate = new Date('2025-06-14')
        const filteredData: HonorsData = {}
        
        const monthMap: Record<string, number> = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        }
        
        Object.entries(data).forEach(([year, items]) => {
          const yearNum = parseInt(year)
          if (yearNum > 2025) {
            filteredData[year] = items
          } else if (yearNum === 2025) {
            const filtered = items.filter(item => {
              const [monthStr, dayStr] = item.date.split(' ')
              const month = monthMap[monthStr]
              const day = parseInt(dayStr)
              const itemDate = new Date(2025, month, day)
              return itemDate >= cutoffDate
            })
            if (filtered.length > 0) {
              filteredData[year] = filtered
            }
          }
        })
        
        setHonorsData(filteredData)
        // 기본적으로 모두 접힘 상태
        setExpandedYear(null)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load honors data:', err)
        setLoading(false)
      })
  }, [])

  const stats = useMemo(() => {
    let honors = 0
    let awards = 0
    Object.values(honorsData).forEach((items) => {
      items.forEach((item) => {
        if (item.type === 'honor') honors++
        else if (item.type === 'award') awards++
      })
    })
    return [
      { label: 'Honors', subLabel: 'Honorary Recognition', count: honors, icon: Medal },
      { label: 'Awards', subLabel: 'Competition Awards', count: awards, icon: Trophy },
      { label: 'Total', subLabel: 'Total Achievements', count: honors + awards, icon: Award },
    ]
  }, [honorsData])

  const sortedYears = useMemo(() => {
    const years = Object.keys(honorsData)
    return years.sort((a, b) => Number(b) - Number(a))
  }, [honorsData])

  const getFilteredItems = (items: HonorItem[]) => {
    if (filter === 'all') return items
    return items?.filter((item) => item.type === filter)
  }

  const getYearCount = (year: string) => {
    const items = honorsData[year] || []
    if (filter === 'all') return items.length
    return items?.filter((item) => item.type === filter).length
  }

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
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-amber-400/80" />
            <span className="text-amber-300/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              About FINDS
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-amber-400/80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">
            Honors & Awards
          </h1>
          
          {/* Divider */}
          <div className="flex items-center justify-center gap-12 md:gap-16">
            <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-amber-300" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-amber-300" />
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
            <span className="text-sm text-primary font-semibold">Honors & Awards</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 py-40 md:py-60 pb-60 md:pb-[80px]">
        {/* Statistics Section */}
        <div className="flex flex-col gap-12 md:gap-[20px] mb-24 md:mb-[40px]">
          <div className="flex items-center gap-[8px]">
            <h2 className="text-xl md:text-[26px] font-semibold text-gray-900">Statistics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-[20px]">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-16 md:px-20 py-16 md:py-[24px] bg-white border border-gray-100 rounded-xl md:rounded-[20px] shadow-sm"
              >
                <div className="flex items-center gap-8 md:gap-[12px]">
                  <stat.icon className="w-16 h-16 md:w-[20px] md:h-[20px] text-gray-500" />
                  <div className="flex flex-col">
                    <span className="text-sm md:text-md font-semibold text-gray-900">{stat.label}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-[2px]">
                  <span className="text-xl md:text-[24px] font-semibold text-primary">{stat.count}</span>
                  <span className="text-[10px] md:text-[12px] font-semibold text-gray-700">건</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-12 md:gap-[12px] mb-20 md:mb-[30px]">
          <h3 className="text-base md:text-[18px] font-semibold text-gray-800 flex items-center gap-[8px]">
            Filters
          </h3>
          <div className="flex flex-wrap items-center gap-6 md:gap-[8px]">
            {(['all', 'honor', 'award'] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-12 md:px-[16px] py-6 md:py-[8px] rounded-lg md:rounded-[8px] text-xs md:text-[14px] font-medium transition-colors ${
                  filter === type
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {type === 'all' ? 'All' : type === 'honor' ? 'Honors' : 'Awards'}
              </button>
            ))}
          </div>
        </div>

        {/* List by Year */}
        {loading ? (
          <div className="bg-gray-50 rounded-xl md:rounded-[20px] p-32 md:p-[60px] text-center">
            <p className="text-sm md:text-md text-gray-500">Loading...</p>
          </div>
        ) : sortedYears.length > 0 ? (
          <div className="flex flex-col gap-12 md:gap-[16px]">
            {sortedYears.map((year) => {
              const filteredItems = getFilteredItems(honorsData[year])
              const yearCount = getYearCount(year)
              const currentYear = new Date().getFullYear()
              const isCurrentYear = Number(year) === currentYear

              // 데이터가 0개면 표시하지 않음
              if (yearCount === 0) return null

              return (
                <div key={year} className={`border rounded-xl md:rounded-[20px] overflow-hidden shadow-sm ${isCurrentYear ? 'border-amber-300' : 'border-gray-100'}`}>
                  <button
                    onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                    className={`w-full flex items-center justify-between px-16 md:px-[24px] py-16 md:py-[20px] transition-colors ${
                      isCurrentYear 
                        ? 'bg-amber-100 hover:bg-amber-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-12 md:gap-[16px]">
                      <span className={`text-lg md:text-[20px] font-bold ${isCurrentYear ? 'text-amber-800' : 'text-gray-800'}`}>{year}</span>
                      {isCurrentYear && (
                        <span className="px-8 py-2 bg-amber-500 text-white text-[10px] md:text-xs font-semibold rounded-full">NEW</span>
                      )}
                      <span className={`text-xs md:text-[14px] ${isCurrentYear ? 'text-amber-700' : 'text-gray-500'}`}>{yearCount}건</span>
                    </div>
                    {expandedYear === year ? (
                      <ChevronUp className="w-16 h-16 md:w-[20px] md:h-[20px] text-gray-500" />
                    ) : (
                      <ChevronDown className="w-16 h-16 md:w-[20px] md:h-[20px] text-gray-500" />
                    )}
                  </button>
                  {expandedYear === year && (
                    <div className="flex flex-col">
                      {(!filteredItems || filteredItems.length === 0) ? (
                        <div className="p-24 md:p-32 text-center bg-white border-t border-gray-100">
                          <p className="text-sm md:text-base text-gray-500">아직 등록된 데이터가 없습니다.</p>
                        </div>
                      ) : filteredItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row items-start gap-12 md:gap-[16px] p-16 md:p-[24px] bg-white border-t border-gray-100"
                        >
                          <div
                            className={`w-36 h-36 md:w-[44px] md:h-[44px] rounded-lg md:rounded-[12px] flex items-center justify-center flex-shrink-0 ${
                              item.type === 'honor' ? 'bg-blue-100' : 'bg-amber-100'
                            }`}
                          >
                            {item.type === 'honor' ? (
                              <Medal className="w-18 h-18 md:w-[22px] md:h-[22px] text-blue-600" />
                            ) : (
                              <Trophy className="w-18 h-18 md:w-[22px] md:h-[22px] text-amber-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm md:text-md font-semibold text-gray-800 mb-4 md:mb-[4px]">
                              {item.title}
                            </h4>
                            <p className="text-xs md:text-[14px] text-gray-600 mb-4 md:mb-[4px]">{item.event}</p>
                            <p className="text-[11px] md:text-[13px] text-gray-500">{item.organization}</p>
                            {item.winners && item.winners.length > 0 && (
                              <div className="flex flex-wrap items-center gap-6 md:gap-[8px] mt-8 md:mt-[8px]">
                                {item.winners.map((winner, idx) => (
                                  <span
                                    key={idx}
                                    className="px-8 md:px-[10px] py-3 md:py-[4px] bg-gray-100 rounded-full text-[10px] md:text-[12px] text-gray-600"
                                  >
                                    {winner.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-xs md:text-[14px] text-gray-500 font-medium whitespace-nowrap">
                            {item.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl md:rounded-[20px] p-40 md:p-[60px] text-center">
            <div className="w-60 h-60 md:w-[80px] md:h-[80px] bg-white rounded-full flex items-center justify-center mx-auto mb-16 md:mb-[20px]">
              <Award className="w-28 h-28 md:w-[40px] md:h-[40px] text-gray-300" />
            </div>
            <p className="text-sm md:text-md text-gray-500">아직 등록된 수상 내역이 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default memo(AboutHonorsTemplate)
