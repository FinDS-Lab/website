import { memo, useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Users, GraduationCap, BookOpen, UserCheck, ChevronRight, Home, Mail, Github, Linkedin, Globe, Copy, Check, ExternalLink, Sparkles } from 'lucide-react'
import type { MemberData } from '@/types/data'

// Scroll animation hook
const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// Email Popup Component
const EmailPopup = ({ email, onClose, degree }: { email: string; onClose: () => void; degree?: string }) => {
  const [copied, setCopied] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleCopy = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendButtonColor = degree === 'undergrad' 
    ? 'bg-[#E8889C] hover:bg-[#E8889C]/90' 
    : degree === 'phd' 
    ? 'bg-[#D6B14D] hover:bg-[#D6B14D]/90' 
    : 'bg-[#FF6B6B] hover:bg-[#FF6B6B]/90'

  return (
    <div
      ref={popupRef}
      className="absolute bottom-full left-0 mb-8 bg-white border border-gray-200 rounded-xl shadow-lg p-12 z-50 min-w-200"
    >
      <p className="text-xs text-gray-500 mb-8">Email Address</p>
      <p className="text-sm font-medium text-gray-900 mb-12 break-all">{email}</p>
      <div className="flex gap-8">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-6 px-10 py-6 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <a
          href={`mailto:${email}`}
          className={`flex-1 flex items-center justify-center gap-6 px-10 py-6 ${sendButtonColor} rounded-lg text-xs font-medium text-white transition-colors`}
        >
          <ExternalLink size={12} />
          Send
        </a>
      </div>
    </div>
  )
}

// Image Imports
import banner2 from '@/assets/images/banner/2.webp'

const degreeLabels = {
  phd: 'Ph.D.',
  combined: 'Ph.D.-M.S. Combined',
  ms: 'M.S.',
  undergrad: 'Undergraduate Researchers',
}

const degreeColors = {
  phd: 'text-white',
  combined: 'text-white',
  ms: 'text-white',
  undergrad: 'text-white',
}

// Gold for PhD, Coral for combined, MS, Deep pink for undergrad
const degreeBgStyles = {
  phd: {backgroundColor: '#D6B14D'},          // Gold
  combined: {backgroundColor: '#FF6B6B'},      // Coral (석박사통합)
  ms: {backgroundColor: '#FF6B6B'},            // Coral
  undergrad: {backgroundColor: '#E8889C'},     // Deep Pink (진한 핑크)
}

// Hover colors matching Alumni style
const degreeHoverColors = {
  phd: '#D6B14D',
  combined: '#FF6B6B',
  ms: '#FF6B6B',
  undergrad: '#E8889C',
}

// 날짜 포맷 - 하이픈 유지 (2025-12-22 형식)
const formatPeriod = (dateStr: string): string => {
  if (!dateStr) return ''
  return dateStr
}

