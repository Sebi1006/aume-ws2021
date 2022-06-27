const express = require("express");
const routes = require("./routes");

function createServer() {
    const app = express();
    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*")
        next()
    })
    app.use("/api", routes);
    return app;
}

module.exports = createServer;
