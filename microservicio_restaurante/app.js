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

const port = process.env.APP_PORT || 3300;

var pedidos = [];

//Metodo: POST, Parametros: codigoPedido*
app.post("/restaurante/recibirPedido", async function(req, res) {
    console.log("INIT /recibirPedido - Restaurante");
    console.log(req.body);

    let pedido = {
        codigo: pedidos.length,
        estado: "En Preparacion"
    };

    pedidos.push(pedido);

    console.log("Pedido Registrado exitosamente - Restaurante");

    res.json({
        codigo: pedido.codigo
    });
});

//Metodo: GET, Parametros: codigoPedido*
app.get("/restaurante/estadoPedido", async function(req, res) {
    console.log("INIT /estadoPedido - Restaurante");
    console.log(req.body);

    //se obtiene el valor codigo del query url
    let codigoPedido = req.query.codigo;

    if (!codigoPedido) {
        res.json({
            mensaje: "Error, es necesario el codigo del pedido",
        });

        return;
    }

    if (parseInt(codigoPedido) >= pedidos.length) {
        res.json({
            mensaje: "Error, codigo del pedido inválido",
        });

        return;
    }

    res.json({
        mensaje: pedidos[codigoPedido].estado,
    });
});

app.get("/restaurante/entregarPedido", async function(req, res) {
    console.log("INIT /entregarPedido - Restaurante");
    console.log(req.body);

    //se obtiene el valor codigo del query url
    let codigoPedido = req.query.codigo;

    if (!codigoPedido) {
        res.json({
            mensaje: "Error, es necesario el codigo del pedido",
        });

        return;
    }

    if (parseInt(codigoPedido) >= pedidos.length) {
        res.json({
            mensaje: "Error, codigo del pedido inválido",
        });

        return;
    }

    if (pedidos[codigoPedido].estado == "Enviado") {
        res.json({
            mensaje: "Error, este pedido ya fue entregado al repartidor.",
        });

        return;
    }

    pedidos[codigoPedido].estado = "Enviado";

    axios
        .get("http://localhost:5000/entregarPedidoRepartidor?codigo=" + codigoPedido)
        .then((response) => {
            console.log(response);
            console.log(
                "Orden " +
                response.data.codigo +
                " entregada al repartidor exitosamente"
            );

            res.json({
                mensaje: "Orden " +
                    response.data.codigo +
                    " entregada al repartidor exitosamente",
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