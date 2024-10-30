import { createContext, ReactNode } from "react";
import { Asset } from "../types.js";

export const assetsContext = createContext<Asset[]>([]);

export function AssetsProvider({
  assets,
  children,
}: {
  assets: Asset[];
  children: ReactNode;
}) {
  return (
    <assetsContext.Provider value={assets}>{children}</assetsContext.Provider>
  );
}
