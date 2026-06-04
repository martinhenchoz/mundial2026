const BASE = import.meta.env.DEV
  ? 'https://api.football-data.org/v4'
  : '/api'

async function request(path) {
  const headers = {}
  if (import.meta.env.DEV) headers['X-Auth-Token'] = import.meta.env.VITE_API_KEY ?? ''
  const res = await fetch(`${BASE}${path}`, { headers })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export const getMatches = () => request('/competitions/WC/matches')
export const getStandings = () => request('/competitions/WC/standings')
export const getScorers = () => request('/competitions/WC/scorers?limit=20')
