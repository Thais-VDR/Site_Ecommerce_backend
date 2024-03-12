const { DataTypes } = require('sequelize')

const db = require('../../db/conn')

const User = require('../User')

const Anel = db.define('Anel', {
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
Anel.belongsTo(User)
User.hasMany(Anel)


module.exports = Anel