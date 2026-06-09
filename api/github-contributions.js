const GITHUB_USERNAME = 'intrepidcanadian'
const YEARS = [2026, 2025, 2024, 2023]

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200')
  res.setHeader('Access-Control-Allow-Origin', process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '*')

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'Server misconfigured' })
  }

  try {
    const results = await Promise.all(YEARS.map(year => fetchYear(token, year)))
    return res.status(200).json(results)
  } catch (err) {
    return res.status(502).json({ error: 'Failed to fetch GitHub data' })
  }
}

async function fetchYear(token, year) {
  const from = `${year}-01-01T00:00:00Z`
  const to = `${year}-12-31T23:59:59Z`

  const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        contributionsCollection(from: "${from}", to: "${to}") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `

  const resp = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  if (!resp.ok) throw new Error(`GitHub API ${resp.status}`)

  const json = await resp.json()
  const cal = json.data.user.contributionsCollection.contributionCalendar

  const levelMap = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  }

  const days = cal.weeks.flatMap(w =>
    w.contributionDays.map(d => ({
      date: d.date,
      level: levelMap[d.contributionLevel] ?? 0,
    }))
  )

  return { year, total: cal.totalContributions, days }
}
