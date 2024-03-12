const { DataTypes } = require('sequelize')

const db = require('../../db/conn')

const Anel = require('../Anel/Anel')

const ImageAnel = db.define('ImageAnel', {
    image:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

ImageAnel.belongsTo(Anel)
Anel.hasMany(ImageAnel)

module.exports = ImageAnel