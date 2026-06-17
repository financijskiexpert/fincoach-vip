export default function PdfBookMockup() {
  return (
    <div className="flex justify-center items-center py-4">
      {/* 3D book effect with CSS */}
      <div className="relative" style={{ perspective: '800px' }}>
        <div
          className="relative"
          style={{
            width: '200px',
            height: '270px',
            transformStyle: 'preserve-3d',
            transform: 'rotateY(-25deg) rotateX(5deg)',
            filter: 'drop-shadow(-20px 20px 40px rgba(0,0,0,0.6))',
          }}
        >
          {/* Book front cover */}
          <div
            className="absolute inset-0 rounded-r-md overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Orange circle accent top-left */}
            <div
              className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-80"
              style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}
            />
            {/* Orange circle accent top-right */}
            <div
              className="absolute -top-8 right-4 w-24 h-24 rounded-full opacity-60"
              style={{ background: 'linear-gradient(135deg, #e84545, #f7931e)' }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full p-4">
              {/* Title */}
              <div className="mt-6">
                <p
                  className="font-black leading-tight text-center"
                  style={{ fontSize: '13px', color: '#f7931e', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                >
                  Savjeti i tehnike za
                </p>
                <p
                  className="font-black leading-tight text-center"
                  style={{ fontSize: '13px', color: '#f7931e', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                >
                  financijsku
                </p>
                <p
                  className="font-black leading-tight text-center"
                  style={{ fontSize: '13px', color: '#f7931e', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                >
                  stabilnost
                </p>
              </div>

              {/* Author photo circle */}
              <div className="flex-1 flex items-center justify-center my-2">
                <div
                  className="rounded-full overflow-hidden border-2 border-white/20"
                  style={{ width: '90px', height: '90px' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/brane-portrait.jpg"
                    alt="Brane Recek"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                  />
                </div>
              </div>

              {/* Icons row */}
              <div className="flex justify-around mb-2 opacity-60">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f7931e" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f7931e" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
              </div>

              {/* Author name */}
              <div
                className="text-center font-semibold text-white pb-1"
                style={{ fontSize: '10px', letterSpacing: '1px' }}
              >
                Brane Recek
              </div>
            </div>
          </div>

          {/* Book spine (left side) */}
          <div
            className="absolute top-0 left-0 h-full rounded-l-sm"
            style={{
              width: '18px',
              background: 'linear-gradient(to right, #0a0a1a, #1a1a2e)',
              transform: 'rotateY(90deg) translateZ(-9px) translateX(-9px)',
              transformOrigin: 'left center',
            }}
          />

          {/* Book pages (right side — white stack effect) */}
          <div
            className="absolute top-1 right-0 bottom-1"
            style={{
              width: '6px',
              background: 'repeating-linear-gradient(to bottom, #e8e8e8 0px, #e8e8e8 1px, #d0d0d0 1px, #d0d0d0 2px)',
              borderRadius: '0 2px 2px 0',
              transform: 'translateX(4px)',
            }}
          />
        </div>

        {/* Reflection / shadow on ground */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: '160px',
            height: '20px',
            background: 'radial-gradient(ellipse, rgba(212,175,55,0.15) 0%, transparent 70%)',
            transform: 'translateY(10px)',
            filter: 'blur(6px)',
          }}
        />

        {/* FREE badge */}
        <div
          className="absolute -top-3 -right-3 rounded-full flex items-center justify-center font-black text-navy"
          style={{
            width: '52px',
            height: '52px',
            background: 'linear-gradient(135deg, #D4AF37, #f0d060)',
            fontSize: '11px',
            boxShadow: '0 4px 12px rgba(212,175,55,0.4)',
            zIndex: 20,
          }}
        >
          FREE
        </div>
      </div>
    </div>
  )
}
