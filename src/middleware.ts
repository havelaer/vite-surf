import React, { ReactNode } from "react";
import { RequestHandler } from "express";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.js";
import { Transform } from "node:stream";
import { Manifest } from "vite";
import { AssetsProvider } from "./components/AssetsProvider.js";

interface MiddlewareOptions {
  Document: React.FC<{ children: ReactNode }>;
  routes: ReactNode;
  manifest: Manifest;
}

export function surfMiddleware(options: MiddlewareOptions): RequestHandler {
  return (req, res) => {
    let didError = false;

    const app = React.createElement(AssetsProvider, {
      assets: [
        ...(options.manifest["main.js"]!.css?.map((src) => ({
          type: "css" as const,
          src,
        })) ?? []),
        {
          type: "js",
          src: options.manifest["main.js"]!.file,
        },
      ],
      children: [
        React.createElement(options.Document, {
          children: [
            React.createElement(StaticRouter, {
              location: req.originalUrl!,
              children: options.routes,
            }),
          ],
        }),
      ],
    });

    const { pipe } = renderToPipeableStream(app, {
      onShellError() {
        res.status(500);
        res.set({ "Content-Type": "text/html" });
        res.send("<h1>Something went wrong</h1>");
      },
      onShellReady() {
        res.status(didError ? 500 : 200);
        res.set({ "Content-Type": "text/html" });
        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding);
            callback();
          },
        });
        pipe(transformStream);

        transformStream.on("finish", () => {
          res.end();
        });
      },
      onError(error: unknown) {
        didError = true;
        console.error(error);
      },
    });
  };
}
