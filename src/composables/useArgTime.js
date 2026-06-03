const ARG_TZ = 'America/Argentina/Buenos_Aires'

export function useArgTime() {
  function toArgDateStr(date) {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: ARG_TZ, year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(date)
  }

  function formatTime(utcDateStr) {
    return new Intl.DateTimeFormat('es-AR', {
      timeZone: ARG_TZ, hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date(utcDateStr))
  }

  function formatMatchTime(utcDateStr) {
    const matchDate = new Date(utcDateStr)
    const time = formatTime(utcDateStr)
    if (toArgDateStr(matchDate) === toArgDateStr(new Date())) return `Hoy · ${time}`
    const dateLabel = new Intl.DateTimeFormat('es-AR', {
      timeZone: ARG_TZ, weekday: 'short', day: 'numeric', month: 'short',
    }).format(matchDate)
    return `${dateLabel} · ${time}`
  }

  return { formatMatchTime, formatTime }
}
