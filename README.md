# Vite Surf

A Vite plugin that adds Express server, React Router and SSR.

## Setup

Create Vite app from boilterplate

```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
```

Install dependencies

```bash
npm install vite-surf react-router-dom express sirv
npm install -D @types/express
```

Configure plugin


Configure package json scripts

```diff
    "dev": "vite",
-   "build": "tsc -b && vite build",
+   "build:client": "vite build --manifest --outDir dist/client",
+   "build:server": "vite build --ssr src/server.ts --outDir dist/server",
+   "build": "npm run build:client && npm run build:server",
    "lint": "eslint .",
-   "preview": "vite preview"
+   "start": "node ./dist/server/server.js"
```

Remove some files, and add some new ones.

```diff
    node_modules/
    public/
    src/
        assets/
            react.svg
-       App.css
-       App.tsx
+       Document.tsx
        index.css
-       main.tsx
+       routes.tsx
+       server.ts
        vite-env.d.ts
    .gitignore
    README.md
    eslint.config.js
-   index.html
    package-lock.json
    package.json
    tsconfig.app.json
    tsconfig.json
    tsconfig.node.json
    vite.config.ts
```

`src/Document.tsx`

```tsx
import { ReactNode } from "react";
import { Links, Scripts } from "vite-surf";

export default function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React + TS + SSR</title>
        <Links />
      </head>
      <body>
        <div id="root">{children}</div>
        <Scripts />
      </body>
    </html>
  );
}
```

`src/server.ts`

```ts
import express from "express";
import { surfMiddleware } from "vite-surf";
import Document from "./Document";
import routes from "./routes";
import sirv from "sirv";
import manifest from "../dist/client/.vite/manifest.json";

const app = express();

app.use(sirv("./dist/client"));

app.get("/test", (_req, res) => {
  res.send("hello world");
});

app.use(surfMiddleware({ Document, routes, manifest }));

app.listen(3000);

```

`src/routes.tsx`

```tsx
import { Link, Route, Routes } from "react-router-dom";
import "./index.css";

export default (
  <Routes>
    <Route
      path="/"
      element={
        <div>
          Home <Link to="/about">About</Link>
        </div>
      }
    />
    <Route
      path="/about"
      element={
        <div>
          About <Link to="/">home</Link>
        </div>
      }
    />
  </Routes>
);
```
