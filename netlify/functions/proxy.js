export const handler = async (event) => {
  const path = event.path.replace('/api', '')
  const query = event.rawQuery ? `?${event.rawQuery}` : ''
  const url = `https://api.football-data.org/v4${path}${query}`

  const res = await fetch(url, {
    headers: { 'X-Auth-Token': process.env.VITE_API_KEY ?? '' },
  })

  const body = await res.text()

  return {
    statusCode: res.status,
    headers: { 'Content-Type': 'application/json' },
    body,
  }
}
