const express = require('express');
const cors = require('cors');

const {Sequelize} = require('./models');

const models=require('./models');

const app=express();
app.use(cors());
app.use(express.json());


let cliente = models.Cliente;
let itemcompra = models.ItemCompra;
let compra = models.Compra;
let produto = models.Produto;

app.get('/', function(req, res){
    res.send('Olá Mundo!')
});

app.post('/produtos', async(req,res)=>{
    await produto.create(
        req.body
     ).then(function(){
         return res.json({
             error: false,
             message: "Serviço  criado com sucesso!"
         })
     }).catch(function(error){
         return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar!"
         })
     });
    });

app.post('/clientes', async(req, res)=>{
    await cliente.create(
        req.body
     ).then(function(){
         return res.json({
             error: false,
             message: "Cliente cadastado com sucesso!"
         })
     }).catch(function(error){
         return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar!"
         })
     });
    });

    app.post('/itenscompra', async(req, res)=>{
        await itemcompra.create(
            req.body
         ).then(function(){
             return res.json({
                 error: false,
                 message: "Item criado com sucesso!"
             })
         }).catch(function(error){
             return res.status(400).json({
                error: true,
                message: "Foi impossivel se conectar."
             })
         });
        });

        app.post('/compras', async(req, res)=>{
            await compra.create(
                req.body
             ).then(function(){
                 return res.json({
                     error: false,
                     message: "Compra efetuada com sucesso com sucesso!"
                 })
             }).catch(function(error){
                 return res.status(400).json({
                    error: true,
                    message: "Foi impossivel se conectar!"
                 })
             });
            });

        app.get('/listaprodutos', async(req, res)=>{
            await produto.findAll({
                order: [['nome', 'ASC']]
            }).then(function(produtos){
                res.json({produtos})
            });
        });

        app.get('/listacompras', async(req, res)=>{
            await compra.findAll({
                order: [['nome', 'ASC']]
            }).then(function(compras){
                res.json({compras})
            });
        });

        app.get('/listaclientes', async(req, res)=>{
            await cliente.findAll({
                order: [['nome', 'ASC']]
            }).then(function(clientes){
                res.json({clientes})
            });
        });

        app.get('/produtocompras', async(req, res)=>{
            await produtocompra.findAll({
                order: [['nome', 'ASC']]
            }).then(function(produtocompras){
                res.json({produtocompras})
            });
        });

        app.get('/ofertaprodutos', async(req, res)=>{
            await produto.count('id').then(function(produtos){
                res.json({produtos});
            });
        });

        app.get('/produto/:id', async(req, res)=>{
            await produto.findByPk(req.params.id)
            .then(prod =>{
                return res.json({
                    error: false,
                    prod
                });
            }).catch(function(error){
                return res.status(400).json({
                    error: true,
                    message: "Erro: não foi possivel conectar!"
                });
            });
        });

        app.put('/atualizaproduto', async(req,res)=>{
            await produto.update(req.body,{
                where: {id: req.body.id}
            }).then(function(){
                return res.json({
                    error: false,
                    message: "Produto foi alterado com sucesso!"
                });
            }).catch(function(erro){
                return res.status(400).json({
                    error: true,
                    message: "Erro na alteração do produto."
                });
            });
            });

        app.get('/compras/:id', async(res,req)=>{
            await compra.findByPk(req.params.id, {include:[{all: true}]})
            .then(com=>{
                return res.json({com});
            })
        })

        app.put('/compras/:id/editaritem', async(req, res)=>{
            const item={
                quantidade: req.body.quantidade,
                valor: req.body.valor
            };

            if(!await compra.findByPk(req.params.id)){
                return res.status(400).json({
                    error: true,
                    message: "Compra não encontrada."
                });
            };

            if(!await produto.findByPk(req.body.ProdutoId)){
                return res.status(400).json({
                    error: true,
                    message: "Produto não encontrado."
                });
            };

            await itemcompra.update(item, {
                where: Sequelize.and({ProdutoId: req.body.ProdutoId},
                    {CompraId: req.params.id})
            }).then(function(itens){
                return res.json({
                    error: false,
                    message: "Compra alterada com sucesso!",
                    itens
                });
            }).catch(function(erro){
                return res.status(400).json({
                    error: true,
                    message: "Erro: não foi possível alterar."
                });
            });
        });

        app.get('/excluircliente/:id', async(req, res)=>{
            await cliente.destroy({
                where: {id: req.params.id}
            }).then(function(){
                return res.json({
                    error: false,
                    messsage: "Cliente excluído com sucesso!"
                });
            }).catch(function(erro){
                return res.status(400).json({
                    error: true,
                    message: "Erro ao excluir cliente."
                });
            });
        });

let port=process.env.PORT || 3001;

app.listen(port,(req,res)=>{
    console.log('Servidor Ativo: http://localhost:3001');
})