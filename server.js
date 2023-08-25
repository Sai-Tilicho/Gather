const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.get("/", (req, res) => {
        return app.render(req, res, "/", req.query);
    });

    server.get("/dashboard", (req, res) => {

        return app.render(req, res, "/dashboard", req.query);
    });

    server.get("/profileEdit", (req, res) => {
        return app.render(req, res, "/profileEdit", req.query);
    });

    server.all("*", (req, res) => {
        return handle(req, res);
    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});