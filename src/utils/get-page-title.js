import defaultSettings from '@/settings'

const title = defaultSettings.title || '个人学习'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
