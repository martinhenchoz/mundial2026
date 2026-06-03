import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('footballData', () => {
  let getMatches, getStandings, getScorers

  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('../footballData')
    getMatches = mod.getMatches
    getStandings = mod.getStandings
    getScorers = mod.getScorers
  })

  afterEach(() => vi.restoreAllMocks())

  it('getMatches llama a /competitions/WC/matches con auth header', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true, json: () => Promise.resolve({ matches: [] }),
    })
    const result = await getMatches()
    expect(fetch).toHaveBeenCalledWith(
      'https://api.football-data.org/v4/competitions/WC/matches',
      expect.objectContaining({ headers: expect.objectContaining({ 'X-Auth-Token': expect.any(String) }) })
    )
    expect(result).toEqual({ matches: [] })
  })

  it('lanza error en respuesta no-ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 429 })
    await expect(getMatches()).rejects.toThrow('API error 429')
  })

  it('getStandings llama a /competitions/WC/standings', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true, json: () => Promise.resolve({ standings: [] }),
    })
    await getStandings()
    expect(fetch).toHaveBeenCalledWith(
      'https://api.football-data.org/v4/competitions/WC/standings', expect.anything()
    )
  })
})
