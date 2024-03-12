const { DataTypes } = require('sequelize')

const db = require('../../db/conn')

const Button = require('./Button')

const ImageButton = db.define('ImageButton', {
    image:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

ImageButton.belongsTo(Button)
Button.hasMany(ImageButton)

module.exports = ImageButton