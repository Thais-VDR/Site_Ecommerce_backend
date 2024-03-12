const { DataTypes } = require('sequelize')

const db = require('../../db/conn')

const User = require('../User')

const Button = db.define('Button', {
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },
    preco:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    admin: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})
Button.belongsTo(User)
User.hasMany(Button)


module.exports = Button