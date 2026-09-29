import { ImageResponse } from 'next/og'

const LEAF =
  'M32 2l5.5 11.5 6-3-2.5 14.5 9-9.5 2 6 10-2-4 11 5 3-15.5 12.5 2 6-15.5-2.5V62h-4V49.5L14.5 52l2-6L1 33.5l5-3-4-11 10 2 2-6 9 9.5L20.5 10.5l6 3z'

/** Image de partage (Facebook, WhatsApp, X…) générée aux couleurs de MKMI : /api/og?title=…&eyebrow=… */
export function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const title = (params.get('title') || 'Une famille. Une foi. Une mission.').slice(0, 90)
  const eyebrow = (params.get('eyebrow') || 'MKMI Québec').slice(0, 40)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          color: 'white',
          background: 'radial-gradient(circle at 85% 10%, rgba(245,191,79,.35), transparent 45%), linear-gradient(135deg, #0b1628 0%, #070f1d 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="#f5bf4f">
            <path d={LEAF} />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontSize: 44, fontWeight: 800 }}>MKMI</span>
            <span style={{ fontSize: 16, letterSpacing: 8 }}>QUÉBEC</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, letterSpacing: 4, color: '#f8d27f' }}>
            <div style={{ width: 48, height: 4, background: '#f5bf4f', borderRadius: 4 }} />
            {eyebrow.toUpperCase()}
          </div>
          <div style={{ marginTop: 20, fontSize: title.length > 40 ? 64 : 80, fontWeight: 800, lineHeight: 1.05, maxWidth: 1000 }}>
            {title}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,.7)' }}>Église chrétienne · Québec (Charlesbourg)</div>
      </div>
    ),
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=86400, immutable' } },
  )
}
