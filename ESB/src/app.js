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

const port = process.env.APP_PORT || 5000;

//Metodo: GET, Parametros: codigoPedido*
app.get("/realizarPedido", async function(req, res) {
    console.log("INIT /realizarPedido - ESB");
    console.log(req.body);

    axios
        .post("http://localhost:3300/restaurante/recibirPedido") //comunicación con el restaurante
        .then((response) => {
            console.log(response);
            console.log(
                "Orden realizada exitosamente, el codigo de su orden es: " +
                response.data.codigo
            );

            res.json({
                codigo: response.data.codigo,
            });

            return;
        })
        .catch((error) => {
            res.json({
                mensaje: error
            });
            console.log("Error al realizar la orden");
            console.log(error);
        });
});

//Metodo: GET, Parametros: codigoPedido*
app.get("/estadoPedidoRestaurante", async function(req, res) {
    console.log("INIT /estadoPedidoRestaurante  - ESB");
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
        .get("http://localhost:3300/restaurante/estadoPedido?codigo=" + codigoPedido)
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
app.get("/estadoPedidoRepartidor", async function(req, res) {
    console.log("INIT /estadoPedidoRepartidor  - ESB");
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
        .get("http://localhost:3302/repartidor/estadoPedido?codigo=" + codigoPedido)
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


app.get("/entregarPedidoRepartidor", async function(req, res) {
    console.log("INIT /entregarPedidoRepartidor - ESB");
    console.log(req.body);

    //se obtiene el valor codigo del query url
    let codigoPedido = req.query.codigo;

    let data = {
        codigo: codigoPedido
    };

    axios
        .post("http://localhost:3302/repartidor/recibirPedido", data)
        .then((response) => {
            console.log(response);
            console.log(
                "Orden " +
                response.data.codigo +
                " entregada al repartidor exitosamente"
            );

            res.json({
                codigo: response.data.codigo
            });

            return;
        })
        .catch((error) => {
            console.log("Error al realizar la entrega");
            console.log(error);
        });
});

app.listen(port, function() {
    console.log("Aplicación corriendo en el puerto " + port);
});