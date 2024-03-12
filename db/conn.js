const {Sequelize} = require('sequelize')

//new Sequelize é obrigado a colocar 3 parametros(nome do banco de dados, usuario e senha).
//E mostrar aonde ele será conectado/funcionando que será no localhost e mysql.
const sequelize = new Sequelize('Boo_store', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
})

try{
    //mostra que está funcionando
sequelize.authenticate()
console.log('Conectado ao banco!!!')
} catch(error){
    //mostra o erro
    console.log('Não é possível conectar: ', error)
}

//exportando o sequelize
module.exports = sequelize