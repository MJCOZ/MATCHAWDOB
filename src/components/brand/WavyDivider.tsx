interface WavyDividerProps {
  color?: string;
  flip?: boolean;
  className?: string;
  height?: number;
}

export function WavyDivider({ color = "#B2DE81", flip = false, className = "", height = 60 }: WavyDividerProps) {
  return (
    <div className={`w-full overflow-hidden leading-none ${className}`} style={{ height }}>
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ transform: flip ? "scaleY(-1)" : "none" }}
      >
        <path
          d="M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1380,15 1440,30 L1440,60 L0,60 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

export function WavyDividerDouble({ topColor = "#F8F7FF", bottomColor = "#261B6D", className = "" }: {
  topColor?: string;
  bottomColor?: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height: 80 }}>
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill={bottomColor}
        />
        <path
          d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,0 L0,0 Z"
          fill={topColor}
        />
      </svg>
    </div>
  );
}

export function StarSparkles({ count = 5, className = "" }: { count?: number; className?: string }) {
  const positions = [
    { x: "5%", y: "20%", size: "text-xl", delay: "0s" },
    { x: "15%", y: "70%", size: "text-base", delay: "0.4s" },
    { x: "80%", y: "15%", size: "text-2xl", delay: "0.8s" },
    { x: "90%", y: "65%", size: "text-lg", delay: "1.2s" },
    { x: "50%", y: "85%", size: "text-base", delay: "0.6s" },
    { x: "35%", y: "10%", size: "text-sm", delay: "1s" },
    { x: "70%", y: "80%", size: "text-xl", delay: "0.3s" },
  ].slice(0, count);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {positions.map((pos, i) => (
        <span
          key={i}
          className="absolute text-[#B2DE81] animate-sparkle select-none"
          style={{
            left: pos.x,
            top: pos.y,
            fontSize: pos.size === "text-xl" ? "1.4rem" : pos.size === "text-2xl" ? "1.7rem" : pos.size === "text-base" ? "1rem" : "0.85rem",
            animationDelay: pos.delay,
            opacity: 0.7,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
