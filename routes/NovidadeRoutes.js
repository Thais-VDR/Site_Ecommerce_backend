const router = require('express').Router()
const NovidadeController = require('../Controllers/NovidadeController')

const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')

router.post('/create', verifyToken, imageUpload.array('images'), NovidadeController.create)

router.get('/novidade', verifyToken, NovidadeController.getAllUserNovidade)

router.delete('/:id', verifyToken, NovidadeController.removeNovidadeById)

router.patch('/:id', verifyToken, imageUpload.array('images'), NovidadeController.updateNovidade)

router.patch('/comprar/:id', verifyToken, NovidadeController.concludeCompra)

router.get('/', NovidadeController.getAll)

router.get('/:id', NovidadeController.getNovidadeById)

module.exports = router