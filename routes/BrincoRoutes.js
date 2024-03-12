const router = require('express').Router()
const BrincoController = require('../Controllers/BrincoController')

const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')

router.post('/create', verifyToken, imageUpload.array('images'), BrincoController.create)

router.get('/brincos', verifyToken, BrincoController.getAllUserBrinco)

router.delete('/:id', verifyToken, BrincoController.removeBrincoById)

router.patch('/:id', verifyToken, imageUpload.array('images'), BrincoController.updateBrinco)

router.patch('/comprar/:id', verifyToken, BrincoController.concludeCompra)

router.get('/', BrincoController.getAll)

router.get('/:id', BrincoController.getBrincoById)


module.exports = router