import './Wheel.css';

export default function Wheel({ options, rotation, isSpinning, onSpin }) {
  const size = 400;
  const center = size / 2;
  const radius = center - 12;
  const count = options.length;

  // Kutupsal koordinatları Kartezyen (x, y) koordinatlarına çevirir (0° = üst merkez)
  const polarToCartesian = (cx, cy, r, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  // SVG dilim yolu (Path) oluşturur
  const createSlicePath = (index, total) => {
    const sliceAngle = 360 / total;
    const startAngle = index * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = sliceAngle <= 180 ? '0' : '1';

    return [
      'M', center, center,
      'L', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'Z',
    ].join(' ');
  };

  const truncateText = (text, maxLength = 18) => {
    return text.length > maxLength ? text.slice(0, maxLength - 1) + '…' : text;
  };

  return (
    <div className="wheel-wrapper">
      <div className="wheel-stage">
        {/* Sabit Üst İbre */}
        <div className="wheel-pointer" aria-hidden="true">
          <svg width="36" height="42" viewBox="0 0 36 42" fill="none">
            <path
              d="M18 42L2.41154 12C-0.667657 6.06954 3.63574 0 10.3173 0H25.6827C32.3643 0 36.6677 6.06954 33.5885 12L18 42Z"
              fill="#F8FAFC"
            />
            <circle cx="18" cy="11" r="4" fill="#0B0F19" />
          </svg>
        </div>

        {/* Dönen SVG Çark */}
        <div
          className="wheel-rotator"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? 'transform 4.5s cubic-bezier(0.12, 0.85, 0.18, 1)'
              : 'none',
          }}
        >
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="wheel-svg"
            role="img"
            aria-label="Karar Çarkı"
          >
            {/* Dış Çerçeve Halkası */}
            <circle
              cx={center}
              cy={center}
              r={radius + 6}
              fill="#1E293B"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="4"
            />

            {count === 0 ? (
              <circle cx={center} cy={center} r={radius} fill="#334155" />
            ) : count === 1 ? (
              <g>
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill={options[0].color}
                />
                <text
                  x={center}
                  y={center - 50}
                  fill="#FFFFFF"
                  fontSize="16"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {truncateText(options[0].text)}
                </text>
              </g>
            ) : (
              options.map((opt, idx) => {
                const sliceAngle = 360 / count;
                const midAngle = idx * sliceAngle + sliceAngle / 2;

                return (
                  <g key={opt.id}>
                    <path
                      d={createSlicePath(idx, count)}
                      fill={opt.color}
                      stroke="#0B0F19"
                      strokeWidth="2.5"
                    />
                    <g
                      transform={`translate(${center}, ${center}) rotate(${midAngle - 90})`}
                    >
                      <text
                        x={radius * 0.62}
                        y="5"
                        fill="#FFFFFF"
                        fontSize={count > 10 ? '11' : '13.5'}
                        fontWeight="700"
                        textAnchor="middle"
                        className="slice-label"
                      >
                        {truncateText(opt.text, count > 10 ? 13 : 17)}
                      </text>
                    </g>
                  </g>
                );
              })
            )}
          </svg>
        </div>

        {/* Merkez Çevir Butonu */}
        <button
          type="button"
          className="spin-center-btn"
          onClick={onSpin}
          disabled={isSpinning || count < 2}
          title={count < 2 ? 'En az 2 seçenek eklemelisiniz' : 'Çarkı Çevir'}
        >
          {isSpinning ? '...' : 'ÇEVİR'}
        </button>
      </div>

      <button
        type="button"
        className="primary-spin-btn"
        onClick={onSpin}
        disabled={isSpinning || count < 2}
      >
        {isSpinning
          ? 'Kader Belirleniyor...'
          : count < 2
          ? 'En Az 2 Seçenek Ekleyin'
          : 'Çarkı Çevir'}
      </button>
    </div>
  );
}
