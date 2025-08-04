import type { SVGProps } from "react";

export function ManvaasamLogo(props: SVGProps<SVGSVGElement>) {
  const { width = 32, height = 32, ...rest } = props;
  return (
    <svg
      viewBox="0 0 200 200"
      width={width}
      height={height}
      {...rest}
      className="drop-shadow-lg"
    >
      {/* Background circle */}
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="url(#gradient)"
        stroke="#22c55e"
        strokeWidth="2"
      />
      {/* Sky gradient */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="60%" stopColor="#98FB98" />
          <stop offset="100%" stopColor="#90EE90" />
        </linearGradient>

        {/* Sun rays */}
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </radialGradient>

        {/* Truck gradient */}
        <linearGradient id="truck" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2F4F4F" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>

        {/* Produce gradients */}
        <linearGradient id="tomatoes" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF6347" />
          <stop offset="100%" stopColor="#DC143C" />
        </linearGradient>

        <linearGradient id="greens" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#32CD32" />
          <stop offset="100%" stopColor="#228B22" />
        </linearGradient>
      </defs>
      {/* Sun with rays */}
      <circle cx="150" cy="40" r="15" fill="url(#sun)" />
      <g stroke="#FFD700" strokeWidth="1" opacity="0.6">
        <line x1="150" y1="25" x2="150" y2="15" />
        <line x1="150" y1="55" x2="150" y2="65" />
        <line x1="135" y1="40" x2="125" y2="40" />
        <line x1="165" y1="40" x2="175" y2="40" />
        <line x1="140" y1="30" x2="130" y2="20" />
        <line x1="160" y1="30" x2="170" y2="20" />
        <line x1="140" y1="50" x2="130" y2="60" />
        <line x1="160" y1="50" x2="170" y2="60" />
      </g>
      {/* Rolling hills */}
      <path
        d="M 0 120 Q 50 100 100 120 Q 150 140 200 120 L 200 200 L 0 200 Z"
        fill="#228B22"
      />
      <path
        d="M 0 130 Q 30 110 60 130 Q 90 150 120 130 Q 150 110 180 130 L 180 200 L 0 200 Z"
        fill="#32CD32"
      />
      {/* Green fields */}
      <rect x="20" y="110" width="160" height="40" fill="#90EE90" />
      {/* Truck body */}
      <rect x="120" y="130" width="60" height="25" fill="url(#truck)" rx="3" />
      <rect x="110" y="140" width="80" height="15" fill="url(#truck)" rx="2" />
      {/* Truck wheels */}
      <circle cx="125" cy="155" r="5" fill="#333" />
      <circle cx="175" cy="155" r="5" fill="#333" />
      {/* Produce in truck */}
      {/* Tomatoes */}
      <circle cx="135" cy="145" r="4" fill="url(#tomatoes)" />
      <circle cx="145" cy="142" r="3.5" fill="url(#tomatoes)" />
      <circle cx="155" cy="145" r="4" fill="url(#tomatoes)" />
      <circle cx="165" cy="143" r="3.5" fill="url(#tomatoes)" />
      {/* Green vegetables */}
      <ellipse cx="130" cy="150" rx="3" ry="6" fill="url(#greens)" />
      <ellipse cx="140" cy="148" rx="2.5" ry="5" fill="url(#greens)" />
      <ellipse cx="150" cy="150" rx="3" ry="6" fill="url(#greens)" />
      <ellipse cx="160" cy="148" rx="2.5" ry="5" fill="url(#greens)" />
      {/* Farmer by truck */}
      <circle cx="185" cy="145" r="6" fill="#DEB887" /> {/* Head */}
      <rect x="180" y="151" width="10" height="12" fill="#4169E1" />{" "}
      {/* Body */}
      <rect x="178" y="163" width="4" height="8" fill="#8B4513" /> {/* Legs */}
      <rect x="188" y="163" width="4" height="8" fill="#8B4513" />
      {/* Farmer in field */}
      <circle cx="35" cy="135" r="5" fill="#DEB887" /> {/* Head */}
      <rect x="32" y="140" width="6" height="10" fill="#F5DEB3" /> {/* Body */}
      <rect x="30" y="150" width="3" height="6" fill="#8B4513" /> {/* Legs */}
      <rect x="37" y="150" width="3" height="6" fill="#8B4513" />
      {/* Harvest bag */}
      <ellipse cx="25" cy="145" rx="8" ry="5" fill="#8B4513" />
      <circle cx="20" cy="143" r="2" fill="url(#tomatoes)" />
      <circle cx="25" cy="142" r="1.5" fill="url(#tomatoes)" />
      <circle cx="30" cy="144" r="2" fill="url(#tomatoes)" />
      {/* Power lines */}
      <line x1="40" y1="80" x2="160" y2="80" stroke="#696969" strokeWidth="1" />
      <line x1="60" y1="80" x2="60" y2="110" stroke="#696969" strokeWidth="1" />
      <line
        x1="140"
        y1="80"
        x2="140"
        y2="110"
        stroke="#696969"
        strokeWidth="1"
      />
      {/* Trees */}
      <circle cx="50" cy="100" r="8" fill="#228B22" />
      <circle cx="150" cy="95" r="6" fill="#228B22" />
      <rect x="48" y="108" width="4" height="8" fill="#8B4513" />
      <rect x="148" y="101" width="3" height="6" fill="#8B4513" />
      {/* Road/path */}
      <path
        d="M 30 120 Q 60 115 90 120 Q 120 125 150 120 Q 180 115 200 120"
        stroke="#F5F5DC"
        strokeWidth="3"
        fill="none"
      />
      {/* Manvaasam text */}
      <text
        x="100"
        y="25"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill="#000000"
      >
        <tspan x="100" dy="0">
          Manvaa
        </tspan>
        <tspan x="100" dy="0" fill="#22c55e">
          sam
        </tspan>
      </text>
    </svg>
  );
}
