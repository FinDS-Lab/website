import { memo, useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Users, GraduationCap, BookOpen, UserCheck, ChevronRight, Home, Mail, Github, Linkedin, Globe, Copy, Check, ExternalLink } from 'lucide-react'
import type { MemberData } from '@/types/data'

// Email Popup Component
const EmailPopup = ({ email, onClose }: { email: string; onClose: () => void }) => {
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
          className="flex-1 flex items-center justify-center gap-6 px-10 py-6 bg-primary hover:bg-primary/90 rounded-lg text-xs font-medium text-white transition-colors"
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
  phd: 'Ph.D. Students',
  ms: 'M.S. Students',
  undergrad: 'Undergraduate',
}

const degreeColors = {
  phd: 'text-white',
  ms: 'text-white',
  undergrad: 'text-white',
}

const degreeBgStyles = {
  phd: {backgroundColor: '#D6B04C'},
  ms: {backgroundColor: '#E8889C'},
  undergrad: {backgroundColor: '#FFBAC4'},
}

export const MembersCurrentTemplate = () => {
  const [members, setMembers] = useState<MemberData[]>([])
  const [loading, setLoading] = useState(true)
  const [openEmailPopup, setOpenEmailPopup] = useState<string | null>(null)
  const baseUrl = import.meta.env.BASE_URL || '/'

  useEffect(() => {
    const safeJsonFetch = async (url: string) => {
      const response = await fetch(url)
      const text = await response.text()
      const cleaned = text.replace(/,(\s*[\}\]])/g, '$1')
      return JSON.parse(cleaned)
    }

    // members 폴더의 모든 파일 로드
    const memberFiles = [
      'kim-phd.json',
      'park-ms.json',
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
    const msCount = members.filter((m) => m.degree === 'ms').length
    const undergradCount = members.filter((m) => m.degree === 'undergrad').length

    return [
      { label: phdCount === 1 ? 'Ph.D. Student' : 'Ph.D. Students', count: phdCount, icon: GraduationCap, color: '#D6B04C' },
      { label: msCount === 1 ? 'M.S. Student' : 'M.S. Students', count: msCount, icon: BookOpen, color: '#E8889C' },
      { label: undergradCount === 1 ? 'Undergraduate Researcher' : 'Undergraduate Researchers', count: undergradCount, icon: UserCheck, color: '#FFBAC4' },
      { label: members.length === 1 ? 'Total Member' : 'Total Members', count: members.length, icon: Users, color: '#4A4A4A' },
    ]
  }, [members])

  const groupedMembers = useMemo(() => {
    const grouped: { [key: string]: MemberData[] } = {
      phd: [],
      ms: [],
      undergrad: [],
    }
    members.forEach((m) => {
      if (grouped[m.degree]) {
        grouped[m.degree].push(m)
      }
    })
    return grouped
  }, [members])

  return (
    <div className="flex flex-col bg-white">
      {/* Banner - 통일된 스타일 */}
      <div className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2000ms]"
          style={{ backgroundImage: `url(${banner2})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-[#D6A076]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6B04C]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full bg-[#D6B04C]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse delay-1000" />

        <div className="relative h-full flex flex-col items-center justify-center px-20">
          <div className="flex items-center gap-8 mb-16 md:mb-20">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-[#D6B04C]/80" />
            <span className="text-[#D6C360]/90 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
              Members
            </span>
            <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-[#D6B04C]/80" />
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
      <section className="max-w-1480 mx-auto w-full px-16 md:px-20 py-40 md:py-60 pb-60 md:pb-80">
        {/* Statistics Section - Red Dot Style */}
        <div className="flex flex-col gap-16 md:gap-24 mb-40 md:mb-60">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-12">
            <span className="w-8 h-8 rounded-full bg-primary" />
            Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
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
            {(['phd', 'ms', 'undergrad'] as const).map((degree) => {
              const degreeMembers = groupedMembers[degree]
              if (degreeMembers.length === 0) return null

              return (
                <div key={degree}>
                  <h3 className="text-lg md:text-[22px] font-semibold text-gray-800 mb-16 md:mb-[20px]">
                    {degreeLabels[degree]}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-[20px]">
                    {degreeMembers.map((member) => (
                      <div
                        key={member.id}
                        className="bg-white border border-gray-100 rounded-xl md:rounded-[20px] p-16 md:p-[24px] shadow-sm hover:shadow-lg hover:border-primary/20 transition-all group"
                      >
                        <div className="flex items-start gap-12 md:gap-[16px]">
                          <div className="w-60 h-60 md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(232,135,155,0.15) 0%, rgba(255,183,197,0.2) 100%)'}}>
                            {member.avatar ? (
                              <img
                                src={member.avatar.replace('/assets/img/', `${baseUrl}images/`)}
                                alt={member.name.ko}
                                className="w-full h-full object-cover"
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
                              <h4 className="text-base md:text-[18px] font-semibold text-gray-800 group-hover:text-primary transition-colors">{member.name.ko}</h4>
                              <span 
                                className={`px-6 md:px-[8px] py-[2px] rounded-full text-[10px] md:text-[11px] font-bold ${degreeColors[member.degree]}`}
                                style={degreeBgStyles[member.degree]}
                              >
                                {member.role.ko}
                              </span>
                            </div>
                            <p className="text-xs md:text-[14px] text-gray-500 mb-4 md:mb-[8px] truncate">{member.education?.[0]?.school || ''}</p>
                            <p className="text-[11px] md:text-[13px] text-gray-500">
                              {member.period.start} – {member.period.end || member.period.expected_graduation || 'Present'}
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
                                  className="px-8 md:px-[10px] py-[3px] md:py-[4px] bg-gray-100 rounded-full text-[10px] md:text-[11px] text-gray-600"
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
                                className=""
                                title="Email"
                              >
                                <Mail size={16} />
                              </button>
                              {openEmailPopup === member.id && (
                                <EmailPopup
                                  email={member.contact.email}
                                  onClose={() => setOpenEmailPopup(null)}
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
                            to={`/members/${member.id}`}
                            className="ml-auto flex items-center gap-4 text-xs md:text-[13px] font-medium hover:text-primary transition-colors"
                          >
                            View Profile
                            <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    ))}
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
