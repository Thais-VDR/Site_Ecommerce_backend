const Novidade = require('../Model/Novidade/Novidade')
const User = require('../Model/User')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const jwt = require('jsonwebtoken')
const ImageNovidade = require('../Model/Novidade/ImageNovidade')

module.exports = class NovidadeController {
    static async create(req, res) {
        const { nome, preco } = req.body

        if (!nome) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if (!preco) {
            res.status(422).json({ message: 'O preço é obrigatório' })
            return
        }

        const admin = 0

        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        const novidade = new Novidade({
            nome: nome,
            preco: preco,
            UserId: currentUser.id,
            admin : admin
        });

        try {
            const newNovidade = await novidade.save();

            const images = req.files;
            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    const filename = images[i].filename;
                    const newImageNovidade = new ImageNovidade({ image: filename, NovidadeId: newNovidade.id });
                    await newImageNovidade.save();
                }
            }
            res.status(201).json({ message: 'Produto cadastrado com sucesso', newNovidade });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAll(req, res) {
        const novidades = await Novidade.findAll({
            order: [['createdAt', 'DESC']],
            include: ImageNovidade
        });
        res.status(200).json({ novidades : novidades });

    }

    static async getAllUserNovidade(req, res) {
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        const novidades = await Novidade.findAll({
            where: { userId: currentUserId },
            order: [['createdAt', 'DESC']],
            include: ImageNovidade
        })

        res.status(200).json({ novidades })

    }

    static async getNovidadeById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'ID Inválido' })
            return
        }
        const novidade = await Novidade.findByPk(id, { include: ImageNovidade });

        if (!novidade) {
            res.status(422).json({ message: 'Produto não existe' })
            return
        }

        res.status(200).json({ novidade : novidade })
    }

    static async removeNovidadeById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'ID Inválido' })
            return
        }
        const novidade = await Novidade.findByPk(id)

        if (!novidade) {
            res.status(422).json({ message: 'Produto não existe' })
            return
        }
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        await Novidade.destroy({ where: { id: id } })

        res.status(200).json({ message: 'Produto removido com sucesso' })
    }


    static async updateNovidade(req, res) {
        const id = req.params.id
        const { nome, preco } = req.body

        const updateData = {}
        const novidade = await Novidade.findByPk(id);

        if (!novidade) {
            res.status(404).json({ message: "Produto não existe!" });
            return;
        }

        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (novidade.UserId !== currentUser.id) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        if (!nome) {
            res.status(422).json({ message: "O nome é obrigatório!" });
            return;
        } else {
            updateData.nome = nome
        }
        if (!preco) {
            res.status(422).json({ message: "O preço é obrigatória!" });
            return;
        } else {
            updateData.preco = preco
        }

        const images = req.files
        if (!images || images.length === 0) {
            res.status(422).json({ message: "As imagens são obrigatórias!" });
            return;
        } else {
            const imageFilenames = images.map((image) => image.filename);
            await ImageNovidade.destroy({ where: { NovidadeId: novidade.id } });
            for (let i = 0; i < imageFilenames.length; i++) {
                const filename = imageFilenames[i];
                const newImageNovidade = new ImageNovidade({ image: filename, NovidadeId: novidade.id });
                await newImageNovidade.save();
            }

        }

        await Novidade.update(updateData, { where: { id: id } });

        res.status(200).json({ message: "att com successo!" })
    }

    static async concludeCompra(req, res) {
        const id = req.params.id;

        const novidade = await Novidade.findByPk(id);
        if (!novidade) {
            res.status(404).json({ message: "Produto não existe!" });
            return;
        }

        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (novidade.UserId !== currentUser.id) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        await novidade.save();

        res.status(200).json({ message: `Compra adicionada` })
    }

}