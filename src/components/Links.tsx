import { useContext } from "react";
import { assetsContext } from "./AssetsProvider.js";

export function Links() {
  const assets = useContext(assetsContext);

  return assets
    .filter((a) => a.type === "css")
    .map(({ src }) => <link rel="stylesheet" href={src} />);
}
