const { DataTypes } = require('sequelize')

const db = require('../../db/conn')

const User = require('../User')

const Promocao = db.define('Promocao', {
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },
    preco:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    oferta:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    admin: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})
Promocao.belongsTo(User)
User.hasMany(Promocao)


module.exports = Promocao