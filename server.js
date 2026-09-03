/**
 * Reconstructed site server — fixed asset paths
 * HTML references /assets/* ; files live in public/css, public/js, public/images
 */
const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const pub = (...p) => path.join(ROOT, "public", ...p);

app.use(express.json());

// Site root (HTML pages)
app.use(express.static(ROOT, { extensions: ["html"] }));

// Critical: map /assets/* to all collected folders (Next-style paths in HTML)
app.use("/assets", express.static(pub("css")));
app.use("/assets", express.static(pub("js")));
app.use("/assets", express.static(pub("images")));
app.use("/assets", express.static(pub("fonts")));
app.use("/assets", express.static(pub("assets")));
app.use("/assets", express.static(pub()));

// Also expose normal folders
app.use("/css", express.static(pub("css")));
app.use("/js", express.static(pub("js")));
app.use("/images", express.static(pub("images")));
app.use("/fonts", express.static(pub("fonts")));
app.use("/public", express.static(pub()));

// Next font paths sometimes stay as /_next/static/...
app.use("/_next/static", express.static(pub()));
app.use("/_next/static/media", express.static(pub("fonts")));
app.use("/_next/static/media", express.static(pub("images")));
app.use("/_next/static/css", express.static(pub("css")));
app.use("/_next/static/chunks", express.static(pub("js")));

const STUB_PATHS = ["/v1/venue/vendors/", "/v1/ideabook/search/list"];
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
