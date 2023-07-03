/*  Get config and create server */
dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;

function createServer(app) {
    if (process.env.NODE_ENV === 'production') {
        console.log("Production");
        // Tell passport to trust the HTTPS proxy
        app.enable("trust proxy");
        // In production use HTTP
        const http = require('http');
        const http_server = http.createServer(app).listen(port, () => {
            console.log('HTTP server listening on: ', http_server.address());
        });
    } else {
        console.log("Development");
        // In development use HTTPS
        const https = require("https"),
            fs = require("fs"),
            server = process.env.SERVER;
        /*  Certificate and key files */
        const keyname = "./certs/" + server + "-key.pem",
            certname = "./certs/" + server + ".pem";

        console.log("Using cert:", certname, "key:", keyname);
        console.log();

        const certs = {
            key: fs.readFileSync(keyname),
            cert: fs.readFileSync(certname)
        };
        const https_server = https.createServer(certs, app).listen(port, () => {
            console.log('HTTPS server listening on: ', https_server.address());
        });
    }
}

module.exports = { createServer }
// module.exports = {
//     port,
//     https,
//     certs
// }