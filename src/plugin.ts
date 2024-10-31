import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.js";
import { Plugin } from "vite";
import { AssetsProvider } from "./components/AssetsProvider.js";

const postfixRE = /[?#].*$/;

const clientEntry = "main.js";

function cleanUrl(url: string): string {
  return url.replace(postfixRE, "");
}

function getDefault(mod: any): any {
  return mod.default;
}

export const virtualClientEntry = "virtual:vite-surf/client-entry";

function surfPlugin(): Plugin {
  let root: string;

  return {
    name: "vite-surf",

    configResolved(config) {
      root = config.root;
    },

    configureServer(server) {
      return () => {
        server.middlewares.use(async function surfDevMiddleware(req, res, next) {
          if (res.writableEnded) {
            return next();
          }

          const url = req.url && cleanUrl(req.url);

          if (
            url?.endsWith(".html") &&
            req.headers["sec-fetch-dest"] !== "script"
          ) {
            const Document = await server
              .ssrLoadModule("./src/Document.tsx")
              .then(getDefault);

            const routes = await server
              .ssrLoadModule("./src/routes.tsx")
              .then(getDefault);

            const app = React.createElement(AssetsProvider, {
              assets: [
                {
                  type: "js",
                  src: `/${virtualClientEntry}`,
                },
              ],
              children: React.createElement(Document, {
                children: React.createElement(
                  StaticRouter,
                  { location: req.originalUrl! },
                  routes
                ),
              }),
            });

            const html = renderToString(app);

            res.end(
              await server.transformIndexHtml(url, html, req.originalUrl)
            );

            return;
          }

          next();
        });
      };
    },

    resolveId(source) {
      if (source.endsWith(virtualClientEntry)) {
        return `${root}/${clientEntry}`;
      }

      return null;
    },
    load(id) {
      if (id === `${root}/${clientEntry}`) {
        return `
          import React from "react";
          import { hydrateRoot } from "react-dom/client";
          import { BrowserRouter } from "react-router-dom";
          import routes from "./src/routes.tsx";

          hydrateRoot(document.getElementById("root"), React.createElement(BrowserRouter, {}, routes));
        `;
      }

      return null;
    },
  };
}

export default surfPlugin;
