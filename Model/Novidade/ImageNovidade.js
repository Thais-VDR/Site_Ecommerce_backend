const { DataTypes } = require('sequelize')

const db = require('../../db/conn')

const Novidade = require('../Novidade/Novidade')

const ImageNovidade = db.define('ImageNovidade', {
    image:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

ImageNovidade.belongsTo(Novidade)
Novidade.hasMany(ImageNovidade)

module.exports = ImageNovidade