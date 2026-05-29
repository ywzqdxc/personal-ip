import { redirect } from 'next/navigation'
import { getTravelYear } from '@/lib/travel/api'
import { notFound } from 'next/navigation'
import BackButton from '@/components/travel/BackButton'

const C = {
  bg:    '#FDF6EE',
  text:  '#2E1A0E',
  brick: '#C45A30',
  peach: '#F5D0B8',
  muted: '#B07050',
  line:  '#E8C9B0',
}

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params
  const year = parseInt(yearStr, 10)
  const data = await getTravelYear(year)
  if (!data) notFound()

  // single trip → jump directly into the journal
  if (data.trips.length === 1) {
    redirect(`/travel/${year}/${data.trips[0].id}`)
  }

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      fontFamily: "'Barlow Condensed', sans-serif",
      paddingTop: 100,   /* 80px nav + 20px breathing room */
    }}>
      <BackButton />

      {/* header */}
      <div style={{ padding: '40px 48px 48px' }}>
        <h1 style={{
          fontSize: 80, fontWeight: 800, lineHeight: 1,
          letterSpacing: '-0.03em', color: C.text, margin: 0,
        }}>
          {year}
        </h1>
        <p style={{
          fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: C.muted, marginTop: 8,
          fontFamily: "'Barlow', sans-serif", fontWeight: 500,
        }}>
          {data.label}
        </p>
      </div>

      {/* trip cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 24, padding: '0 48px 80px',
      }}>
        {data.trips.map(trip => (
          <Link key={trip.id} href={`/travel/${year}/${trip.id}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div className="hover:-translate-y-1 hover:shadow-lg" style={{
              border: `1px solid ${C.line}`,
              borderRadius: 12, overflow: 'hidden',
              background: '#fff8f2',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
            >
              {/* cover */}
              <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                <img src={trip.coverImg} alt={trip.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(45,26,14,0.5) 0%, transparent 60%)',
                }} />
                <span style={{
                  position: 'absolute', bottom: 16, left: 20,
                  fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em',
                  color: '#FDF6EE', lineHeight: 1,
                }}>{trip.title}</span>
              </div>
              {/* meta */}
              <div style={{ padding: '16px 20px' }}>
                <p style={{
                  fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: C.muted, fontFamily: "'Barlow', sans-serif",
                  marginBottom: 6,
                }}>{trip.subtitle}</p>
                <p style={{
                  fontSize: 13, color: C.text, lineHeight: 1.6,
                  fontFamily: "'Barlow', sans-serif",
                }}>{trip.description}</p>
                <p style={{
                  fontSize: 11, color: C.brick, marginTop: 12,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  fontFamily: "'Barlow', sans-serif", fontWeight: 500,
                }}>
                  {trip.chapters.length} chapters →
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;500&display=swap');
      `}</style>
    </div>
  )
}
