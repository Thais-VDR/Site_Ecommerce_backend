const Broche = require('../Model/Broche/Broche')
const User = require('../Model/User')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const jwt = require('jsonwebtoken')
const ImageBroche = require('../Model/Broche/ImageBroche')

module.exports = class BrocheController {
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

        const broche = new Broche({
            nome: nome,
            preco: preco,
            UserId: currentUser.id,
            admin : admin
        });

        try {
            const newBroche = await broche.save();

            const images = req.files;
            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    const filename = images[i].filename;
                    const newImageBroche = new ImageBroche({ image: filename, BrocheId: newBroche.id });
                    await newImageBroche.save();
                }
            }
            res.status(201).json({ message: 'Produto cadastrado com sucesso', newBroche });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAll(req, res) {
        const broches = await Broche.findAll({
            order: [['createdAt', 'DESC']],
            include: ImageBroche
        });
        res.status(200).json({ broches : broches });

    }

    static async getAllUserBroche(req, res) {
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        const broches = await Broche.findAll({
            where: { userId: currentUserId },
            order: [['createdAt', 'DESC']],
            include: ImageBroche
        })

        res.status(200).json({ broches })

    }

    static async getBrocheById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'ID Inválido' })
            return
        }
        const broche = await Broche.findByPk(id, { include: ImageBroche });

        if (!broche) {
            res.status(422).json({ message: 'Produto não existe' })
            return
        }

        res.status(200).json({ broche : broche })
    }

    static async removeBrocheById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'ID Inválido' })
            return
        }
        const broche = await Broche.findByPk(id)

        if (!broche) {
            res.status(422).json({ message: 'Produto não existe' })
            return
        }
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        await Broche.destroy({ where: { id: id } })

        res.status(200).json({ message: 'Produto removido com sucesso' })
    }


    static async updateBroche(req, res) {
        const id = req.params.id
        const { nome, preco } = req.body

        const updateData = {}
        const broche = await Broche.findByPk(id);

        if (!broche) {
            res.status(404).json({ message: "Produto não existe!" });
            return;
        }

        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (broche.UserId !== currentUser.id) {
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
            await ImageBroche.destroy({ where: { BrocheId: broche.id } });
            for (let i = 0; i < imageFilenames.length; i++) {
                const filename = imageFilenames[i];
                const newImageBroche = new ImageBroche({ image: filename, BrocheId: broche.id });
                await newImageBroche.save();
            }

        }

        await Broche.update(updateData, { where: { id: id } });

        res.status(200).json({ message: "att com successo!" })
    }

    static async concludeCompra(req, res) {
        const id = req.params.id;

        const broche = await Broche.findByPk(id);
        if (!broche) {
            res.status(404).json({ message: "Produto não existe!" });
            return;
        }

        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (broche.UserId !== currentUser.id) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        await broche.save();

        res.status(200).json({ message: `Compra adicionada` })
    }

}