import "./NavBar.css";

export default function NavBar() {
  return (
    <header className="nav-bar">
      <div className="nav-bar-inner">
        <span className="nav-bar-logo">Cargo Flow Africa</span>
        <nav className="nav-bar-links">
          <a href="#">Fleet</a>
          <a href="#">Corridors</a>
          <a href="#">Company</a>
          <a href="#">Contact</a>
        </nav>
      </div>
    </header>
  );
}
