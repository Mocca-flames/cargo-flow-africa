// Frame: viewBox 0 0 1200 300, faces +x, fifth-wheel pivot (275,150). Swap this whole <g> for the Gemini SVG.
// width/height are MANDATORY: a nested <svg> defaults to 100% of the parent
// viewport, which would scale the art off its pivot. Keep them in world units
// matching the viewBox; the parent <g> translate(-275 -150) lands the pivot.
//
// v2: white modern cab (aero roof, LED light bars, slim mirrors). All ids,
// data-cx/cy, steer pivots and cft-pivot are unchanged.

export function TractorArt() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x={0} y={0} width={1200} height={300} viewBox="0 0 1200 300">
      <defs>
        {/* Body paint: white, cool-grey shading */}
        <linearGradient id="cab-base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#EEF1F3" />
          <stop offset="100%" stopColor="#C4CCD1" />
        </linearGradient>
        <linearGradient id="cab-crown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F6F8F9" />
          <stop offset="100%" stopColor="#D5DBDF" />
        </linearGradient>
        <radialGradient id="roof-highlight" cx="0.4" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fairing-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B9C2C7" />
          <stop offset="60%" stopColor="#F4F6F7" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

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
        {/* Polished aluminium tanks */}
        <linearGradient id="alu-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2F5F6" />
          <stop offset="30%" stopColor="#C9D0D4" />
          <stop offset="65%" stopColor="#8E989D" />
          <stop offset="100%" stopColor="#5B6469" />
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
          <stop offset="0%" stopColor="#1b2427" />
          <stop offset="35%" stopColor="#3C525A" />
          <stop offset="48%" stopColor="#8FA7AE" />
          <stop offset="52%" stopColor="#B9CBD0" />
          <stop offset="60%" stopColor="#43585F" />
          <stop offset="100%" stopColor="#141b1d" />
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
        <linearGradient id="led-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8F4FF" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
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

      {/* EXHAUST: modern slim stack, chrome */}
      <g id="cft-exhaust">
        <rect x="460" y="28" width="16" height="10" fill="#2a3032" />
        <rect x="454" y="32" width="28" height="4" fill="#111" />
        <circle cx="468" cy="33" r="12" fill="url(#steel-h)" />
        <circle cx="468" cy="33" r="11" fill="url(#steel-v)" opacity="0.7" />
        <circle cx="468" cy="33" r="8" fill="#050606" />
        <path d="M 463 28 A 7 7 0 0 1 473 28" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.4" />
      </g>

      {/* MUDGUARDS: satin white-grey with fine ribs */}
      <g id="cft-mudguards">
        <path d="M 135 25 L 140 18 L 380 18 L 385 25 L 385 58 L 380 65 L 140 65 L 135 58 Z" fill="#D3D9DD" />
        <path d="M 140 18 L 380 18" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.9" fill="none" />
        <path d="M 150 20 L 150 63 M 200 20 L 200 63 M 260 20 L 260 63 M 320 20 L 320 63 M 370 20 L 370 63" stroke="#9AA3A6" strokeWidth="1.5" fill="none" />

        <path d="M 135 275 L 140 282 L 380 282 L 385 275 L 385 242 L 380 235 L 140 235 L 135 242 Z" fill="#C2CACF" />
        <path d="M 140 282 L 380 282" stroke="#7d878c" strokeWidth="1.5" opacity="0.6" fill="none" />
        <path d="M 150 237 L 150 280 M 200 237 L 200 280 M 260 237 L 260 280 M 320 237 L 320 280 M 370 237 L 370 280" stroke="#9AA3A6" strokeWidth="1.5" fill="none" />

        <path d="M 500 25 L 505 18 L 615 18 L 620 25 L 620 35 L 500 35 Z" fill="#D3D9DD" />
        <path d="M 500 275 L 505 282 L 615 282 L 620 275 L 620 265 L 500 265 Z" fill="#C2CACF" />
      </g>

      {/* FUEL TANKS: polished aluminium, strap bands */}
      <g id="cft-fuel-tanks">
        <rect x="375" y="24" width="80" height="38" rx="10" fill="url(#alu-v)" />
        <rect x="390" y="23" width="5" height="40" rx="1" fill="#2a3032" />
        <rect x="412" y="23" width="5" height="40" rx="1" fill="#2a3032" />
        <rect x="434" y="23" width="5" height="40" rx="1" fill="#2a3032" />
        <circle cx="400" cy="35" r="4" fill="#1E2326" />
        <circle cx="400" cy="35" r="3" fill="url(#steel-h)" />

        <rect x="375" y="238" width="80" height="38" rx="10" fill="url(#alu-v)" />
        <rect x="390" y="237" width="5" height="40" rx="1" fill="#2a3032" />
        <rect x="412" y="237" width="5" height="40" rx="1" fill="#2a3032" />
        <rect x="434" y="237" width="5" height="40" rx="1" fill="#2a3032" />
        <circle cx="400" cy="265" r="4" fill="#1E2326" />
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

      {/* CAB BODY: white, aero-profiled */}
      <g id="cft-cab">
        {/* rear cab step / back wall */}
        <path d="M 470 25 L 430 35 L 430 40 L 470 40 Z" fill="#AEB7BC" />
        <path d="M 470 275 L 430 265 L 430 260 L 470 260 Z" fill="#9AA3A6" />

        {/* outer shell */}
        <path d="M 470 25 L 660 25 Q 675 25 680 35 L 680 265 Q 675 275 660 275 L 470 275 Z" fill="url(#cab-base)" />
        <path d="M 470 26 L 660 26 Q 674 26 679 36" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
        <path d="M 470 274 L 660 274 Q 674 274 679 264" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" fill="none" />

        {/* shut lines */}
        <path d="M 530 25 L 530 35 M 530 275 L 530 265" stroke="#9AA3A6" strokeWidth="1" fill="none" />
        <path d="M 610 25 L 610 35 M 610 275 L 610 265" stroke="#9AA3A6" strokeWidth="1" fill="none" />

        {/* flush door handles */}
        <rect x="540" y="22" width="25" height="3" rx="1.5" fill="#6B757A" />
        <rect x="540" y="275" width="25" height="3" rx="1.5" fill="#6B757A" />

        {/* roof panel */}
        <path d="M 480 40 L 640 40 Q 655 40 655 50 L 655 250 Q 655 260 640 260 L 480 260 Z" fill="url(#cab-crown)" />
        <path d="M 480 40 L 640 40 Q 655 40 655 50 L 655 250 Q 655 260 640 260 L 480 260 Z" fill="url(#roof-highlight)" />
        <path d="M 480 41 L 640 41 Q 654 41 654 51" stroke="#FFFFFF" strokeWidth="1" fill="none" />

        {/* centre roof ridge */}
        <path d="M 520 150 L 640 150" stroke="#D0D6DA" strokeWidth="1.5" fill="none" />
        <path d="M 520 152 L 640 152" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.9" />

        {/* flush roof hatch (sunroof) */}
        <rect x="545" y="108" width="60" height="84" rx="8" fill="#E3E8EB" stroke="#C5CCD1" strokeWidth="1" />
        <rect x="551" y="114" width="48" height="72" rx="6" fill="#2D3C41" opacity="0.85" />
        <path d="M 555 118 L 595 118" stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />

        {/* integrated roof LED bar (front) */}
        <rect x="628" y="86" width="14" height="128" rx="7" fill="#1E2326" />
        <rect x="631" y="91" width="8" height="118" rx="4" fill="url(#led-grad)" opacity="0.95" />

        {/* brand accent stripe, gold */}
        <path d="M 470 30 L 620 30 Q 630 30 635 40 L 635 60 L 645 60" stroke="#D9A441" strokeWidth="2.5" fill="none" />
        <path d="M 470 270 L 620 270 Q 630 270 635 260 L 635 240 L 645 240" stroke="#D9A441" strokeWidth="2.5" fill="none" opacity="0.7" />

        {/* AERO ROOF FAIRING (rear) */}
        <path d="M 470 40 L 505 40 Q 520 40 524 56 L 524 244 Q 520 260 505 260 L 470 260 Z" fill="url(#fairing-grad)" />
        <path d="M 470 41 L 505 41 Q 518 41 522 56" stroke="#FFFFFF" strokeWidth="1" fill="none" />
        <path d="M 478 70 L 516 70 M 478 150 L 520 150 M 478 230 L 516 230" stroke="#C5CCD1" strokeWidth="1.5" fill="none" />

        {/* front lip over screen */}
        <path d="M 650 28 Q 665 28 665 150 Q 665 272 650 272 L 656 272 Q 670 150 670 150 Q 670 150 656 28 Z" fill="#DDE2E6" />
        <path d="M 651 29 Q 664 29 664 150 Q 664 271 651 271" stroke="#FFFFFF" strokeWidth="1" fill="none" />
      </g>

      {/* BRANDING */}
      <g id="cft-brand">
        {/* lockup on the rear fairing */}
        <text x="500" y="150" fontFamily="Inter, Arial, sans-serif" fontSize="11" fontWeight="bold" fill="#1E2326" textAnchor="middle" letterSpacing="1.5" transform="rotate(-90, 500, 150)">CARGO FLOW AFRICA</text>
        {/* chevrons */}
        <path d="M 505 232 L 498 225 L 500 223 L 508 231 L 508 233 L 500 241 L 498 239 Z" fill="#D9A441" transform="rotate(180, 503, 232)" />
        <path d="M 505 244 L 498 237 L 500 235 L 508 243 L 508 245 L 500 253 L 498 251 Z" fill="#D9A441" transform="rotate(180, 503, 244)" />
      </g>

      {/* WINDSCREEN: wraparound tinted glass */}
      <g id="cft-windscreen">
        <path d="M 650 32 Q 675 32 675 150 Q 675 268 650 268 L 655 268 Q 682 150 682 150 Q 682 150 655 32 Z" fill="url(#glass-grad)" />
        <path d="M 660 60 Q 670 150 660 240" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* centre post */}
        <path d="M 676 146 L 676 154" stroke="#1E2326" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>

      {/* MIRRORS: slim camera-style pods */}
      <g id="cft-mirrors">
        <path d="M 648 25 L 644 12" stroke="#2a3032" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="636" y="5" width="22" height="7" rx="3.5" fill="#1E2326" />
        <rect x="638" y="6" width="18" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)" />
        <circle cx="664" cy="9" r="2" fill="#F2A91B" />

        <path d="M 648 275 L 644 288" stroke="#2a3032" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="636" y="288" width="22" height="7" rx="3.5" fill="#1E2326" />
        <rect x="638" y="289" width="18" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)" />
        <circle cx="664" cy="291" r="2" fill="#F2A91B" />
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
        <rect x="576" y="120" width="8" height="60" rx="2" fill="#1E2326" />
        <rect x="578" y="122" width="4" height="16" rx="1" fill="#F2A91B" />
        <rect x="578" y="162" width="4" height="16" rx="1" fill="#F2A91B" />

        <ellipse cx="580" cy="130" rx="10" ry="15" fill="url(#amber-glow)" opacity="0.5" />
        <ellipse cx="580" cy="170" rx="10" ry="15" fill="url(#amber-glow)" opacity="0.5" />
      </g>

      {/* LIGHTS: HEADLAMPS: slim LED signature */}
      <g id="cft-lights-head">
        <rect x="671" y="40" width="9" height="20" rx="3" fill="#1E2326" />
        <rect x="673" y="42" width="6" height="3" rx="1.5" fill="url(#led-grad)" />
        <rect x="673" y="48" width="6" height="2" rx="1" fill="#E8F4FF" />
        <rect x="673" y="53" width="6" height="5" rx="2" fill="#FFFFFF" />

        <rect x="671" y="240" width="9" height="20" rx="3" fill="#1E2326" />
        <rect x="673" y="242" width="6" height="3" rx="1.5" fill="url(#led-grad)" />
        <rect x="673" y="248" width="6" height="2" rx="1" fill="#E8F4FF" />
        <rect x="673" y="253" width="6" height="5" rx="2" fill="#FFFFFF" />
      </g>

      {/* LIGHTS: FORWARD BEAMS (Default Off/0 Opacity) */}
      <g id="cft-lights-beam-l" opacity="0">
        <path d="M 680 46 L 1000 -60 L 1000 120 Z" fill="url(#beam-grad-l)" />
      </g>
      <g id="cft-lights-beam-r" opacity="0">
        <path d="M 680 254 L 1000 180 L 1000 360 Z" fill="url(#beam-grad-r)" />
      </g>
    </svg>
  );
}