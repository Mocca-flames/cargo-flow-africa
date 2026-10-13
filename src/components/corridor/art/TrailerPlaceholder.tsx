// Frame: viewBox -200 -100 1900 500, faces +x, kingpin pivot (1300,150). Swap this whole <g> for the Gemini SVG.

export function TrailerArt() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="10 0 1400 300">
  <defs>
    <linearGradient id="tarp-base" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#14392F"/>
      <stop offset="15%" stopColor="#1B4A3D"/>
      <stop offset="50%" stopColor="#14392F"/>
      <stop offset="85%" stopColor="#0E2821"/>
      <stop offset="100%" stopColor="#091A15"/>
    </linearGradient>

    <radialGradient id="tarp-crown" cx="40%" cy="40%" r="70%" fx="30%" fy="30%">
      <stop offset="0%" stopColor="#246150" stopOpacity="0.6"/>
      <stop offset="50%" stopColor="#14392F" stopOpacity="0"/>
    </radialGradient>

    <linearGradient id="gold-rail" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFF3A1"/>
      <stop offset="40%" stopColor="#D9A441"/>
      <stop offset="60%" stopColor="#D9A441"/>
      <stop offset="100%" stopColor="#936D21"/>
    </linearGradient>

    <linearGradient id="metal-strap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#999"/>
      <stop offset="50%" stopColor="#FFF"/>
      <stop offset="100%" stopColor="#666"/>
    </linearGradient>

    <linearGradient id="ratchet-metal" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#E8EDF0"/>
      <stop offset="50%" stopColor="#9AA3A6"/>
      <stop offset="100%" stopColor="#4F5658"/>
    </linearGradient>

    <pattern id="deck-boards" width="10" height="25" patternUnits="userSpaceOnUse">
      <rect width="10" height="25" fill="#443D38"/>
      <line x1="0" y1="24" x2="10" y2="24" stroke="#221E1B" strokeWidth="1.5"/>
      <line x1="0" y1="25" x2="10" y2="25" stroke="#5A514B" strokeWidth="0.5"/>
    </pattern>

    <pattern id="chevron" width="12" height="12" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <rect width="6" height="12" fill="#C8352B"/>
      <rect x="6" width="6" height="12" fill="#EEEEEE"/>
    </pattern>

    <radialGradient id="tire-overlay" cx="50%" cy="50%" r="50%">
      <stop offset="60%" stopColor="#000" stopOpacity="0"/>
      <stop offset="95%" stopColor="#000" stopOpacity="0.6"/>
      <stop offset="100%" stopColor="#000" stopOpacity="0.9"/>
    </radialGradient>
    
    <linearGradient id="tire-cylinder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#000" stopOpacity="0.7"/>
      <stop offset="15%" stopColor="#000" stopOpacity="0"/>
      <stop offset="85%" stopColor="#000" stopOpacity="0"/>
      <stop offset="100%" stopColor="#000" stopOpacity="0.7"/>
    </linearGradient>

    <radialGradient id="red-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FF4444" stopOpacity="1"/>
      <stop offset="40%" stopColor="#C8352B" stopOpacity="0.8"/>
      <stop offset="100%" stopColor="#550000" stopOpacity="0"/>
    </radialGradient>
    
    <radialGradient id="amber-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFDD55" stopOpacity="1"/>
      <stop offset="50%" stopColor="#F2A91B" stopOpacity="0.8"/>
      <stop offset="100%" stopColor="#664400" stopOpacity="0"/>
    </radialGradient>
  </defs>

  {/* Shadows */}
  <g id="cfl-shadow">
    <rect x="50" y="35" width="1340" height="230" rx="10" fill="#000" opacity="0.3"/>
    <rect x="270" y="55" width="935" height="220" rx="20" fill="#000" opacity="0.25"/>
    <rect x="280" y="65" width="920" height="215" rx="15" fill="#000" opacity="0.15"/>
    <rect x="130" y="10" width="320" height="280" rx="15" fill="#000" opacity="0.35"/>
    <rect x="500" y="10" width="400" height="30" rx="5" fill="#000" opacity="0.2"/>
  </g>

  {/* Underframe & Attachments */}
  <g id="cfl-underframe">
    <rect x="30" y="100" width="1370" height="10" fill="#1E2326"/>
    <rect x="30" y="190" width="1370" height="10" fill="#1E2326"/>
    
    <rect x="500" y="8" width="400" height="17" rx="3" fill="#1A1D20" stroke="#0C0E10" strokeWidth="1.5"/>
    <line x1="633" y1="8" x2="633" y2="25" stroke="#0C0E10" strokeWidth="2"/>
    <line x1="766" y1="8" x2="766" y2="25" stroke="#0C0E10" strokeWidth="2"/>
    <rect x="510" y="10" width="20" height="4" rx="1" fill="#333"/>
    <rect x="643" y="10" width="20" height="4" rx="1" fill="#333"/>
    <rect x="776" y="10" width="20" height="4" rx="1" fill="#333"/>

    <rect x="600" y="275" width="110" height="17" fill="#1A1D20" stroke="#0C0E10" strokeWidth="1.5"/>
    <rect x="605" y="276" width="100" height="14" rx="4" fill="#15171A"/>
    <line x1="610" y1="283" x2="700" y2="283" stroke="#080A0B" strokeWidth="3" strokeDasharray="6 4"/>
    <line x1="655" y1="275" x2="655" y2="292" stroke="#9AA3A6" strokeWidth="2"/>
  </g>

  {/* Wheels */}
  <g id="cfl-wheels-l1" data-cx="190" data-cy="47.5">
    <rect x="137.5" y="15" width="105" height="31" rx="5" fill="#15171A"/>
    <rect x="137.5" y="49" width="105" height="31" rx="5" fill="#15171A"/>
    <g className="tread">
      <line x1="140" y1="21" x2="240" y2="21" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="140" y1="30.5" x2="240" y2="30.5" stroke="#080A0B" strokeWidth="6" strokeDasharray="8 4"/>
      <line x1="140" y1="40" x2="240" y2="40" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="140" y1="55" x2="240" y2="55" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="140" y1="64.5" x2="240" y2="64.5" stroke="#080A0B" strokeWidth="6" strokeDasharray="8 4"/>
      <line x1="140" y1="74" x2="240" y2="74" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
    </g>
    <rect x="137.5" y="15" width="105" height="31" rx="5" fill="url(#tire-overlay)" pointerEvents="none"/>
    <rect x="137.5" y="49" width="105" height="31" rx="5" fill="url(#tire-overlay)" pointerEvents="none"/>
    <rect x="137.5" y="15" width="105" height="31" rx="5" fill="url(#tire-cylinder)" pointerEvents="none"/>
    <rect x="137.5" y="49" width="105" height="31" rx="5" fill="url(#tire-cylinder)" pointerEvents="none"/>
  </g>
  <g id="cfl-wheels-r1" data-cx="190" data-cy="252.5">
    <rect x="137.5" y="220" width="105" height="31" rx="5" fill="#15171A"/>
    <rect x="137.5" y="254" width="105" height="31" rx="5" fill="#15171A"/>
    <g className="tread">
      <line x1="140" y1="226" x2="240" y2="226" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="140" y1="235.5" x2="240" y2="235.5" stroke="#080A0B" strokeWidth="6" strokeDasharray="8 4"/>
      <line x1="140" y1="245" x2="240" y2="245" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="140" y1="260" x2="240" y2="260" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="140" y1="269.5" x2="240" y2="269.5" stroke="#080A0B" strokeWidth="6" strokeDasharray="8 4"/>
      <line x1="140" y1="279" x2="240" y2="279" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
    </g>
    <rect x="137.5" y="220" width="105" height="31" rx="5" fill="url(#tire-overlay)" pointerEvents="none"/>
    <rect x="137.5" y="254" width="105" height="31" rx="5" fill="url(#tire-overlay)" pointerEvents="none"/>
    <rect x="137.5" y="220" width="105" height="31" rx="5" fill="url(#tire-cylinder)" pointerEvents="none"/>
    <rect x="137.5" y="254" width="105" height="31" rx="5" fill="url(#tire-cylinder)" pointerEvents="none"/>
  </g>

  <g id="cfl-wheels-l2" data-cx="290" data-cy="47.5">
    <rect x="237.5" y="15" width="105" height="31" rx="5" fill="#15171A"/>
    <rect x="237.5" y="49" width="105" height="31" rx="5" fill="#15171A"/>
    <g className="tread">
      <line x1="240" y1="21" x2="340" y2="21" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="240" y1="30.5" x2="340" y2="30.5" stroke="#080A0B" strokeWidth="6" strokeDasharray="8 4"/>
      <line x1="240" y1="40" x2="340" y2="40" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="240" y1="55" x2="340" y2="55" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="240" y1="64.5" x2="340" y2="64.5" stroke="#080A0B" strokeWidth="6" strokeDasharray="8 4"/>
      <line x1="240" y1="74" x2="340" y2="74" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
    </g>
    <rect x="237.5" y="15" width="105" height="31" rx="5" fill="url(#tire-overlay)" pointerEvents="none"/>
    <rect x="237.5" y="49" width="105" height="31" rx="5" fill="url(#tire-overlay)" pointerEvents="none"/>
    <rect x="237.5" y="15" width="105" height="31" rx="5" fill="url(#tire-cylinder)" pointerEvents="none"/>
    <rect x="237.5" y="49" width="105" height="31" rx="5" fill="url(#tire-cylinder)" pointerEvents="none"/>
  </g>
  <g id="cfl-wheels-r2" data-cx="290" data-cy="252.5">
    <rect x="237.5" y="220" width="105" height="31" rx="5" fill="#15171A"/>
    <rect x="237.5" y="254" width="105" height="31" rx="5" fill="#15171A"/>
    <g className="tread">
      <line x1="240" y1="226" x2="340" y2="226" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="240" y1="235.5" x2="340" y2="235.5" stroke="#080A0B" strokeWidth="6" strokeDasharray="8 4"/>
      <line x1="240" y1="245" x2="340" y2="245" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="240" y1="260" x2="340" y2="260" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="240" y1="269.5" x2="340" y2="269.5" stroke="#080A0B" strokeWidth="6" strokeDasharray="8 4"/>
      <line x1="240" y1="279" x2="340" y2="279" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
    </g>
    <rect x="237.5" y="220" width="105" height="31" rx="5" fill="url(#tire-overlay)" pointerEvents="none"/>
    <rect x="237.5" y="254" width="105" height="31" rx="5" fill="url(#tire-overlay)" pointerEvents="none"/>
    <rect x="237.5" y="220" width="105" height="31" rx="5" fill="url(#tire-cylinder)" pointerEvents="none"/>
    <rect x="237.5" y="254" width="105" height="31" rx="5" fill="url(#tire-cylinder)" pointerEvents="none"/>
  </g>

  <g id="cfl-wheels-l3" data-cx="390" data-cy="47.5">
    <rect x="337.5" y="15" width="105" height="31" rx="5" fill="#15171A"/>
    <rect x="337.5" y="49" width="105" height="31" rx="5" fill="#15171A"/>
    <g className="tread">
      <line x1="340" y1="21" x2="440" y2="21" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="340" y1="30.5" x2="440" y2="30.5" stroke="#080A0B" strokeWidth="6" strokeDasharray="8 4"/>
      <line x1="340" y1="40" x2="440" y2="40" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="340" y1="55" x2="440" y2="55" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="340" y1="64.5" x2="440" y2="64.5" stroke="#080A0B" strokeWidth="6" strokeDasharray="8 4"/>
      <line x1="340" y1="74" x2="440" y2="74" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
    </g>
    <rect x="337.5" y="15" width="105" height="31" rx="5" fill="url(#tire-overlay)" pointerEvents="none"/>
    <rect x="337.5" y="49" width="105" height="31" rx="5" fill="url(#tire-overlay)" pointerEvents="none"/>
    <rect x="337.5" y="15" width="105" height="31" rx="5" fill="url(#tire-cylinder)" pointerEvents="none"/>
    <rect x="337.5" y="49" width="105" height="31" rx="5" fill="url(#tire-cylinder)" pointerEvents="none"/>
  </g>
  <g id="cfl-wheels-r3" data-cx="390" data-cy="252.5">
    <rect x="337.5" y="220" width="105" height="31" rx="5" fill="#15171A"/>
    <rect x="337.5" y="254" width="105" height="31" rx="5" fill="#15171A"/>
    <g className="tread">
      <line x1="340" y1="226" x2="440" y2="226" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="340" y1="235.5" x2="440" y2="235.5" stroke="#080A0B" strokeWidth="6" strokeDasharray="8 4"/>
      <line x1="340" y1="245" x2="440" y2="245" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="340" y1="260" x2="440" y2="260" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
      <line x1="340" y1="269.5" x2="440" y2="269.5" stroke="#080A0B" strokeWidth="6" strokeDasharray="8 4"/>
      <line x1="340" y1="279" x2="440" y2="279" stroke="#080A0B" strokeWidth="4" strokeDasharray="6 4"/>
    </g>
    <rect x="337.5" y="220" width="105" height="31" rx="5" fill="url(#tire-overlay)" pointerEvents="none"/>
    <rect x="337.5" y="254" width="105" height="31" rx="5" fill="url(#tire-overlay)" pointerEvents="none"/>
    <rect x="337.5" y="220" width="105" height="31" rx="5" fill="url(#tire-cylinder)" pointerEvents="none"/>
    <rect x="337.5" y="254" width="105" height="31" rx="5" fill="url(#tire-cylinder)" pointerEvents="none"/>
  </g>

  {/* Mudguards */}
  <g id="cfl-mudguards">
    <rect x="130" y="10" width="120" height="15" rx="6" fill="#111315" stroke="#25292D" strokeWidth="1.5"/>
    <rect x="230" y="10" width="120" height="15" rx="6" fill="#111315" stroke="#25292D" strokeWidth="1.5"/>
    <rect x="330" y="10" width="120" height="15" rx="6" fill="#111315" stroke="#25292D" strokeWidth="1.5"/>
    <rect x="130" y="275" width="120" height="15" rx="6" fill="#111315" stroke="#25292D" strokeWidth="1.5"/>
    <rect x="230" y="275" width="120" height="15" rx="6" fill="#111315" stroke="#25292D" strokeWidth="1.5"/>
    <rect x="330" y="275" width="120" height="15" rx="6" fill="#111315" stroke="#25292D" strokeWidth="1.5"/>
  </g>

  {/* Main Deck Structure */}
  <g id="cfl-deck">
    <rect x="40" y="25" width="1360" height="250" fill="url(#deck-boards)"/>
    
    <rect x="40" y="25" width="1360" height="6" fill="url(#gold-rail)"/>
    <rect x="40" y="269" width="1360" height="6" fill="url(#gold-rail)"/>
    <line x1="40" y1="31" x2="1400" y2="31" stroke="#222" strokeWidth="1"/>
    <line x1="40" y1="269" x2="1400" y2="269" stroke="#222" strokeWidth="1"/>

    <g fill="#1E2326" stroke="#4A5458" strokeWidth="0.5">
      <rect x="100" y="26" width="6" height="4" rx="1"/><rect x="200" y="26" width="6" height="4" rx="1"/><rect x="300" y="26" width="6" height="4" rx="1"/><rect x="400" y="26" width="6" height="4" rx="1"/>
      <rect x="500" y="26" width="6" height="4" rx="1"/><rect x="600" y="26" width="6" height="4" rx="1"/><rect x="700" y="26" width="6" height="4" rx="1"/><rect x="800" y="26" width="6" height="4" rx="1"/>
      <rect x="900" y="26" width="6" height="4" rx="1"/><rect x="1000" y="26" width="6" height="4" rx="1"/><rect x="1100" y="26" width="6" height="4" rx="1"/><rect x="1200" y="26" width="6" height="4" rx="1"/><rect x="1300" y="26" width="6" height="4" rx="1"/>
      <rect x="100" y="270" width="6" height="4" rx="1"/><rect x="200" y="270" width="6" height="4" rx="1"/><rect x="300" y="270" width="6" height="4" rx="1"/><rect x="400" y="270" width="6" height="4" rx="1"/>
      <rect x="500" y="270" width="6" height="4" rx="1"/><rect x="600" y="270" width="6" height="4" rx="1"/><rect x="700" y="270" width="6" height="4" rx="1"/><rect x="800" y="270" width="6" height="4" rx="1"/>
      <rect x="900" y="270" width="6" height="4" rx="1"/><rect x="1000" y="270" width="6" height="4" rx="1"/><rect x="1100" y="270" width="6" height="4" rx="1"/><rect x="1200" y="270" width="6" height="4" rx="1"/><rect x="1300" y="270" width="6" height="4" rx="1"/>
    </g>

    <rect x="1390" y="25" width="10" height="250" fill="#2A3135" stroke="#111" strokeWidth="1.5"/>
    <line x1="1395" y1="25" x2="1395" y2="275" stroke="#4A5458" strokeWidth="1.5"/>
    
    <rect x="30" y="45" width="10" height="210" rx="3" fill="#1E2326"/>
    <line x1="35" y1="46" x2="35" y2="254" stroke="#4A5458" strokeWidth="1"/>
    
    <circle id="cfl-pivot" cx="1300" cy="150" r="2" fill="none"/>
  </g>

  {/* Landing Gear (Stowed/Driving State) */}
  <g id="cfl-landing-gear-up" opacity="0">
    <rect x="990" y="25" width="25" height="5" fill="#111"/>
    <rect x="990" y="270" width="25" height="5" fill="#111"/>
    <rect x="1000" y="30" width="5" height="240" fill="#1A2022"/>
  </g>

  {/* Landing Gear (Deployed/Parked State) */}
  <g id="cfl-landing-gear-down">
    <rect x="990" y="13" width="25" height="12" rx="2" fill="#1A2022" stroke="#000" strokeWidth="1"/>
    <rect x="990" y="275" width="25" height="12" rx="2" fill="#1A2022" stroke="#000" strokeWidth="1"/>
    <rect x="995" y="20" width="15" height="5" fill="#3A4347"/>
    <rect x="995" y="275" width="15" height="5" fill="#3A4347"/>
    <rect x="1000" y="25" width="5" height="250" fill="#1A2022"/>
  </g>

  {/* Tarped Load */}
  <g id="cfl-load">
    <rect x="260" y="40" width="940" height="220" rx="15" fill="url(#tarp-base)"/>
    <rect x="260" y="40" width="940" height="220" rx="15" fill="url(#tarp-crown)"/>
    
    <rect x="265" y="45" width="930" height="210" rx="12" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.1"/>
    
    <g fill="none" stroke="#FFFFFF" opacity="0.06" strokeWidth="6">
      <rect x="280" y="55" width="200" height="190" rx="8"/>
      <rect x="500" y="55" width="200" height="190" rx="8"/>
      <rect x="720" y="55" width="200" height="190" rx="8"/>
      <rect x="940" y="55" width="200" height="190" rx="8"/>
    </g>

    <g>
      <rect x="300" y="40" width="8" height="220" fill="#D9A441"/>
      <rect x="304" y="40" width="2" height="220" fill="#FFFFFF" opacity="0.3"/>
      <path d="M 298 38 L 310 38 L 310 45 L 298 45 Z" fill="#111"/>
      <path d="M 298 255 L 310 255 L 310 262 L 298 262 Z" fill="#111"/>
      <rect x="299" y="243" width="10" height="15" rx="2" fill="url(#ratchet-metal)"/>
      <circle cx="304" cy="250.5" r="2.5" fill="#111"/>
      <line x1="304" y1="260" x2="304" y2="269" stroke="#111" strokeWidth="2"/>

      <rect x="420" y="40" width="8" height="220" fill="#D9A441"/>
      <rect x="424" y="40" width="2" height="220" fill="#FFFFFF" opacity="0.3"/>
      <path d="M 418 38 L 430 38 L 430 45 L 418 45 Z" fill="#111"/>
      <path d="M 418 255 L 430 255 L 430 262 L 418 262 Z" fill="#111"/>
      <rect x="419" y="243" width="10" height="15" rx="2" fill="url(#ratchet-metal)"/>
      <circle cx="424" cy="250.5" r="2.5" fill="#111"/>
      <line x1="424" y1="260" x2="424" y2="269" stroke="#111" strokeWidth="2"/>

      <rect x="540" y="40" width="8" height="220" fill="#D9A441"/>
      <rect x="544" y="40" width="2" height="220" fill="#FFFFFF" opacity="0.3"/>
      <path d="M 538 38 L 550 38 L 550 45 L 538 45 Z" fill="#111"/>
      <path d="M 538 255 L 550 255 L 550 262 L 538 262 Z" fill="#111"/>
      <rect x="539" y="243" width="10" height="15" rx="2" fill="url(#ratchet-metal)"/>
      <circle cx="544" cy="250.5" r="2.5" fill="#111"/>
      <line x1="544" y1="260" x2="544" y2="269" stroke="#111" strokeWidth="2"/>

      <rect x="660" y="40" width="8" height="220" fill="#D9A441"/>
      <rect x="664" y="40" width="2" height="220" fill="#FFFFFF" opacity="0.3"/>
      <path d="M 658 38 L 670 38 L 670 45 L 658 45 Z" fill="#111"/>
      <path d="M 658 255 L 670 255 L 670 262 L 658 262 Z" fill="#111"/>
      <rect x="659" y="243" width="10" height="15" rx="2" fill="url(#ratchet-metal)"/>
      <circle cx="664" cy="250.5" r="2.5" fill="#111"/>
      <line x1="664" y1="260" x2="664" y2="269" stroke="#111" strokeWidth="2"/>

      <rect x="780" y="40" width="8" height="220" fill="#D9A441"/>
      <rect x="784" y="40" width="2" height="220" fill="#FFFFFF" opacity="0.3"/>
      <path d="M 778 38 L 790 38 L 790 45 L 778 45 Z" fill="#111"/>
      <path d="M 778 255 L 790 255 L 790 262 L 778 262 Z" fill="#111"/>
      <rect x="779" y="243" width="10" height="15" rx="2" fill="url(#ratchet-metal)"/>
      <circle cx="784" cy="250.5" r="2.5" fill="#111"/>
      <line x1="784" y1="260" x2="784" y2="269" stroke="#111" strokeWidth="2"/>

      <rect x="900" y="40" width="8" height="220" fill="#D9A441"/>
      <rect x="904" y="40" width="2" height="220" fill="#FFFFFF" opacity="0.3"/>
      <path d="M 898 38 L 910 38 L 910 45 L 898 45 Z" fill="#111"/>
      <path d="M 898 255 L 910 255 L 910 262 L 898 262 Z" fill="#111"/>
      <rect x="899" y="243" width="10" height="15" rx="2" fill="url(#ratchet-metal)"/>
      <circle cx="904" cy="250.5" r="2.5" fill="#111"/>
      <line x1="904" y1="260" x2="904" y2="269" stroke="#111" strokeWidth="2"/>

      <rect x="1020" y="40" width="8" height="220" fill="#D9A441"/>
      <rect x="1024" y="40" width="2" height="220" fill="#FFFFFF" opacity="0.3"/>
      <path d="M 1018 38 L 1030 38 L 1030 45 L 1018 45 Z" fill="#111"/>
      <path d="M 1018 255 L 1030 255 L 1030 262 L 1018 262 Z" fill="#111"/>
      <rect x="1019" y="243" width="10" height="15" rx="2" fill="url(#ratchet-metal)"/>
      <circle cx="1024" cy="250.5" r="2.5" fill="#111"/>
      <line x1="1024" y1="260" x2="1024" y2="269" stroke="#111" strokeWidth="2"/>

      <rect x="1140" y="40" width="8" height="220" fill="#D9A441"/>
      <rect x="1144" y="40" width="2" height="220" fill="#FFFFFF" opacity="0.3"/>
      <path d="M 1138 38 L 1150 38 L 1150 45 L 1138 45 Z" fill="#111"/>
      <path d="M 1138 255 L 1150 255 L 1150 262 L 1138 262 Z" fill="#111"/>
      <rect x="1139" y="243" width="10" height="15" rx="2" fill="url(#ratchet-metal)"/>
      <circle cx="1144" cy="250.5" r="2.5" fill="#111"/>
      <line x1="1144" y1="260" x2="1144" y2="269" stroke="#111" strokeWidth="2"/>
    </g>
  </g>

  {/* Security Seal Tag */}
  <g id="cfl-seal-tag">
    <rect x="309" y="246" width="16" height="8" rx="1.5" fill="#C8352B"/>
    <path d="M 309 250 C 304 250 304 238 309 238 C 314 238 314 246 309 246" fill="none" stroke="#666" strokeWidth="1.2"/>
    <text x="317" y="252" fontFamily="monospace, sans-serif" fontSize="5" fontWeight="bold" fill="#FFF" textAnchor="middle">0142</text>
  </g>

  {/* Branding */}
  <g id="cfl-brand">
    <text x="760" y="152" fontFamily="Inter, Arial, sans-serif" fontSize="28" fontWeight="900" fill="#F4EEE3" textAnchor="middle" dominantBaseline="middle" letterSpacing="4">CARGO FLOW AFRICA</text>
    {/* Gold chevrons moved left of the wordmark, separated */}
    <polygon points="620,142 635,127 643,127 628,142 643,157 635,157" fill="#D9A441"/>
    <polygon points="635,142 650,127 658,127 643,142 658,157 650,157" fill="#D9A441"/>
  </g>

  {/* Side Marker Lights & Reflectors */}
  <g id="cfl-marker-lights">
    <rect x="200" y="25" width="8" height="4" rx="1" fill="#F2A91B"/>
    <rect x="400" y="25" width="8" height="4" rx="1" fill="#F2A91B"/>
    <rect x="600" y="25" width="8" height="4" rx="1" fill="#F2A91B"/>
    <rect x="800" y="25" width="8" height="4" rx="1" fill="#F2A91B"/>
    <rect x="1000" y="25" width="8" height="4" rx="1" fill="#F2A91B"/>
    <rect x="1200" y="25" width="8" height="4" rx="1" fill="#F2A91B"/>
    
    <rect x="200" y="271" width="8" height="4" rx="1" fill="#F2A91B"/>
    <rect x="400" y="271" width="8" height="4" rx="1" fill="#F2A91B"/>
    <rect x="600" y="271" width="8" height="4" rx="1" fill="#F2A91B"/>
    <rect x="800" y="271" width="8" height="4" rx="1" fill="#F2A91B"/>
    <rect x="1000" y="271" width="8" height="4" rx="1" fill="#F2A91B"/>
    <rect x="1200" y="271" width="8" height="4" rx="1" fill="#F2A91B"/>

    <rect x="30" y="70" width="4" height="160" fill="url(#chevron)"/>
  </g>

  {/* Rear Light Clusters */}
  <g id="cfl-lights-rear">
    <rect x="25" y="48" width="15" height="45" rx="2" fill="#15191B" stroke="#000" strokeWidth="1"/>
    <rect x="25" y="207" width="15" height="45" rx="2" fill="#15191B" stroke="#000" strokeWidth="1"/>
    
    <rect x="28" y="52" width="6" height="15" rx="1" fill="#C8352B"/>
    <rect x="28" y="73" width="6" height="15" rx="1" fill="#C8352B"/>
    <rect x="28" y="211" width="6" height="15" rx="1" fill="#C8352B"/>
    <rect x="28" y="232" width="6" height="15" rx="1" fill="#C8352B"/>
    
    <rect x="28" y="69" width="6" height="3" fill="#F2A91B"/>
    <rect x="28" y="228" width="6" height="3" fill="#F2A91B"/>
    
    <rect x="28" y="130" width="10" height="40" rx="1" fill="#E8EDF0"/>
    <text x="35" y="150" fontFamily="monospace" fontSize="6" fontWeight="bold" fill="#111" transform="rotate(-90 35,150)" textAnchor="middle">CF-2024</text>
  </g>

  {/* Hazard / Indicator Corner Lights */}
  <g id="cfl-lights-hazard">
    <rect x="1395" y="23" width="6" height="6" rx="2" fill="#F2A91B"/>
    <rect x="1395" y="271" width="6" height="6" rx="2" fill="#F2A91B"/>
    <rect x="38" y="23" width="6" height="6" rx="2" fill="#F2A91B"/>
    <rect x="38" y="271" width="6" height="6" rx="2" fill="#F2A91B"/>
  </g>

  {/* Brake Light Glows */}
  <g id="cfl-lights-brake" opacity="0">
    <circle cx="28" cy="59" r="18" fill="url(#red-glow)"/>
    <circle cx="28" cy="80" r="18" fill="url(#red-glow)"/>
    <circle cx="28" cy="218" r="18" fill="url(#red-glow)"/>
    <circle cx="28" cy="239" r="18" fill="url(#red-glow)"/>
  </g>
</svg>
  );
}
