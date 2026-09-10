import MorphLogo from "./MorphLogo";
import { EditableText } from "../lib/copy";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__wordmark">
        <MorphLogo size="0.75em" />
        <EditableText copyKey="site.title" defaultValue="FutureFabric" as="h1" />
      </div>
      <p className="site-header__tagline">
        <EditableText copyKey="site.tagline.line1" defaultValue="An Open-Source Catalog" />
        <br />
        <EditableText copyKey="site.tagline.line2" defaultValue="of Bio-based Fashion Designs" />
      </p>
    </header>
  );
}
