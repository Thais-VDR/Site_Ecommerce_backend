const jwt = require('jsonwebtoken')
const User = require('../Model/User')

async function getUserByToken(token) {
    if (!token) {
        return res.status(401).json({ message: 'Acesso Negado' })
    }

    const decoded = jwt.verify(token, 'nossosecret')

    const userId = decoded.id

    const user = await User.findOne({ id: userId })

    return user
}
module.exports = getUserByToken