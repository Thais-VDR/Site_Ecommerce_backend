const { DataTypes } = require('sequelize')

const db = require('../../db/conn')

const User = require('../User')

const Novidade = db.define('Novidade', {
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
Novidade.belongsTo(User)
User.hasMany(Novidade)


module.exports = Novidade