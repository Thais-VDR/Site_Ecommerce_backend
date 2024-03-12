//Criar um metodo: POST
const router = require('express').Router()

const UserController = require('../Controllers/UserController')
//helpers
const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')

//Rota para criar "registrar" um usuario
//Rotas publicas
router.post('/cadastro', UserController.cadastro)
//Rota para criar um login
router.post('/login', UserController.login)
//Rota para criar um checamento de usuario
router.get('/checkuser', UserController.checkUser)
//Rota para criar para encontrar o usuario perdido
router.get('/:id', UserController.getUserById)

//Rotas protegidas, só acessar caso esteja logado!!!
router.patch('/edit/:id', verifyToken, imageUpload.single('image'), UserController.editUser)

module.exports = router