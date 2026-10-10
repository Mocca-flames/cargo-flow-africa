// Frame: viewBox 0 0 720 300, faces +x, fifth-wheel pivot (275,150). Swap this whole <g> for the Gemini SVG.

export function TractorArt() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 300">
  <defs>
    <linearGradient id="cab-base" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#14392F" stopOpacity="1" />
      <stop offset="40%" stopColor="#0e2a22" stopOpacity="1" />
      <stop offset="100%" stopColor="#081813" stopOpacity="1" />
    </linearGradient>

    <linearGradient id="cab-crown" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1c4d40" />
      <stop offset="50%" stopColor="#14392F" />
      <stop offset="100%" stopColor="#0a1f19" />
    </linearGradient>

    <radialGradient id="roof-highlight" cx="0.4" cy="0.4" r="0.6">
      <stop offset="0%" stopColor="#F4EEE3" stopOpacity="0.15" />
      <stop offset="100%" stopColor="#14392F" stopOpacity="0" />
    </radialGradient>

    <linearGradient id="steel-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#e0e5e7" />
      <stop offset="15%" stopColor="#9AA3A6" />
      <stop offset="50%" stopColor="#4a5255" />
      <stop offset="85%" stopColor="#9AA3A6" />
      <stop offset="100%" stopColor="#2a3032" />
    </linearGradient>

    <linearGradient id="steel-h" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#e0e5e7" />
      <stop offset="15%" stopColor="#9AA3A6" />
      <stop offset="50%" stopColor="#4a5255" />
      <stop offset="100%" stopColor="#2a3032" />
    </linearGradient>
    
    <linearGradient id="chassis-rail-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#3a4246" />
      <stop offset="100%" stopColor="#1E2326" />
    </linearGradient>
    
    <linearGradient id="chassis-rail-bot" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1E2326" />
      <stop offset="100%" stopColor="#0a0c0e" />
    </linearGradient>

    <linearGradient id="tyre-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#0a0c0e" />
      <stop offset="20%" stopColor="#15171A" />
      <stop offset="50%" stopColor="#2a2e33" />
      <stop offset="80%" stopColor="#15171A" />
      <stop offset="100%" stopColor="#0a0c0e" />
    </linearGradient>

    <radialGradient id="fifth-wheel-grad" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stopColor="#3a4246" />
      <stop offset="60%" stopColor="#1E2326" />
      <stop offset="100%" stopColor="#08090a" />
    </radialGradient>

    <linearGradient id="glass-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#2a383b" />
      <stop offset="30%" stopColor="#5E7479" />
      <stop offset="45%" stopColor="#8ba1a6" />
      <stop offset="50%" stopColor="#a8b9bd" />
      <stop offset="55%" stopColor="#5E7479" />
      <stop offset="100%" stopColor="#1e2527" />
    </linearGradient>

    <radialGradient id="amber-glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stopColor="#fff5cc" stopOpacity="1" />
      <stop offset="30%" stopColor="#F2A91B" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#F2A91B" stopOpacity="0" />
    </radialGradient>

    <radialGradient id="red-glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stopColor="#ffcccc" stopOpacity="1" />
      <stop offset="30%" stopColor="#C8352B" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#C8352B" stopOpacity="0" />
    </radialGradient>
    
    <linearGradient id="beam-grad-l" x1="0" y1="0" x2="1" y2="0.3">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
    </linearGradient>

    <linearGradient id="beam-grad-r" x1="0" y1="1" x2="1" y2="0.7">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
    </linearGradient>
  </defs>

  {/* SHADOWS */}
  <g id="cft-shadow">
    <path d="M 50 100 L 130 100 L 130 20 L 390 20 L 390 100 L 460 100 L 460 20 L 685 20 L 685 280 L 460 280 L 460 200 L 390 200 L 390 280 L 130 280 L 130 200 L 50 200 Z" fill="#000" opacity="0.1" transform="translate(12, 12)" />
    <path d="M 55 102 L 135 102 L 135 22 L 385 22 L 385 102 L 465 102 L 465 22 L 682 22 L 682 278 L 465 278 L 465 198 L 385 198 L 385 278 L 135 278 L 135 198 L 55 198 Z" fill="#000" opacity="0.15" transform="translate(6, 6)" />
    <path d="M 60 105 L 140 105 L 140 25 L 380 25 L 380 105 L 470 105 L 470 25 L 680 25 L 680 275 L 470 275 L 470 195 L 380 195 L 380 275 L 140 275 L 140 195 L 60 195 Z" fill="#000" opacity="0.2" transform="translate(2, 2)" />
  </g>

  {/* DRIVE WHEELS */}
  <g id="cft-wheel-drive-l1" data-cx="320" data-cy="57.5">
    <rect x="267.5" y="59" width="105" height="31" rx="6" fill="url(#tyre-grad)" />
    <g className="tread"><path d="M 280 74.5 L 360 74.5" stroke="#0a0c0e" strokeWidth="25" strokeDasharray="4 3" opacity="0.7" fill="none" /></g>
    <rect x="267.5" y="25" width="105" height="31" rx="6" fill="url(#tyre-grad)" />
    <g className="tread"><path d="M 280 40.5 L 360 40.5" stroke="#0a0c0e" strokeWidth="25" strokeDasharray="4 3" opacity="0.7" fill="none" /></g>
  </g>
  
  <g id="cft-wheel-drive-l2" data-cx="200" data-cy="57.5">
    <rect x="147.5" y="59" width="105" height="31" rx="6" fill="url(#tyre-grad)" />
    <g className="tread"><path d="M 160 74.5 L 240 74.5" stroke="#0a0c0e" strokeWidth="25" strokeDasharray="4 3" opacity="0.7" fill="none" /></g>
    <rect x="147.5" y="25" width="105" height="31" rx="6" fill="url(#tyre-grad)" />
    <g className="tread"><path d="M 160 40.5 L 240 40.5" stroke="#0a0c0e" strokeWidth="25" strokeDasharray="4 3" opacity="0.7" fill="none" /></g>
  </g>
  
  <g id="cft-wheel-drive-r1" data-cx="320" data-cy="242.5">
    <rect x="267.5" y="210" width="105" height="31" rx="6" fill="url(#tyre-grad)" />
    <g className="tread"><path d="M 280 225.5 L 360 225.5" stroke="#0a0c0e" strokeWidth="25" strokeDasharray="4 3" opacity="0.7" fill="none" /></g>
    <rect x="267.5" y="244" width="105" height="31" rx="6" fill="url(#tyre-grad)" />
    <g className="tread"><path d="M 280 259.5 L 360 259.5" stroke="#0a0c0e" strokeWidth="25" strokeDasharray="4 3" opacity="0.7" fill="none" /></g>
  </g>
  
  <g id="cft-wheel-drive-r2" data-cx="200" data-cy="242.5">
    <rect x="147.5" y="210" width="105" height="31" rx="6" fill="url(#tyre-grad)" />
    <g className="tread"><path d="M 160 225.5 L 240 225.5" stroke="#0a0c0e" strokeWidth="25" strokeDasharray="4 3" opacity="0.7" fill="none" /></g>
    <rect x="147.5" y="244" width="105" height="31" rx="6" fill="url(#tyre-grad)" />
    <g className="tread"><path d="M 160 259.5 L 240 259.5" stroke="#0a0c0e" strokeWidth="25" strokeDasharray="4 3" opacity="0.7" fill="none" /></g>
  </g>

  {/* FRONT WHEELS */}
  <g id="cft-wheel-fl" data-cx="560" data-cy="40.5" data-steer-pivot="560,40.5">
    <rect x="507.5" y="25" width="105" height="31" rx="6" fill="url(#tyre-grad)" />
    <g className="tread"><path d="M 520 40.5 L 600 40.5" stroke="#0a0c0e" strokeWidth="25" strokeDasharray="4 3" opacity="0.7" fill="none" /></g>
  </g>

  <g id="cft-wheel-fr" data-cx="560" data-cy="259.5" data-steer-pivot="560,259.5">
    <rect x="507.5" y="244" width="105" height="31" rx="6" fill="url(#tyre-grad)" />
    <g className="tread"><path d="M 520 259.5 L 600 259.5" stroke="#0a0c0e" strokeWidth="25" strokeDasharray="4 3" opacity="0.7" fill="none" /></g>
  </g>

  {/* CHASSIS */}
  <g id="cft-chassis">
    <rect x="360" y="125" width="80" height="50" rx="4" fill="#15181a" />
    <rect x="440" y="130" width="70" height="40" rx="4" fill="#1a1e21" />
    <rect x="200" y="145" width="160" height="10" fill="#22272a" />
    
    <rect x="60" y="105" width="460" height="12" fill="url(#chassis-rail-top)" />
    <path d="M 60 105 L 520 105" stroke="#505a5e" strokeWidth="1" opacity="0.5" />
    <rect x="60" y="183" width="460" height="12" fill="url(#chassis-rail-bot)" />
    <path d="M 60 183 L 520 183" stroke="#505a5e" strokeWidth="1" opacity="0.5" />
    
    <rect x="56" y="105" width="8" height="90" fill="url(#steel-v)" />
    
    <rect x="100" y="117" width="16" height="66" fill="url(#steel-v)" />
    <rect x="160" y="117" width="20" height="66" fill="url(#steel-v)" />
    <rect x="255" y="117" width="40" height="66" fill="url(#steel-v)" />
    <rect x="340" y="117" width="16" height="66" fill="url(#steel-v)" />
    <rect x="420" y="117" width="16" height="66" fill="url(#steel-v)" />
    
    <rect x="110" y="122" width="40" height="18" rx="9" fill="url(#steel-v)" />
    <rect x="110" y="160" width="40" height="18" rx="9" fill="url(#steel-v)" />
    
    <circle cx="108" cy="111" r="1.5" fill="#000" />
    <circle cx="168" cy="111" r="1.5" fill="#000" />
    <circle cx="275" cy="111" r="1.5" fill="#000" />
    <circle cx="348" cy="111" r="1.5" fill="#000" />
    <circle cx="108" cy="189" r="1.5" fill="#000" />
    <circle cx="168" cy="189" r="1.5" fill="#000" />
    <circle cx="275" cy="189" r="1.5" fill="#000" />
    <circle cx="348" cy="189" r="1.5" fill="#000" />
  </g>

  {/* EXHAUST */}
  <g id="cft-exhaust">
    <rect x="460" y="28" width="16" height="10" fill="#2a3032" />
    <rect x="454" y="32" width="28" height="4" fill="#111" />
    <circle cx="468" cy="33" r="12" fill="url(#steel-h)" />
    <circle cx="468" cy="33" r="11" fill="url(#steel-v)" opacity="0.7" />
    <circle cx="468" cy="33" r="8" fill="#050606" />
    <path d="M 463 28 A 7 7 0 0 1 473 28" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.3" />
  </g>

  {/* MUDGUARDS */}
  <g id="cft-mudguards">
    <path d="M 135 25 L 140 18 L 380 18 L 385 25 L 385 58 L 380 65 L 140 65 L 135 58 Z" fill="#1b1e21" />
    <path d="M 140 18 L 380 18" stroke="#3a4246" strokeWidth="1.5" opacity="0.6" fill="none" />
    <path d="M 150 20 L 150 63 M 200 20 L 200 63 M 260 20 L 260 63 M 320 20 L 320 63 M 370 20 L 370 63" stroke="#0a0c0e" strokeWidth="2" fill="none" />

    <path d="M 135 275 L 140 282 L 380 282 L 385 275 L 385 242 L 380 235 L 140 235 L 135 242 Z" fill="#1b1e21" />
    <path d="M 140 282 L 380 282" stroke="#0a0c0e" strokeWidth="1.5" opacity="0.6" fill="none" />
    <path d="M 150 237 L 150 280 M 200 237 L 200 280 M 260 237 L 260 280 M 320 237 L 320 280 M 370 237 L 370 280" stroke="#0a0c0e" strokeWidth="2" fill="none" />

    <path d="M 500 25 L 505 18 L 615 18 L 620 25 L 620 35 L 500 35 Z" fill="#1b1e21" />
    <path d="M 500 275 L 505 282 L 615 282 L 620 275 L 620 265 L 500 265 Z" fill="#1b1e21" />
  </g>

  {/* FUEL TANKS */}
  <g id="cft-fuel-tanks">
    <rect x="375" y="24" width="80" height="38" rx="8" fill="url(#steel-v)" />
    <rect x="390" y="23" width="6" height="40" rx="1" fill="#111" />
    <rect x="412" y="23" width="6" height="40" rx="1" fill="#111" />
    <rect x="434" y="23" width="6" height="40" rx="1" fill="#111" />
    <rect x="391" y="24" width="4" height="38" fill="url(#steel-v)" />
    <rect x="413" y="24" width="4" height="38" fill="url(#steel-v)" />
    <rect x="435" y="24" width="4" height="38" fill="url(#steel-v)" />
    <circle cx="400" cy="35" r="4" fill="#000" />
    <circle cx="400" cy="35" r="3" fill="url(#steel-h)" />

    <rect x="375" y="238" width="80" height="38" rx="8" fill="url(#steel-v)" />
    <rect x="390" y="237" width="6" height="40" rx="1" fill="#111" />
    <rect x="412" y="237" width="6" height="40" rx="1" fill="#111" />
    <rect x="434" y="237" width="6" height="40" rx="1" fill="#111" />
    <rect x="391" y="238" width="4" height="38" fill="url(#steel-v)" />
    <rect x="413" y="238" width="4" height="38" fill="url(#steel-v)" />
    <rect x="435" y="238" width="4" height="38" fill="url(#steel-v)" />
    <circle cx="400" cy="265" r="4" fill="#000" />
    <circle cx="400" cy="265" r="3" fill="url(#steel-h)" />
  </g>

  {/* FIFTH WHEEL */}
  <g id="cft-fifth-wheel">
    <rect x="240" y="112" width="70" height="76" rx="4" fill="#15181a" />
    <rect x="250" y="115" width="50" height="4" fill="#0a0c0e" />
    <rect x="250" y="181" width="50" height="4" fill="#0a0c0e" />
    
    <path d="M 305 115 L 305 185 Q 295 190 275 190 Q 255 190 245 185 L 245 160 L 275 155 Q 282 150 275 145 L 245 140 L 245 115 Q 255 110 275 110 Q 295 110 305 115 Z" fill="url(#fifth-wheel-grad)" stroke="#111" strokeWidth="1.5" />
    
    <path d="M 280 120 A 40 40 0 0 1 295 150 A 40 40 0 0 1 280 180" stroke="#0a0c0e" strokeWidth="3" fill="none" opacity="0.8" />
    <path d="M 260 125 A 25 25 0 0 1 275 150 A 25 25 0 0 1 260 175" stroke="#0a0c0e" strokeWidth="3" fill="none" opacity="0.8" />
    
    <path d="M 280 115 L 280 90 L 285 90" stroke="#9AA3A6" strokeWidth="3" fill="none" />
    <rect x="283" y="87" width="4" height="8" rx="1" fill="#C8352B" />
    
    <circle cx="275" cy="150" r="8" fill="#080a0c" />
    <circle cx="275" cy="150" r="5" fill="#15181a" />
    {/* MUST INCLUDE cft-pivot EXACTLY HERE */}
    <circle id="cft-pivot" cx="275" cy="150" r="2" fill="none" />
  </g>

  {/* CAB BODY */}
  <g id="cft-cab">
    <path d="M 470 25 L 430 35 L 430 40 L 470 40 Z" fill="#14392F" />
    <path d="M 470 275 L 430 265 L 430 260 L 470 260 Z" fill="#0a1f19" />

    <path d="M 470 25 L 660 25 Q 675 25 680 35 L 680 265 Q 675 275 660 275 L 470 275 Z" fill="url(#cab-base)" />
    
    <path d="M 470 26 L 660 26 Q 674 26 679 36" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
    <path d="M 470 274 L 660 274 Q 674 274 679 264" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" fill="none" />

    <path d="M 530 25 L 530 35 M 530 275 L 530 265" stroke="#091a15" strokeWidth="1.5" fill="none" />
    <path d="M 610 25 L 610 35 M 610 275 L 610 265" stroke="#091a15" strokeWidth="1.5" fill="none" />
    
    <rect x="535" y="21" width="35" height="5" rx="1" fill="#0a0c0e" />
    <rect x="535" y="274" width="35" height="5" rx="1" fill="#0a0c0e" />
    <rect x="540" y="22" width="25" height="2" fill="url(#steel-h)" />
    <rect x="540" y="276" width="25" height="2" fill="url(#steel-h)" />

    <path d="M 480 40 L 640 40 Q 655 40 655 50 L 655 250 Q 655 260 640 260 L 480 260 Z" fill="url(#cab-crown)" />
    <path d="M 480 40 L 640 40 Q 655 40 655 50 L 655 250 Q 655 260 640 260 L 480 260 Z" fill="url(#roof-highlight)" />
    
    <path d="M 480 41 L 640 41 Q 654 41 654 51" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />

    <rect x="540" y="75" width="24" height="30" rx="3" fill="#0c221c" stroke="#06120e" strokeWidth="1" />
    <path d="M 541 76 L 563 76" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
    
    <rect x="540" y="195" width="24" height="30" rx="3" fill="#0a1a15" stroke="#050c0a" strokeWidth="1" />
    <path d="M 541 196 L 563 196" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />

    <path d="M 500 110 L 630 110 M 500 130 L 630 130 M 500 170 L 630 170 M 500 190 L 630 190" stroke="#0b1c17" strokeWidth="2" fill="none" />

    <path d="M 470 30 L 620 30 Q 630 30 635 40 L 635 60 L 645 60" stroke="#D9A441" strokeWidth="3" fill="none" />
    <path d="M 470 270 L 620 270 Q 630 270 635 260 L 635 240 L 645 240" stroke="#D9A441" strokeWidth="3" fill="none" opacity="0.6" />
    <path d="M 645 40 L 655 40 L 665 140 L 665 160 L 655 260 L 645 260" stroke="#D9A441" strokeWidth="1.5" fill="none" opacity="0.8"/>

    <path d="M 470 40 L 505 40 Q 515 40 520 50 L 520 250 Q 515 260 505 260 L 470 260 Z" fill="#0d241d" />
    <path d="M 470 41 L 505 41 Q 514 41 519 51" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
    <path d="M 470 80 L 510 80 M 470 150 L 515 150 M 470 220 L 510 220" stroke="#071410" strokeWidth="2" fill="none" />
    
    <path d="M 650 28 Q 665 28 665 150 Q 665 272 650 272 L 656 272 Q 670 150 670 150 Q 670 150 656 28 Z" fill="rgba(15, 30, 25, 0.95)" />
    <path d="M 651 29 Q 664 29 664 150 Q 664 271 651 271" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
  </g>

  {/* BRANDING */}
  <g id="cft-brand">
    <text x="632" y="150" fontFamily="Inter, Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#D9A441" textAnchor="middle" letterSpacing="1.5" transform="rotate(-90, 632, 150)">CARGO FLOW AFRICA</text>
    <path d="M 635 220 L 628 213 L 630 211 L 638 219 L 638 221 L 630 229 L 628 227 Z" fill="#D9A441" />
    <path d="M 635 230 L 628 223 L 630 221 L 638 229 L 638 231 L 630 239 L 628 237 Z" fill="#D9A441" />
  </g>

  {/* WINDSCREEN */}
  <g id="cft-windscreen">
    <path d="M 650 32 Q 675 32 675 150 Q 675 268 650 268 L 655 268 Q 682 150 682 150 Q 682 150 655 32 Z" fill="url(#glass-grad)" />
    <path d="M 655 80 Q 665 70 675 75" stroke="#0a0c0e" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M 675 75 L 668 95" stroke="#0a0c0e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M 655 220 Q 665 210 675 215" stroke="#0a0c0e" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M 675 215 L 668 235" stroke="#0a0c0e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </g>

  {/* MIRRORS */}
  <g id="cft-mirrors">
    <path d="M 645 25 L 640 14" stroke="#15181a" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M 658 25 L 660 14" stroke="#15181a" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="635" y="6" width="24" height="8" rx="3" fill="#15181a" />
    <rect x="636" y="7" width="22" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
    <rect x="662" y="7" width="10" height="6" rx="2" fill="#15181a" />
    <rect x="663" y="8" width="8" height="3" rx="1.5" fill="rgba(255,255,255,0.1)" />

    <path d="M 645 275 L 640 286" stroke="#15181a" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M 658 275 L 660 286" stroke="#15181a" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="635" y="286" width="24" height="8" rx="3" fill="#15181a" />
    <rect x="636" y="287" width="22" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
    <rect x="662" y="287" width="10" height="6" rx="2" fill="#15181a" />
    <rect x="663" y="288" width="8" height="3" rx="1.5" fill="rgba(255,255,255,0.1)" />
  </g>

  {/* AIRLINES */}
  <g id="cft-airlines">
    <rect x="466" y="140" width="4" height="25" rx="1" fill="#15181a" />
    
    <path d="M 466 160 Q 420 220 340 160" stroke="#1E2326" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M 466 160 Q 420 220 340 160" stroke="#080a0c" strokeWidth="4" strokeDasharray="1 1.5" fill="none" strokeLinecap="round" />
    
    <path d="M 466 150 Q 400 190 340 150" stroke="#1E2326" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M 466 150 Q 400 190 340 150" stroke="#F2A91B" strokeWidth="4" strokeDasharray="1 2" fill="none" strokeLinecap="round" />
    
    <path d="M 466 145 Q 410 160 340 145" stroke="#1E2326" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M 466 145 Q 410 160 340 145" stroke="#C8352B" strokeWidth="4" strokeDasharray="1 2" fill="none" strokeLinecap="round" />
    
    <rect x="336" y="140" width="8" height="25" rx="1" fill="url(#steel-v)" />
    <rect x="338" y="143" width="4" height="4" fill="#C8352B" />
    <rect x="338" y="148" width="4" height="4" fill="#F2A91B" />
    <rect x="338" y="158" width="4" height="4" fill="#111" />
  </g>

  {/* LIGHTS: REAR */}
  <g id="cft-lights-rear">
    <rect x="58" y="112" width="6" height="18" rx="1" fill="#111" />
    <rect x="60" y="113" width="3" height="6" fill="#C8352B" />
    <rect x="60" y="120" width="3" height="4" fill="#d9d9d9" />
    <rect x="60" y="125" width="3" height="4" fill="#F2A91B" />
    <circle cx="61.5" cy="116" r="1.5" fill="url(#red-glow)" />
    
    <rect x="58" y="170" width="6" height="18" rx="1" fill="#111" />
    <rect x="60" y="181" width="3" height="6" fill="#C8352B" />
    <rect x="60" y="176" width="3" height="4" fill="#d9d9d9" />
    <rect x="60" y="171" width="3" height="4" fill="#F2A91B" />
    <circle cx="61.5" cy="184" r="1.5" fill="url(#red-glow)" />
  </g>

  {/* LIGHTS: HAZARD / INDICATORS (Default Dim) */}
  <g id="cft-lights-hazard" opacity="0.4">
    <rect x="674" y="27" width="5" height="7" rx="1" fill="#F2A91B" />
    <rect x="674" y="266" width="5" height="7" rx="1" fill="#F2A91B" />
    
    <circle cx="61.5" cy="127" r="4" fill="url(#amber-glow)" />
    <circle cx="61.5" cy="173" r="4" fill="url(#amber-glow)" />
  </g>

  {/* LIGHTS: BEACON */}
  <g id="cft-beacon">
    <rect x="576" y="120" width="8" height="60" rx="2" fill="#15181a" />
    <rect x="578" y="122" width="4" height="16" rx="1" fill="#F2A91B" />
    <rect x="578" y="162" width="4" height="16" rx="1" fill="#F2A91B" />
    
    <ellipse cx="580" cy="130" rx="10" ry="15" fill="url(#amber-glow)" opacity="0.5" />
    <ellipse cx="580" cy="170" rx="10" ry="15" fill="url(#amber-glow)" opacity="0.5" />
  </g>

  {/* LIGHTS: HEADLAMPS */}
  <g id="cft-lights-head">
    <rect x="672" y="42" width="8" height="16" rx="2" fill="#2a3032" />
    <circle cx="676" cy="46" r="2.5" fill="#e0e5e7" />
    <circle cx="676" cy="53" r="2" fill="#e0e5e7" />
    
    <rect x="672" y="242" width="8" height="16" rx="2" fill="#2a3032" />
    <circle cx="676" cy="246" r="2.5" fill="#e0e5e7" />
    <circle cx="676" cy="253" r="2" fill="#e0e5e7" />
  </g>

  {/* LIGHTS: FORWARD BEAMS (Default Off/0 Opacity) */}
  <g id="cft-lights-beam-l" opacity="0">
    <path d="M 680 46 L 1000 -60 L 1000 120 Z" fill="url(#beam-grad-l)" />
  </g>
  <g id="cft-lights-beam-r" opacity="0">
    <path d="M 680 254 L 1000 180 L 1000 360 Z" fill="url(#beam-grad-r)" />
  </g>

</svg>  );
}
