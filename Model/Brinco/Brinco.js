const { DataTypes } = require('sequelize')

const db = require('../../db/conn')

const User = require('../User')

const Brinco = db.define('Brinco', {
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },
    preco:{
        type: DataTypes.STRING,
        allowNull: false
    },
    admin: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})
Brinco.belongsTo(User)
User.hasMany(Brinco)


module.exports = Brinco