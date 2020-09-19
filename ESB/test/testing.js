

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);

const url= 'http://localhost:5000';


describe('Realizar pedido: ',()=>{
    it('debe de realizar un pedido', (done) => {
    chai.request(url)
    .get('/realizarPedido')
    .end( function(err,res){
    console.log(res)
    expect(res).to.have.status(200);
    done();
    });
    });
   });


   describe('Estado Pedido - Restaurante: ',()=>{
    it('debe de obtener el estado de un pedido consultado al restaurante', (done) => {
    chai.request(url)
    .get('/estadoPedidoRestaurante')
    .end( function(err,res){
    console.log(res)
    expect(res).to.have.status(200);
    done();
    });
    });
   });

   describe('Estado Pedido - Repartidor: ',()=>{
    it('debe de obtener el estado de un pedido consultado al repartidor', (done) => {
    chai.request(url)
    .get('/estadoPedidoRepartidor')
    .end( function(err,res){
    console.log(res)
    expect(res).to.have.status(200);
    done();
    });
    });
   });

   describe('Entregar pedido repartidor: ',()=>{
    it('debe de entergar el pedido del restaurante al repartidor', (done) => {
    chai.request(url)
    .get('/entregarPedidoRepartidor')
    .end( function(err,res){
    console.log(res)
    expect(res).to.have.status(200);
    done();
    });
    });
   });
   
   