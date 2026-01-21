// Honors data types
export type HonorItem = {
  type: 'award' | 'honor'
  icon: string
  title: string
  event: string
  organization: string
  date: string
  winners: { name: string; level: string }[]
}

export type HonorsData = {
  [year: string]: HonorItem[]
}

// Publications data types
export type Publication = {
  year: number
  code_label: string
  indexing_group: string
  type: string
  language: string
  title: string
  title_ko: string
  authors: number[]
  author_marks: string[]
  venue: string
  venue_ko: string
  published_date: string
  awards: number
  award_details?: {
    prize?: string
    prize_ko?: string
    category?: string
    category_ko?: string
    organization?: string
    organization_ko?: string
  }
  citations: {
    apa: string
    mla: string
    chicago: string
    harvard: string
    vancouver: string
    korean: string
  }
  doi?: string
  url?: string
  presentation_type?: 'oral' | 'poster'
}

export type AuthorsData = {
  [id: string]: {
    en: string
    ko: string
  }
}

// Members data types
export type MemberData = {
  id: string
  name: {
    ko: string
    en: string
  }
  degree: 'phd' | 'ms' | 'undergrad'
  role: {
    ko: string
    en: string
  }
  status: 'active' | 'alumni'
  period: {
    start: string
    expected_graduation?: string
    end?: string
  }
  contact: {
    email: string
  }
  research: {
    interests: string[]
  }
  education: {
    degree: string
    field: string
    school: string
    start: string
    end?: string
    expected?: string
  }[]
  social?: {
    github?: string
    linkedin?: string
    google_scholar?: string
    orcid?: string
    personal_website?: string
  }
  avatar: string
}

// Alumni data types
export type AlumniMember = {
  name: string
  nameKo: string
  degrees: string[]
  periods: {
    [degree: string]: string
  }
  education: {
    degree: string
    school: string
    dept: string
    year: string
  }[]
  thesis?: {
    [degree: string]: {
      title: string
      url: string
    }
  }
  company?: string
  cohort?: string
  projects?: string[]
}

export type AlumniData = {
  graduateAlumni: AlumniMember[]
  undergradAlumni: AlumniMember[]
  sinceDate: string
}

// Lectures data types
export type Lecture = {
  role: string
  periods: string[]
  school: string
  courses: {
    en: string
    ko: string
  }[]
}

// Projects data types
export type Project = {
  titleEn: string
  titleKo: string
  period: string
  fundingAgency: string
  fundingAgencyKo: string
  amount: string
  type: string
  roles: {
    principalInvestigator?: string
    leadResearcher?: string
    researchers: string[]
  }
}

// Reviewer data types (legacy - kept for compatibility)
export type ReviewerJournal = {
  id: number
  name: string
  publisher: string
  type: string
  since: string
  url: string
}

export type ReviewerConference = {
  id: number
  name: string
  publisher: string
  type: string
  period: string
  url: string
}

export type ReviewerData = {
  journals: ReviewerJournal[]
  conferences: ReviewerConference[]
}

// Academic Activities data types (new unified format)
export type AcademicActivity = {
  id: number
  category: 'journal' | 'conference' | 'chair' | 'committee'
  name: string
  name_ko?: string
  publisher: string
  type: string
  since?: string
  period?: string
  url: string
}

export type AcademicActivitiesData = {
  activities: AcademicActivity[]
}

// Mentees data types
export type ParticipationYear = {
  year: string
  program: string
}

export type Mentee = {
  name: string
  university: string
  department: string
  entryYear: string
  participationYears: ParticipationYear[]
}

export type MenteesData = {
  [id: string]: Mentee
}






