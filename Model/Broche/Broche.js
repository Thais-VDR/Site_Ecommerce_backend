const { DataTypes } = require('sequelize')

const db = require('../../db/conn')

const User = require('../User')

const Broche = db.define('Broche', {
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
Broche.belongsTo(User)
User.hasMany(Broche)


module.exports = Broche