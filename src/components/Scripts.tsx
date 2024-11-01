import { useContext } from "react";
import { assetsContext } from "./AssetsProvider.js";

export function Scripts() {
  const assets = useContext(assetsContext);

  return (
    assets
      .filter((a) => a.type === "js")
      // TOTO: support for base url
      .map(({ src }) => (
        <script key={src} type="module" src={`/${src}`}></script>
      ))
  );
}
