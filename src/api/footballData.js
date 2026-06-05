const BASE = '/api'

async function request(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export const getMatches = () => request('/competitions/WC/matches')
export const getStandings = () => request('/competitions/WC/standings')
export const getScorers = () => request('/competitions/WC/scorers?limit=20')
