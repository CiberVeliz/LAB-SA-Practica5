// ---------------- constantes para la configuración de express y los metodos utilizados ------------------
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

const winston = require("winston");
const consoleTransport = new winston.transports.Console();
const myWinstonOptions = {
    transports: [consoleTransport],
};
const logger = new winston.createLogger(myWinstonOptions);

function logRequest(req, res, next) {
    logger.info(req.url);
    next();
}
app.use(logRequest);

function logError(err, req, res, next) {
    logger.error(err);
    next();
}
app.use(logError);

// ---------------------------------------------------------------------------------------------------------

const port = process.env.APP_PORT || 3301;

//Metodo: GET, Parametros: codigoPedido*
app.get("/cliente/solicitarPedido", async function(req, res) {
    console.log("INIT /solicitarPedido - Cliente");
    console.log(req.body);

    axios
        .get("http://localhost:5000/realizarPedido") //comunicación al ESB
        .then((response) => {
            console.log(response);
            console.log(
                "Orden realizada exitosamente, el codigo de su orden es: " +
                response.data.codigo
            );

            res.json({
                mensaje: "Orden realizada exitosamente, el codigo de su orden es: " +
                    response.data.codigo,
            });

            return;
        })
        .catch((error) => {
            console.log("Error al realizar la orden");
            console.log(error);
        });
});

//Metodo: GET, Parametros: codigoPedido*
app.get("/cliente/verificarPedidoRestaurante", async function(req, res) {
    console.log("INIT /verificarPedidoRestaurante  - Cliente");
    console.log(req.body);

    //se obtiene el valor codigo del query url
    let codigoPedido = req.query.codigo;

    if (!codigoPedido) {
        res.json({
            mensaje: "Error, es necesario el codigo del pedido",
        });
        return;
    }

    axios
        .get("http://localhost:5000/estadoPedidoRestaurante?codigo=" + codigoPedido) //comunicacion con el ESB
        .then((response) => {
            console.log("Pedido consultado exitosamente");

            res.json({
                mensaje: response.data.mensaje,
            });

            return;
        })
        .catch((error) => {
            console.log("Error al verificar el pedido");
            console.log(error);
        });
});

//Metodo: GET, Parametros: codigoPedido*
app.get("/cliente/verificarPedidoRepartidor", async function(req, res) {
    console.log("INIT /verificarPedidoRepartidor  - Cliente");
    console.log(req.body);

    //se obtiene el valor codigo del query url
    let codigoPedido = req.query.codigo;

    if (!codigoPedido) {
        res.json({
            mensaje: "Error, es necesario el codigo del pedido",
        });
        return;
    }

    axios
        .get("http://localhost:5000/estadoPedidoRepartidor?codigo=" + codigoPedido)
        .then((response) => {
            console.log("Pedido consultado exitosamente");

            res.json({
                mensaje: response.data.mensaje,
            });

            return;
        })
        .catch((error) => {
            console.log("Error al verificar el pedido");
            console.log(error);
        });
});

app.listen(port, function() {
    console.log("Aplicación corriendo en el puerto " + port);
});