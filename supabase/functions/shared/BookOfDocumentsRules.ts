export interface BookRules {
  title: string
  header: string
  footer: string
}

export function getBookRules(province: string): BookRules {
  return {
    title: `Book of Documents (${province || 'N/A'})`,
    header: 'Applicant v. Respondent',
    footer: 'Confidential',
  }
}

export function formatPageNumber(page: number, total: number) {
  return `Page ${page} of ${total}`
}
