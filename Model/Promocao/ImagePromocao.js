const { DataTypes } = require('sequelize')

const db = require('../../db/conn')

const Promocao = require('../Promocao/Promocao')

const ImagePromocao = db.define('ImagePromocao', {
    image:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

ImagePromocao.belongsTo(Promocao)
Promocao.hasMany(ImagePromocao)

module.exports = ImagePromocao