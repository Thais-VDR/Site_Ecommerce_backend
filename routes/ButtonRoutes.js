const router = require('express').Router()
const ButtonController = require('../Controllers/ButtonController')

const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')

router.post('/create', verifyToken, imageUpload.array('images'), ButtonController.create)

router.get('/buttons', verifyToken, ButtonController.getAllUserButton)

router.delete('/:id', verifyToken, ButtonController.removeButtonById)

router.patch('/:id', verifyToken, imageUpload.array('images'), ButtonController.updateButton)

router.patch('/comprar/:id', verifyToken, ButtonController.concludeCompra)

router.get('/', ButtonController.getAll)

router.get('/:id', ButtonController.getButtonById)

module.exports = router