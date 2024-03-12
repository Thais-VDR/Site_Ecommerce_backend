const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = db.define('User', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cpf: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    admin: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    
})

module.exports = User