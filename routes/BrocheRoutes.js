const router = require('express').Router()
const BrocheController = require('../Controllers/BrocheController')

const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')

router.post('/create', verifyToken, imageUpload.array('images'), BrocheController.create)

router.get('/broches', verifyToken, BrocheController.getAllUserBroche)

router.delete('/:id', verifyToken, BrocheController.removeBrocheById)

router.patch('/:id', verifyToken, imageUpload.array('images'), BrocheController.updateBroche)

router.patch('/comprar/:id', verifyToken, BrocheController.concludeCompra)

router.get('/', BrocheController.getAll)

router.get('/:id', BrocheController.getBrocheById)

module.exports = router