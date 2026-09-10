import MorphLogo from "./MorphLogo";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__wordmark">
        <MorphLogo />
        <h1>FutureFabric</h1>
      </div>
      <p className="site-header__tagline">
        An Open-Source Catalog
        <br />
        of Bio-based Fashion Designs
      </p>
    </header>
  );
}
