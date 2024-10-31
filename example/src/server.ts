import express from "express";
import { surfMiddleware } from "../../dist";
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
