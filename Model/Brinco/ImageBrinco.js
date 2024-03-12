const { DataTypes } = require('sequelize')

const db = require('../../db/conn')

const Brinco = require('../Brinco/Brinco')

const ImageBrinco = db.define('ImageBrinco', {
    image:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

ImageBrinco.belongsTo(Brinco)
Brinco.hasMany(ImageBrinco)

module.exports = ImageBrinco