import { useState, useEffect } from 'react'
import { feature } from 'topojson-client'
import { geoNaturalEarth1, geoPath } from 'd3-geo'

const ISO_NUM_TO_ALPHA2 = {
  '004': 'AF', '008': 'AL', '012': 'DZ', '024': 'AO', '032': 'AR',
  '036': 'AU', '040': 'AT', '050': 'BD', '056': 'BE', '068': 'BO',
  '076': 'BR', '100': 'BG', '116': 'KH', '120': 'CM', '124': 'CA',
  '144': 'LK', '152': 'CL', '156': 'CN', '170': 'CO', '188': 'CR',
  '191': 'HR', '192': 'CU', '203': 'CZ', '208': 'DK', '218': 'EC',
  '818': 'EG', '231': 'ET', '246': 'FI', '250': 'FR', '276': 'DE',
  '288': 'GH', '300': 'GR', '320': 'GT', '348': 'HU', '356': 'IN',
  '360': 'ID', '364': 'IR', '368': 'IQ', '372': 'IE', '376': 'IL',
  '380': 'IT', '392': 'JP', '400': 'JO', '404': 'KE', '408': 'KP',
  '410': 'KR', '414': 'KW', '422': 'LB', '458': 'MY', '484': 'MX',
  '504': 'MA', '528': 'NL', '554': 'NZ', '566': 'NG', '578': 'NO',
  '586': 'PK', '604': 'PE', '608': 'PH', '616': 'PL', '620': 'PT',
  '642': 'RO', '643': 'RU', '682': 'SA', '710': 'ZA', '724': 'ES',
  '752': 'SE', '756': 'CH', '760': 'SY', '764': 'TH', '788': 'TN',
  '792': 'TR', '804': 'UA', '784': 'AE', '826': 'GB', '840': 'US',
  '858': 'UY', '862': 'VE', '704': 'VN', '702': 'SG', '756': 'CH',
  '012': 'DZ', '032': 'AR', '076': 'BR', '156': 'CN', '276': 'DE',
}

export default function WorldMap({ alerts }) {
  const [countries, setCountries] = useState(null)
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(world => setCountries(feature(world, world.objects.countries)))
  }, [])

  const attacksByCode = alerts.reduce((acc, alert) => {
    if (alert.countryCode && alert.countryCode !== 'XX') {
      acc[alert.countryCode] = (acc[alert.countryCode] || 0) + 1
    }
    return acc
  }, {})

  const maxAttacks = Math.max(...Object.values(attacksByCode), 1)

  const width = 960
  const height = 500

  const projection = geoNaturalEarth1()
    .scale(153)
    .translate([width / 2, height / 2])

  const pathGen = geoPath().projection(projection)

  const getColor = (numericId) => {
    const code = ISO_NUM_TO_ALPHA2[String(numericId).padStart(3, '0')]
    const count = attacksByCode[code] || 0
    if (count === 0) return '#2a3142'
    const intensity = Math.pow(count / maxAttacks, 0.5)
    const r = Math.round(80 + intensity * 175)
    const g = Math.round(30 - intensity * 30)
    const b = Math.round(30 - intensity * 30)
    return `rgb(${r},${g},${b})`
  }

  const getCentroid = (feature) => {
    try {
      return pathGen.centroid(feature)
    } catch {
      return [0, 0]
    }
  }

  if (!countries) {
    return (
      <div className="card bg-base-200 shadow">
        <div className="card-body p-4">
          <h2 className="card-title text-base">Attack Origins</h2>
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body p-4">
        <h2 className="card-title text-base">Attack Origins</h2>
        <div className="relative w-full overflow-hidden rounded-lg bg-base-300">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full"
          >
            {countries.features.map(country => {
              const numericId = String(country.id).padStart(3, '0')
              const code = ISO_NUM_TO_ALPHA2[numericId]
              const count = attacksByCode[code] || 0
              const centroid = getCentroid(country)
              const d = pathGen(country)
              if (!d) return null

              return (
                <g key={country.id}>
                  <path
                    d={d}
                    fill={getColor(country.id)}
                    stroke="#1a1f2e"
                    strokeWidth="0.5"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={(e) => setTooltip({
                      x: e.clientX,
                      y: e.clientY,
                      code: code || '??',
                      count
                    })}
                    onMouseMove={(e) => setTooltip(prev =>
                      prev ? { ...prev, x: e.clientX, y: e.clientY } : null
                    )}
                    onMouseLeave={() => setTooltip(null)}
                  />
                  {count > 0 && centroid[0] && centroid[1] && (
                    <text
                      x={centroid[0]}
                      y={centroid[1]}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="8"
                      fill="white"
                      opacity="0.9"
                      style={{ pointerEvents: 'none', fontWeight: 'bold' }}
                    >
                      {count}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {tooltip && (
            <div
              className="fixed z-50 bg-base-100 border border-base-300 rounded px-3 py-1 text-sm pointer-events-none shadow"
              style={{ left: tooltip.x + 12, top: tooltip.y - 30 }}
            >
              <span className="font-bold">{tooltip.code}</span>
              {' — '}
              <span>{tooltip.count} attack{tooltip.count !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(attacksByCode)
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