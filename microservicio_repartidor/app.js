// ---------------- constantes para la configuración de express y los metodos utilizados ------------------
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");

app.use(bodyParser.json());

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

const port = process.env.APP_PORT || 3302;

var pedidos = [];

//Metodo: POST, Parametros: codigoPedido*
app.post("/repartidor/recibirPedido", async function(req, res) {
    console.log("INIT /recibirPedido - Repartidor");
    console.log(req.body);

    let codigoPedido = req.body.codigo;

    let pedido = {
        codigo: codigoPedido,
        estado: "En Camino"
    };

    pedidos.push(pedido);

    console.log("Pedido Registrado exitosamente - Restaurante");

    res.json({
        codigo: pedido.codigo
    });
});

//Metodo: GET, Parametros: codigoPedido*
app.get("/repartidor/estadoPedido", async function(req, res) {
    console.log("INIT /estadoPedido - Repartidor");
    console.log(req.body);

    //se obtiene el valor codigo del query url
    let codigoPedido = req.query.codigo;

    if (!codigoPedido) {
        res.json({
            mensaje: "Error, es necesario el codigo del pedido",
        });

        return;
    }

    for (let i = 0; i < pedidos.length; i++) {
        if (codigoPedido == pedidos[i].codigo) {
            res.json({
                mensaje: pedidos[i].estado,
            });

            return;
        }
    }

    res.json({
        mensaje: "Error, no se recibido ningun pedido con ese codigo.",
    });
});

app.get("/repartidor/entregarPedido", async function(req, res) {
    console.log("INIT /entregarPedido - Repartidor");
    console.log(req.body);

    //se obtiene el valor codigo del query url
    let codigoPedido = req.query.codigo;

    if (!codigoPedido) {
        res.json({
            mensaje: "Error, es necesario el codigo del pedido",
        });

        return;
    }

    for (let i = 0; i < pedidos.length; i++) {
        if (codigoPedido == pedidos[i].codigo) {
            if (pedidos[i].estado == "Entregado al cliente.") {
                res.json({
                    mensaje: "Este pedido ya fue entregado.",
                });

                return;
            }

            pedidos[i].estado = "Entregado al cliente.";
            res.json({
                mensaje: "Pedido " + pedidos[i].codigo + " entregado exitosamente.",
            });

            return;
        }
    }

    res.json({
        mensaje: "Error, no se recibido ningun pedido con ese codigo.",
    });
});

app.listen(port, function() {
    console.log("Aplicación corriendo en el puerto " + port);
});