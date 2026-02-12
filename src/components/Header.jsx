export default function Header() {
  return (
    <header className="header">
      <div className="headerInner">
        <a className="brand" href="#top">
          <span className="brandMark">🏠</span>
          <span className="brandName">Amber_Home</span>
        </a>

        <nav className="nav">
          <a href="#top">Home</a>
          <a href="#apps">Apps</a>
          <a href="#about">About</a>
        </nav>
      </div>
    </header>
  );
}