export const MembersCurrentTemplate = () => {
  const [members, setMembers] = useState<MemberData[]>([])
  const [loading, setLoading] = useState(true)
  const [openEmailPopup, setOpenEmailPopup] = useState<string | null>(null)
  const [hoveredMember, setHoveredMember] = useState<string | null>(null)
  const baseUrl = import.meta.env.BASE_URL || '/'
  const contentAnimation = useScrollAnimation()

  useEffect(() => {
    const safeJsonFetch = async (url: string) => {
      const response = await fetch(url)
      const text = await response.text()
      const cleaned = text.replace(/,(\s*[\}\]])/g, '$1')
      return JSON.parse(cleaned)
    }

    // members 폴더의 모든 파일 로드
    const memberFiles = [
      'lce1-undergrad.json',
      'jyj1-undergrad.json',
      'khw1-undergrad.json',
      'kdi1-undergrad.json',
      'lys1-undergrad.json',
      'hjs1-undergrad.json',
      'kjy1-undergrad.json',
      'se1-undergrad.json',
      'kkh1-undergrad.json',
      'kyh1-undergrad.json',
      'sjy1-undergrad.json',
      'cmh1-undergrad.json',
      'cjw1-undergrad.json',
      'jys1-undergrad.json',
      'lsj1-undergrad.json',
      'ltk1-undergrad.json',
      'pss1-undergrad.json',
      'sks1-undergrad.json',
      'lsi1-undergrad.json',
      'ydh1-undergrad.json',
      'kbo1-undergrad.json',
      'lsy1-undergrad.json'
    ]

    Promise.all(
      memberFiles.map((file) =>
        safeJsonFetch(`${baseUrl}data/members/${file}`)
          .catch(() => null)
      )
    )
      .then((results) => {
        const validMembers = results.filter((m): m is MemberData => m !== null && m.status === 'active')
        setMembers(validMembers)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load members data:', err)
        setLoading(false)
      })
  }, [])

  const stats = useMemo(() => {
    const phdCount = members.filter((m) => m.degree === 'phd').length
    const combinedCount = members.filter((m) => m.degree === 'combined').length
    const msCount = members.filter((m) => m.degree === 'ms').length
    const undergradCount = members.filter((m) => m.degree === 'undergrad').length

    return {
      phd: { label: phdCount === 1 ? 'Ph.D. Student' : 'Ph.D. Students', count: phdCount, icon: GraduationCap, color: '#D6B14D' },
      combined: { label: combinedCount === 1 ? 'Ph.D. - M.S. Combined Student' : 'Ph.D. - M.S. Combined Students', count: combinedCount, icon: Sparkles, color: '#FF6B6B' },
      ms: { label: msCount === 1 ? 'M.S. Student' : 'M.S. Students', count: msCount, icon: BookOpen, color: '#FF6B6B' },
      undergrad: { label: undergradCount === 1 ? 'Undergraduate Researcher' : 'Undergraduate Researchers', count: undergradCount, icon: UserCheck, color: '#E8889C' },
      total: { label: 'Total', count: members.length, icon: Users, color: '#D6B14D' },
    }
  }, [members])

  const groupedMembers = useMemo(() => {
    const grouped: { [key: string]: MemberData[] } = {
      phd: [],
      combined: [],
      ms: [],
      undergrad: [],
    }
    members.forEach((m) => {
      if (m.degree === 'phd') {
        grouped.phd.push(m)
      } else if (m.degree === 'combined') {
        grouped.combined.push(m)
      } else if (m.degree === 'ms') {
        grouped.ms.push(m)
      } else if (m.degree === 'undergrad') {
        grouped.undergrad.push(m)
      }
    })
    // Sort each group by Korean name (가나다순)
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.name.ko.localeCompare(b.name.ko, 'ko'))
    })
    return grouped
  }, [members])

  // 각 멤버의 degree에 맞는 hover color 반환
  const getMemberHoverColor = (degree: string) => {
    return degreeHoverColors[degree as keyof typeof degreeHoverColors] || '#E8889C'
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Banner - 통일된 스타일 */}
      <div className="relative w-full h-[200px] md:h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center md:scale-105 transition-transform duration-[2000ms]"
          style={{ backgroundImage: `url(${banner2})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-[#D6A076]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B14D]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B14D]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B14D]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              Members
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B14D]/80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight mb-16 md:mb-20">
            Current Members
          </h1>
          
          {/* Divider - < . > style */}
          <div className="flex items-center justify-center gap-8 md:gap-12">
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-[#D6C360]/50 to-[#D6C360]" />
            <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/50" />
            <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent via-[#D6C360]/50 to-[#D6C360]" />
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
            <span className="text-sm text-gray-400 font-medium">Members</span>
            <span className="text-gray-200">—</span>
            <span className="text-sm text-primary font-semibold">Current Members</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section 
        
        className="max-w-1480 mx-auto w-full px-16 md:px-20 py-40 md:py-60 pb-60 md:pb-80"
      >
        {/* Statistics Section - Red Dot Style */}
        <div className="flex flex-col gap-16 md:gap-24 mb-40 md:mb-60">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-12">
            <span className="w-8 h-8 rounded-full bg-primary" />
            Statistics
          </h2>
          
          {/* Total - Full Width */}
          <div className="group relative bg-[#FFF9E6] border border-[#D6B14D]/20 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col items-center justify-center">
              <span className="text-3xl md:text-4xl font-bold mb-4" style={{color: stats.total.color}}>{stats.total.count}</span>
              <div className="flex items-center gap-6">
                <stats.total.icon className="size-14 md:size-16" style={{color: stats.total.color, opacity: 0.7}} />
                <span className="text-xs md:text-sm font-medium text-gray-600">Total</span>
              </div>
            </div>
          </div>

          {/* Other Stats - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-8 md:gap-12">
            {[stats.phd, stats.combined, stats.ms, stats.undergrad].map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white border border-gray-100 rounded-2xl p-16 md:p-20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold mb-4" style={{color: stat.color}}>{stat.count}</span>
                  <div className="flex items-center gap-6">
                    <stat.icon className="size-14 md:size-16" style={{color: stat.color, opacity: 0.7}} />
                    <span className="text-xs md:text-sm font-medium text-gray-600">{stat.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Members List */}
        {loading ? (
          <div className="bg-gray-50 rounded-xl md:rounded-[20px] p-40 md:p-[60px] text-center">
            <p className="text-sm md:text-md text-gray-500">Loading members...</p>
          </div>
        ) : members.length > 0 ? (
          <div className="flex flex-col gap-32 md:gap-[40px]">
            {(['phd', 'combined', 'ms', 'undergrad'] as const).map((groupKey) => {
              const degreeMembers = groupedMembers[groupKey]
              if (degreeMembers.length === 0) return null

              return (
                <div key={groupKey}>
                  <h3 className="text-lg md:text-[22px] font-semibold text-gray-800 mb-16 md:mb-[20px]">
                    {degreeLabels[groupKey]}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-[20px]">
                    {degreeMembers.map((member) => {
                      const hoverColor = getMemberHoverColor(member.degree)
                      const isHovered = hoveredMember === member.id
                      
                      return (
                        <div
                          key={member.id}
                          className="bg-white border border-gray-100 rounded-xl md:rounded-[20px] p-16 md:p-[24px] shadow-sm hover:shadow-lg hover:border-primary/20 transition-all group"
                          onMouseEnter={() => setHoveredMember(member.id)}
                          onMouseLeave={() => setHoveredMember(null)}
                        >
                          <div className="flex items-start gap-12 md:gap-[16px]">
                            <div className="w-60 h-60 md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(232,135,155,0.15) 0%, rgba(255,183,197,0.2) 100%)'}}>
                              {member.avatar ? (
                                <img
                                  src={member.avatar.replace('/assets/img/', `${baseUrl}images/`)}
                                  alt={member.name.ko}
                                  className="w-full h-full object-cover object-top"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                  }}
                                />
                              ) : null}
                              <span className={`text-[28px] md:text-[40px] ${member.avatar ? 'hidden' : ''}`}>👤</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-6 md:gap-[8px] mb-4 md:mb-[4px]">
                                <h4 
                                  className="text-base md:text-[18px] font-semibold transition-colors"
                                  style={{ color: isHovered ? hoverColor : '#1f2937' }}
                                >
                                  {member.name.ko}
                                </h4>
                                <span 
                                  className={`px-6 md:px-[8px] py-[2px] rounded-full text-[10px] md:text-xs font-bold ${degreeColors[groupKey]}`}
                                  style={degreeBgStyles[groupKey]}
                                >
                                  {member.role.en}
                                </span>
                              </div>
                              <p className="text-xs md:text-[13px] text-gray-500">
                                {formatPeriod(member.period.start)} - {member.period.end ? formatPeriod(member.period.end) : member.period.expected_graduation ? formatPeriod(member.period.expected_graduation) : 'Present'}
                              </p>
                            </div>
                          </div>

                          {member.research.interests.length > 0 && (
                            <div className="mt-12 md:mt-[16px]">
                              <p className="text-[10px] md:text-[12px] text-gray-500 mb-6 md:mb-[8px]">Research Interests</p>
                              <div className="flex flex-wrap gap-4 md:gap-[6px]">
                                {member.research.interests.slice(0, 4).map((interest, idx) => (
                                  <span
                                    key={idx}
                                    className="px-8 md:px-[10px] py-[3px] md:py-[4px] bg-gray-100 rounded-full text-[10px] md:text-xs text-gray-600"
                                  >
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-12 md:mt-[16px] pt-12 md:pt-[16px] border-t border-gray-100 flex items-center gap-8 md:gap-[12px]">
                            {member.contact.email && (
                              <div className="relative flex items-center justify-center">
                                <button
                                  onClick={() => setOpenEmailPopup(openEmailPopup === member.id ? null : member.id)}
                                  className="p-6 rounded-lg bg-gray-100 hover:bg-primary/10 hover:text-primary transition-colors"
                                  title="Email"
                                >
                                  <Mail size={14} />
                                </button>
                                {openEmailPopup === member.id && (
                                  <EmailPopup
                                    email={member.contact.email}
                                    onClose={() => setOpenEmailPopup(null)}
                                    degree={member.degree}
                                  />
                                )}
                              </div>
                            )}
                            {member.social?.github && (
                              <a
                                href={member.social.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary transition-colors"
                                title="GitHub"
                              >
                                <Github size={16} />
                              </a>
                            )}
                            {member.social?.linkedin && (
                              <a
                                href={member.social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary transition-colors"
                                title="LinkedIn"
                              >
                                <Linkedin size={16} />
                              </a>
                            )}
                            {member.social?.personal_website && (
                              <a
                                href={member.social.personal_website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary transition-colors"
                                title="Personal Website"
                              >
                                <Globe size={16} />
                              </a>
                            )}
                            <Link
                              to={`/members/detail/${member.id}`}
                              className="ml-auto flex items-center gap-4 text-xs md:text-[13px] font-medium hover:text-primary transition-colors"
                            >
                              View Profile
                              <ChevronRight size={14} />
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl md:rounded-[20px] p-40 md:p-[60px] text-center">
            <div className="w-60 h-60 md:w-[80px] md:h-[80px] bg-white rounded-full flex items-center justify-center mx-auto mb-16 md:mb-[20px]">
              <Users className="w-28 h-28 md:w-[40px] md:h-[40px] text-gray-300" />
            </div>
            <p className="text-base md:text-[18px] font-medium text-gray-800 mb-8 md:mb-[8px]">No members found</p>
            <p className="text-xs md:text-[14px] text-gray-500">현재 등록된 멤버가 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default memo(MembersCurrentTemplate)
