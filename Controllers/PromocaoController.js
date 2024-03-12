const Promocao = require('../Model/Promocao/Promocao')
const User = require('../Model/User')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const jwt = require('jsonwebtoken')
const ImagePromocao = require('../Model/Promocao/ImagePromocao')

module.exports = class PromocaoController {
    static async create(req, res) {
        const { nome, preco, oferta } = req.body

        if (!nome) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if (!preco) {
            res.status(422).json({ message: 'O preço é obrigatório' })
            return
        }
        if (!oferta) {
            res.status(422).json({ message: 'A oferta é obrigatória' })
            return
        }
        const admin = 0
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        const promocao = new Promocao({
            nome: nome,
            preco: preco,
            oferta: oferta,
            UserId: currentUser.id,
            admin : admin
        });

        try {
            const newPromocao = await promocao.save();

            const images = req.files;
            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    const filename = images[i].filename;
                    const newImagePromocao = new ImagePromocao({ image: filename, PromocaoId: newPromocao.id });
                    await newImagePromocao.save();
                }
            }
            res.status(201).json({ message: 'Produto cadastrado com sucesso', newPromocao });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAll(req, res) {
        const promocaos = await Promocao.findAll({
            order: [['createdAt', 'DESC']],
            include: ImagePromocao
        });
        res.status(200).json({ promocaos : promocaos });

    }

    static async getAllUserPromocao(req, res) {
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        const promocaos = await Promocao.findAll({
            where: { userId: currentUserId },
            order: [['createdAt', 'DESC']],
            include: ImagePromocao
        })

        res.status(200).json({ promocaos })

    }

    static async getPromocaoById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'ID Inválido' })
            return
        }
        const promocao = await Promocao.findByPk(id, { include: ImagePromocao });

        if (!promocao) {
            res.status(422).json({ message: 'Produto não existe' })
            return
        }

        res.status(200).json({ promocao : promocao })
    }

    static async removePromocaoById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'ID Inválido' })
            return
        }
        const promocao = await Promocao.findByPk(id)

        if (!promocao) {
            res.status(422).json({ message: 'Produto não existe' })
            return
        }
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        await Promocao.destroy({ where: { id: id } })

        res.status(200).json({ message: 'Produto removido com sucesso' })
    }


    static async updatePromocao(req, res) {
        const id = req.params.id
        const { nome, preco, oferta } = req.body

        const updateData = {}
        const promocao = await Promocao.findByPk(id);

        if (!promocao) {
            res.status(404).json({ message: "Produto não existe!" });
            return;
        }

        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (promocao.UserId !== currentUser.id) {
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
        if (!oferta) {
            res.status(422).json({ message: "A oferta é obrigatória!" });
            return;
        } else {
            updateData.oferta = oferta
        }

        const images = req.files
        if (!images || images.length === 0) {
            res.status(422).json({ message: "As imagens são obrigatórias!" });
            return;
        } else {
            const imageFilenames = images.map((image) => image.filename);
            await ImagePromocao.destroy({ where: { PromocaoId: promocao.id } });
            for (let i = 0; i < imageFilenames.length; i++) {
                const filename = imageFilenames[i];
                const newImagePromocao = new ImagePromocao({ image: filename, PromocaoId: promocao.id });
                await newImagePromocao.save();
            }

        }

        await Promocao.update(updateData, { where: { id: id } });

        res.status(200).json({ message: "att com successo!" })
    }

    static async concludeCompra(req, res) {
        const id = req.params.id;

        const promocao = await Promocao.findByPk(id);
        if (!promocao) {
            res.status(404).json({ message: "Produto não existe!" });
            return;
        }

        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (promocao.UserId !== currentUser.id) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        await promocao.save();

        res.status(200).json({ message: `Compra adicionada` })
    }

}