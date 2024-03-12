//image-upload.js
const multer = require('multer') //gerenciar imagens
const path = require('path') //gerenciar o caminho dos arquivos
//Aqui será definido onde os arquivos serão salvos
//O destino das imagens será definido aqui
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = '' //folder é pasta

        if (req.baseUrl.includes('users')) {
            folder = 'users'
        } else if (req.baseUrl.includes('brincos')) {
            folder = 'brincos'
        } else if(req.baseUrl.includes('aneis')){
            folder = 'aneis'
        } else if(req.baseUrl.includes('broches')){
            folder = 'broches'
        } else if(req.baseUrl.includes('buttons')){
            folder = 'buttons'
        } else if(req.baseUrl.includes('novidade')){
            folder = 'novidade'
        } else if(req.baseUrl.includes('promocao')){
            folder = 'promocao'
        }
           
        cb(null, `public/image/${folder}`)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error('Por favor, envie apenas jpg ou png'))
        }
        cb(null, true)
    }
})

module.exports = imageUpload 