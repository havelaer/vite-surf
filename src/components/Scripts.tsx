import { useContext } from "react";
import { assetsContext } from "./AssetsProvider.js";
import { virtualClientEntry } from "../plugin.js";

export function Scripts() {
  const assets = useContext(assetsContext);

  // TODO: find out why assetsContext via ssrLoadModule does not work
  if ((import.meta as any).env.DEV) {
    return <script type="module" src={`/${virtualClientEntry}`}></script>;
  }

  return (
    assets
      .filter((a) => a.type === "js")
      // TOTO: support for base url
      .map(({ src }) => <script type="module" src={`/${src}`}></script>)
  );
}
