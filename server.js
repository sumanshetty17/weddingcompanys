/**
 * Reconstructed site server — source: https://www.theweddingcompany.com/
 * Render: Build = npm install | Start = npm start
 */
const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

app.use(express.json());
app.use(express.static(ROOT, { extensions: ["html"] }));
app.use("/css", express.static(path.join(ROOT, "public", "css")));
app.use("/js", express.static(path.join(ROOT, "public", "js")));
app.use("/images", express.static(path.join(ROOT, "public", "images")));
app.use("/fonts", express.static(path.join(ROOT, "public", "fonts")));
app.use("/assets", express.static(path.join(ROOT, "public", "assets")));
app.use("/public", express.static(path.join(ROOT, "public")));

const STUB_PATHS = [
  "/v1/venue/vendors/",
  "/v1/ideabook/search/list"
];
for (const p of STUB_PATHS) {
  app.all(p, (req, res) => {
    res.json({
      ok: true,
      stub: true,
      path: p,
      message: "Placeholder API — add your own backend if needed.",
      method: req.method,
    });
  });
}

app.get("/api/health", (_req, res) => res.json({ status: "ok", reconstructed: true }));

app.get("*", (req, res, next) => {
  if (req.path.includes(".")) return next();
  res.sendFile(path.join(ROOT, "index.html"), (err) => {
    if (err) res.status(404).send("Not found");
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Reconstructed site on port " + PORT);
});
