import { type CSSProperties } from "react";
import { useDialKit } from "dialkit";
import MorphLogo from "./MorphLogo";
import { EditableText } from "../lib/copy";

export default function Header({ darkMode, onToggleDarkMode }: { darkMode: boolean; onToggleDarkMode: () => void }) {
  const titleShape = useDialKit(
    "Title shape",
    {
      size: [40, 8, 200, 1],
      x: [0, -400, 400, 1],
      y: [0, -160, 160, 1],
    },
    { id: "site-title-shape", persist: true },
  );
  const titleText = useDialKit(
    "Title text",
    {
      size: [53, 16, 200, 1],
      x: [0, -400, 400, 1],
      y: [0, -160, 160, 1],
    },
    { id: "site-title-text", persist: true },
  );
  const subtitle = useDialKit(
    "Subtitle",
    {
      x: [0, -400, 400, 1],
      y: [0, -160, 160, 1],
      indentStyle: { type: "select", options: ["none", "first-line", "hanging", "stepped"] },
      indent: [32, 0, 160, 1],
      alignment: { type: "select", options: ["left", "center", "right"] },
      lineSpacing: [1.1, 0.7, 2, 0.01],
      fontSize: [31, 12, 80, 1],
    },
    { id: "site-subtitle-layout", persist: true },
  );
  const subtitleStyle = {
    "--subtitle-x": `${subtitle.x}px`,
    "--subtitle-y": `${subtitle.y}px`,
    "--subtitle-indent": `${subtitle.indent}px`,
    "--subtitle-alignment": subtitle.alignment,
    "--subtitle-line-spacing": subtitle.lineSpacing,
    "--subtitle-font-size": `${subtitle.fontSize}px`,
  } as CSSProperties;

  return (
    <header className="site-header">
      <div className="site-header__wordmark">
        <span
          className="site-header__mark"
          style={{ transform: `translate3d(${titleShape.x}px, ${titleShape.y}px, 0)` }}
        >
          <MorphLogo size={titleShape.size} active={darkMode} onActivate={onToggleDarkMode} />
        </span>
        <span
          className="site-header__title-text"
          style={{
            fontSize: `${titleText.size}px`,
            transform: `translate3d(${titleText.x}px, ${titleText.y}px, 0)`,
          }}
        >
          <EditableText copyKey="site.title" defaultValue="FutureFabric" as="h1" />
        </span>
      </div>
      <p className="site-header__tagline" data-indent-style={subtitle.indentStyle} style={subtitleStyle}>
        <EditableText
          copyKey="site.tagline.line1"
          defaultValue="An Open-Source Catalog"
          className="site-header__tagline-line site-header__tagline-line--first"
        />
        <br />
        <EditableText
          copyKey="site.tagline.line2"
          defaultValue="of Bio-based Fashion Apparel"
          className="site-header__tagline-line site-header__tagline-line--second"
        />
      </p>
    </header>
  );
}
