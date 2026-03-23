const COUNTRY_COORDS = {
  CN: { x: 72, y: 35 }, RU: { x: 62, y: 25 }, US: { x: 20, y: 35 },
  DE: { x: 48, y: 27 }, FR: { x: 47, y: 28 }, GB: { x: 46, y: 26 },
  NL: { x: 48, y: 26 }, BR: { x: 28, y: 58 }, IN: { x: 68, y: 40 },
  KR: { x: 77, y: 33 }, JP: { x: 79, y: 32 }, SG: { x: 75, y: 47 },
  VN: { x: 74, y: 42 }, ID: { x: 75, y: 50 }, TR: { x: 56, y: 32 },
  UA: { x: 53, y: 27 }, IR: { x: 60, y: 35 }, PK: { x: 64, y: 37 },
  TH: { x: 73, y: 43 }, MY: { x: 74, y: 46 }, IT: { x: 50, y: 30 },
  ES: { x: 46, y: 30 }, PL: { x: 51, y: 26 }, RO: { x: 52, y: 28 },
  AR: { x: 27, y: 68 }, MX: { x: 18, y: 40 }, ZA: { x: 52, y: 65 },
  EG: { x: 54, y: 38 }, NG: { x: 50, y: 47 }, AU: { x: 80, y: 65 },
}

export default function WorldMap({ alerts }) {
  // Compte les attaques par pays
  const attacksByCountry = alerts.reduce((acc, alert) => {
    const code = alert.countryCode
    if (code && code !== 'XX') {
      acc[code] = (acc[code] || 0) + 1
    }
    return acc
  }, {})

  const maxAttacks = Math.max(...Object.values(attacksByCountry), 1)

  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body p-4">
        <h2 className="card-title text-base">Attack Origins</h2>
        <div className="relative w-full" style={{ paddingBottom: '50%' }}>
          <svg
            viewBox="0 0 100 50"
            className="absolute inset-0 w-full h-full"
            style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}
          >
            {/* Grille simple */}
            {[10, 20, 30, 40].map(y => (
              <line key={y} x1="0" y1={y} x2="100" y2={y}
                stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
            ))}
            {[20, 40, 60, 80].map(x => (
              <line key={x} x1={x} y1="0" x2={x} y2="50"
                stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
            ))}

            {/* Cercles par pays */}
            {Object.entries(attacksByCountry).map(([code, count]) => {
              const coords = COUNTRY_COORDS[code]
              if (!coords) return null
              const radius = 0.5 + (count / maxAttacks) * 3
              const opacity = 0.4 + (count / maxAttacks) * 0.6
              return (
                <g key={code}>
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={radius}
                    fill="#ff4444"
                    opacity={opacity}
                  />
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={radius * 1.5}
                    fill="none"
                    stroke="#ff4444"
                    strokeWidth="0.2"
                    opacity={opacity * 0.5}
                  />
                  <title>{code}: {count} attacks</title>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Légende */}
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(attacksByCountry)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([code, count]) => (
              <div key={code} className="badge badge-outline badge-sm">
                {code}: {count}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}