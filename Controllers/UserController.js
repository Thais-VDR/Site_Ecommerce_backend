const User = require('../Model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserById = require('../helpers/get-user-by-token')

module.exports = class UserController {
    //Criar um usuario/Cadastro

    static async cadastro(req, res) {
        const { nome, endereco, cpf, email, senha, confirmarSenha } = req.body
        //validações
        if (!nome) {
            res.status(422).json({ message: 'Complete o nome' })
            return
        }
        if (!endereco) {
            res.status(422).json({ message: 'Complete o endereço' })
            return
        }
        if (!cpf) {
            res.status(422).json({ message: 'Complete o CPF' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'Complete o email' })
            return
        }
        if (!senha) {
            res.status(422).json({ message: 'Complete a senha' })
            return
        }
        if (!confirmarSenha) {
            res.status(422).json({ message: 'Complete o confirmar senha' })
            return
        }

        const admin = 0

        //criar a senha
        //criar a criptografia
        const salt = await bcrypt.genSalt(12)
        const senhaHash = await bcrypt.hash(senha, salt)

        //Checar se o usuario existe 
        const userExists = await User.findOne({ where: { email: email } })

        if (userExists) {
            res.status(422).json({ message: 'Esse email já está cadastrado' })
            return
        }

        const user = new User({
            nome: nome,
            endereco: endereco,
            cpf: cpf,
            email: email,
            senha: senhaHash,
            admin : admin
        })

        try {
            //criando o usuario no banco
            const newUser = await user.save()
            //entregar o token para o novo user
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    static async login(req, res) {
        const { email, senha } = req.body

        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' })
            return
        }

        if (!senha) {
            res.status(422).json({ message: 'O senha é obrigatório' })
            return
        }

        const user = await User.findOne({ where: { email: email } })

        if (!user) {
            res.status(422).json({ message: 'Email não encontrado' })
            return
        }

        console.log(user.senha)
        //checar se o senha é igual a senha do banco
        const checksenha = await bcrypt.compare(senha, user.senha)

        if (!checksenha) {
            res.status(422).json({ message: 'Senha incorreta' })
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {
        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)

            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findByPk(decoded.id)

            currentUser.password = undefined
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findByPk(id, {
            where: { id: id }
        })

        if (!user) {
            res.status(422).json({ message: 'desculpa, usuario não encontrado...' })
            return
        }

        user.senha = undefined

        res.status(200).json({ user })
    }

    static async editUser(req, res) {
        const id = req.params.id

        //checar se o usuario existe
        const token = getToken(req)
        const user = await getUserById(token)

        //receber os dados nas variaves
        const { nome, endereco, cpf, email, senha, confirmarSenha } = req.body

        let image = ''
        if (req.file) {
            image = req.file.filename
        }

        //validações de campos vazios 
        if (!nome) {
            res.status(422).json({ message: 'Nome é obrigatório' })
            return
        }
        if (!endereco) {
            res.status(422).json({ message: 'Endereço é obrigatório' })
            return
        }
        const userExists = await User.findOne({ where: { email: email } })
        if (user.email !== email && userExists) {
            res.status(422).json({ message: 'Por favor utilize outro email' })
            return
        }
        if (!cpf) {
            res.status(422).json({ message: 'CPF é obrigatório' })
            return
        }
        user.cpf = cpf

        if (senha !== confirmarSenha) {
            res.status(422).json({ message: 'as senhas não batem, tente outro...' })
            return
        } else if (senha === confirmarSenha && senha != null) {
            //criptografando senha
            const salt = await bcrypt.genSalt(12)
            const senhaHash = await bcrypt.hash(senha, salt)

            user.senha = senhaHash 
        }

        const userToUpdate = await User.findByPk(id)

        if (!userToUpdate) {
            res.status(422).json({ message: 'Desculpa, usuario não encontrado' })
            return
        }

        userToUpdate.nome = nome
        userToUpdate.endereco = endereco
        userToUpdate.cpf = cpf
        userToUpdate.email = email
        userToUpdate.image = image
       
        if (senha === confirmarSenha && senha != null) {
            //criptografando senha
            const salt = await bcrypt.genSalt(12)
            const senhaHash = await bcrypt.hash(senha, salt)

            userToUpdate.senha = senhaHash
        }

        try {
            await userToUpdate.save()
            res.status(200).json({ message: 'usuario atualizado com sucesso' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }

    }
}