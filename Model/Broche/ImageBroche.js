const { DataTypes } = require('sequelize')

const db = require('../../db/conn')

const Broche = require('./Broche')

const ImageBroche = db.define('ImageBroche', {
    image:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

ImageBroche.belongsTo(Broche)
Broche.hasMany(ImageBroche)

module.exports = ImageBroche