'use client'

interface MikanCharacterProps {
  size?: number
  className?: string
}

export function MikanCharacter({ size = 100, className = '' }: MikanCharacterProps) {
  const scale = size / 100 // 基準サイズ100pxに対するスケール

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* みかんの本体 */}
      <div
        className="relative animate-mikan-bounce"
        style={{
          width: `${100 * scale}px`,
          height: `${90 * scale}px`,
        }}
      >
        <div
          className="absolute bg-orange-500 rounded-full"
          style={{
            width: `${100 * scale}px`,
            height: `${90 * scale}px`,
          }}
        >
          {/* 葉っぱ */}
          <div
            className="absolute bg-lime-600 rounded-tl-3xl rounded-br-3xl"
            style={{
              top: `${-12 * scale}px`,
              left: `${45 * scale}px`,
              width: `${25 * scale}px`,
              height: `${12 * scale}px`,
              transform: 'rotate(-10deg)',
            }}
          />

          {/* 顔 */}
          <div
            className="absolute flex justify-between"
            style={{
              top: `${30 * scale}px`,
              left: `${25 * scale}px`,
              width: `${50 * scale}px`,
            }}
          >
            {/* 左目 */}
            <div
              className="bg-orange-950 rounded-full"
              style={{
                width: `${10 * scale}px`,
                height: `${10 * scale}px`,
              }}
            />

            {/* 口 */}
            <div
              className="absolute border-b-[3px] border-orange-950 rounded-b-xl"
              style={{
                top: `${6 * scale}px`,
                left: `${18 * scale}px`,
                width: `${14 * scale}px`,
                height: `${7 * scale}px`,
              }}
            />

            {/* 右目 */}
            <div
              className="bg-orange-950 rounded-full"
              style={{
                width: `${10 * scale}px`,
                height: `${10 * scale}px`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 影 */}
      <div
        className="bg-black/10 rounded-full animate-mikan-shadow"
        style={{
          width: `${80 * scale}px`,
          height: `${12 * scale}px`,
          marginTop: `${10 * scale}px`,
        }}
      />

      <style jsx>{`
        @keyframes mikan-bounce {
          0% {
            transform: translateY(0) scale(1.1, 0.9);
          }
          100% {
            transform: translateY(-50px) scale(0.95, 1.05);
          }
        }

        @keyframes mikan-shadow {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(0.6);
            opacity: 0.2;
          }
        }

        .animate-mikan-bounce {
          animation: mikan-bounce 0.6s infinite alternate cubic-bezier(0.5, 0.05, 1, 0.5);
        }

        .animate-mikan-shadow {
          animation: mikan-shadow 0.6s infinite alternate cubic-bezier(0.5, 0.05, 1, 0.5);
        }
      `}</style>
    </div>
  )
}
