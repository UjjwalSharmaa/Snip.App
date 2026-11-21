import api from './axios'

export async function createLink({ originalUrl, customAlias, title }) {
  const res = await api.post('/links', { originalUrl, customAlias, title })
  return res.data.link
}

export async function getLinks() {
  const res = await api.get('/links')
  return res.data.links
}

export async function getAnalytics(id) {
  const res = await api.get(`/links/${id}/analytics`)
  return res.data
}
