const router = require('express').Router()
const PromocaoController = require('../Controllers/PromocaoController')

const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')

router.post('/create', verifyToken, imageUpload.array('images'), PromocaoController.create)

router.get('/promocao', verifyToken, PromocaoController.getAllUserPromocao)

router.delete('/:id', verifyToken, PromocaoController.removePromocaoById)

router.patch('/:id', verifyToken, imageUpload.array('images'), PromocaoController.updatePromocao)

router.patch('/comprar/:id', verifyToken, PromocaoController.concludeCompra)

router.get('/', PromocaoController.getAll)

router.get('/:id', PromocaoController.getPromocaoById)

module.exports = router