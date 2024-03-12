const jwt = require('jsonwebtoken')

async function createUserToken(user, req, res){
const token = jwt.sign({
    nome: user.nome,
    id:user.id
},  'nossosecret')

res.status(200).json({
message: 'Você está autenticado',
token: token,
userId: user.id
})
}
module.exports = createUserToken