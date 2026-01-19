export interface ParsedMarkdown {
  data: Record<string, string | string[]>
  content: string
}

export const parseMarkdown = (text: string): ParsedMarkdown => {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = text.match(frontMatterRegex)
  if (!match) return { data: {}, content: text }

  const yaml = match[1]
  const content = match[2]
  const data: Record<string, string | string[]> = {}

  yaml.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()

      // 배열 처리 [tag1, tag2]
      if (value.startsWith('[') && value.endsWith(']')) {
        data[key] = value.slice(1, -1).split(',').map(t => t.trim())
      } else {
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
        data[key] = value
      }
    }
  })

  return { data, content }
}

// Jekyll 날짜 포맷 변환
const formatDate = (dateStr: string, format: string): string => {
  if (!dateStr) return ''
  
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  // 일반적인 Jekyll 날짜 포맷 처리
  return format
    .replace('%Y', String(year))
    .replace('%m', month)
    .replace('%d', day)
    .replace('%B', date.toLocaleString('en', { month: 'long' }))
    .replace('%b', date.toLocaleString('en', { month: 'short' }))
}

// Jekyll 필터 처리하여 콘텐츠 변환
export const processJekyllContent = (
  content: string, 
  data: Record<string, string | string[]>,
  options?: { basePath?: string }
): string => {
  let processed = content
  const basePath = options?.basePath || ''

  // {{ page.key | filter: "arg" }} 패턴 처리
  const templateRegex = /\{\{\s*page\.(\w+)(?:\s*\|\s*([^}]+))?\s*\}\}/g
  
  processed = processed.replace(templateRegex, (_match: string, key: string, filters: string | undefined) => {
    let value: string | string[] | undefined = data[key]
    
    // 값이 배열이면 join
    if (Array.isArray(value)) {
      value = value.join(', ')
    }
    
    // 필터가 없으면 값만 반환
    if (!filters) {
      return value || ''
    }
    
    // 필터 파싱 및 적용
    const filterParts = filters.split('|').map((f: string) => f.trim())
    
    for (const filterPart of filterParts) {
      // date: "%Y.%m.%d"
      const dateMatch = filterPart.match(/^date:\s*"([^"]+)"/)
      if (dateMatch) {
        value = formatDate(value || '', dateMatch[1])
        continue
      }
      
      // default: "value"
      const defaultMatch = filterPart.match(/^default:\s*"([^"]*)"/)
      if (defaultMatch) {
        if (!value || value === '') {
          value = defaultMatch[1]
        }
        continue
      }
      
      // relative_url (경로 처리)
      if (filterPart === 'relative_url') {
        if (value && typeof value === 'string') {
          value = basePath + value
        }
        continue
      }
    }
    
    return value || ''
  })

  // {{ site.* }} 패턴 제거
  processed = processed.replace(/\{\{\s*site\.[^}]*\}\}/g, '')

  return processed
}
