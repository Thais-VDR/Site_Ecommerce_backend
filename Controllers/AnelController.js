const Anel = require('../Model/Anel/Anel')
const User = require('../Model/User')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const jwt = require('jsonwebtoken')
const ImageAnel = require('../Model/Anel/ImageAnel')

module.exports = class AnelController {
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

        const anel = new Anel({
            nome: nome,
            preco: preco,
            UserId: currentUser.id,
            admin : admin
        });

        try {
            const newAnel = await anel.save();

            const images = req.files;
            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    const filename = images[i].filename;
                    const newImageAnel = new ImageAnel({ image: filename, AnelId: newAnel.id });
                    await newImageAnel.save();
                }
            }
            res.status(201).json({ message: 'Produto cadastrado com sucesso', newAnel });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAll(req, res) {
        const aneis = await Anel.findAll({
            order: [['createdAt', 'DESC']],
            include: ImageAnel
        });
        res.status(200).json({ aneis : aneis });

    }

    static async getAllUserAnel(req, res) {
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        const aneis = await Anel.findAll({
            where: { userId: currentUserId },
            order: [['createdAt', 'DESC']],
            include: ImageAnel
        })

        res.status(200).json({ aneis })

    }

    static async getAnelById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'ID Inválido' })
            return
        }
        const anel = await Anel.findByPk(id, { include: ImageAnel });

        if (!anel) {
            res.status(422).json({ message: 'Produto não existe' })
            return
        }

        res.status(200).json({ anel : anel })
    }

    static async removeAnelById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'ID Inválido' })
            return
        }
        const anel = await Anel.findByPk(id)

        if (!anel) {
            res.status(422).json({ message: 'Produto não existe' })
            return
        }
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        await Anel.destroy({ where: { id: id } })

        res.status(200).json({ message: 'Produto removido com sucesso' })
    }


    static async updateAnel(req, res) {
        const id = req.params.id
        const { nome, preco } = req.body

        const updateData = {}
        const anel = await Anel.findByPk(id);

        if (!anel) {
            res.status(404).json({ message: "Produto não existe!" });
            return;
        }

        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (anel.UserId !== currentUser.id) {
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
            await ImageAnel.destroy({ where: { AnelId: anel.id } });
            for (let i = 0; i < imageFilenames.length; i++) {
                const filename = imageFilenames[i];
                const newImageAnel = new ImageAnel({ image: filename, AnelId: anel.id });
                await newImageAnel.save();
            }

        }

        await Anel.update(updateData, { where: { id: id } });

        res.status(200).json({ message: "att com successo!" })
    }

    static async schedule(req, res) {
        const id = req.params.id;

        const anel = await Anel.findByPk(id);

        if (!anel) {
            res.status(404).json({ message: "Produto não existe!" });
            return;
        }

        //checar se o usuario logado registrou o anel
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (anel.userId === currentUser.id) {
            res.status(422).json({ message: "O produto já é seu" });
            return;
        }

        //checar se o usuario ja agendou o produto

        if (anel.compra) {
            if (anel.compra === currentUser.id) {
                res.status(422).json({ message: "Voce ja agendou o produto" });
                return;
            }
        }

        console.log(anel.compra, ' = ', currentUser.id)
        //adicionar user como adontante do produto
        anel.compra = currentUser.id

        await anel.save()

        res.status(200).json({ message: `Compra agendada por ${currentUser.nome}` })
    }

    static async concludeCompra(req, res) {
        const id = req.params.id;

        const anel = await Anel.findByPk(id);
        if (!anel) {
            res.status(404).json({ message: "Produto não existe!" });
            return;
        }

        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (anel.UserId !== currentUser.id) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        await anel.save();

        res.status(200).json({ message: `Compra adicionada` })
    }

}