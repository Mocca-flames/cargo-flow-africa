import "./ThreatCommon.css";
import "./ThreatMobile.css";

function ClockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function ThreatMobile() {
  return (
    <section id="threat-section" className="threat threat--mobile" aria-labelledby="threat-kicker-text">
      <div className="threat__track">
        <div className="threat__stage">
          {/* Cargo Flow standard — base layer */}
          <img
            className="threat__layer threat__layer--right"
            src="/images/premise/mobile_right_panel.avif"
            alt="A Cargo Flow truck on an open corridor"
          />

          {/* Broker / fear photo — revealed by wipe (vertical, bottom-up) */}
          <img
            className="threat__layer threat__layer--fear threat__layer--left"
            src="/images/premise/mobile_left_panel.avif"
            alt="Trucks queued at a border crossing"
          />

          {/* Bottom legibility scrim */}
          <div className="threat__scrim" />

          {/* Kicker overlay — top-centre */}
          <h2 id="threat-kicker-text" className="threat__hud-kicker">
            <span className="threat__hud-kicker-index">02</span>
            <span aria-hidden="true">—</span>
            <span>The Threat</span>
          </h2>

          {/* Broker overlay — top-left under kicker */}
          <div className="threat__hud-broker">
            <p className="threat__hud-broker-label">The broker gamble</p>
            <p className="threat__hud-broker-line">Untracked. Uninsured.</p>
            <span className="threat__chip threat__chip--delayed">
              <ClockIcon />
              {/* TODO: confirm wording/claim with owner */}
              Delayed
            </span>
          </div>

          {/* Cargo Flow overlay — bottom */}
          <div className="threat__hud-cargo">
            <p className="threat__hud-cargo-label">The Cargo Flow standard</p>
            <span className="threat__chip threat__chip--ontime">
              <CheckIcon />
              On time
            </span>
            <div className="threat__stats">
              <div className="threat__stat">
                <span className="threat__stat-value">98%</span>
                <span className="threat__stat-label">On-time</span>
              </div>
              <div className="threat__stat">
                <span className="threat__stat-value">100%</span>
                <span className="threat__stat-label">Tracked</span>
              </div>
              <div className="threat__stat">
                <span className="threat__stat-value">Insured</span>
                <span className="threat__stat-label">Cover</span>
              </div>
            </div>
          </div>

          {/* Wipe seam */}
          <div className="threat__divider" aria-hidden="true">
            <span className="threat__divider-handle" />
          </div>
        </div>
      </div>
    </section>
  );
}
