//AnelRoutes
const router = require('express').Router()
const AnelController = require('../Controllers/AnelController')
//Helpers
const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')
// ------------ Rotas Privadas ------------------------

/*cadastrar um produto*/
router.post('/create', verifyToken, imageUpload.array('images'), AnelController.create)
/* mostrar produto do usuario logado */
router.get('/aneis', verifyToken, AnelController.getAllUserAnel)
/* deletar um produto pelo id */
router.delete('/:id', verifyToken, AnelController.removeAnelById)
/* Editar Produto */
router.patch('/:id', verifyToken, imageUpload.array('images'), AnelController.updateAnel)
/** Agendar compra do produto */
router.patch('/schedule/:id', verifyToken, AnelController.schedule)
/** concluir  compra */
router.patch('/comprar/:id', verifyToken, AnelController.concludeCompra)


//---------------- rotas publicas ----------------

/*listar todos os produtos*/
router.get('/', AnelController.getAll)
/*listar produto por id*/
router.get('/:id', AnelController.getAnelById)

module.exports = router