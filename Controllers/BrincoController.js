const Brinco = require('../Model/Brinco/Brinco')
const User = require('../Model/User')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const jwt = require('jsonwebtoken')
const ImageBrinco = require('../Model/Brinco/ImageBrinco')

module.exports = class BrincoController {
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

        const brinco = new Brinco({
            nome: nome,
            preco: preco,
            UserId: currentUser.id,
            admin : admin
        });

        try {
            const newBrinco = await brinco.save();

            const images = req.files;
            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    const filename = images[i].filename;
                    const newImageBrinco = new ImageBrinco({ image: filename, BrincoId: newBrinco.id });
                    await newImageBrinco.save();
                }
            }
            res.status(201).json({ message: 'Produto cadastrado com sucesso', newBrinco });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAll(req, res) {
        const brincos = await Brinco.findAll({
            order: [['createdAt', 'DESC']],
            include: ImageBrinco
        });
        res.status(200).json({ brincos : brincos });

    }

    static async getAllUserBrinco(req, res) {
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        const brincos = await Brinco.findAll({
            where: { userId: currentUserId },
            order: [['createdAt', 'DESC']],
            include: ImageBrinco
        })

        res.status(200).json({ brincos })

    }

    static async getBrincoById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'ID Inválido' })
            return
        }
        const brinco = await Brinco.findByPk(id, { include: ImageBrinco });

        if (!brinco) {
            res.status(422).json({ message: 'Produto não existe' })
            return
        }

        res.status(200).json({ brinco : brinco })
    }

    static async removeBrincoById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'ID Inválido' })
            return
        }
        const brinco = await Brinco.findByPk(id)

        if (!brinco) {
            res.status(422).json({ message: 'Produto não existe' })
            return
        }
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        await Brinco.destroy({ where: { id: id } })

        res.status(200).json({ message: 'Produto removido com sucesso' })
    }


    static async updateBrinco(req, res) {
        const id = req.params.id
        const { nome, preco } = req.body

        const updateData = {}
        const brinco = await Brinco.findByPk(id);

        if (!brinco) {
            res.status(404).json({ message: "Produto não existe!" });
            return;
        }

        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (brinco.UserId !== currentUser.id) {
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
            await ImageBrinco.destroy({ where: { BrincoId: brinco.id } });
            for (let i = 0; i < imageFilenames.length; i++) {
                const filename = imageFilenames[i];
                const newImageBrinco = new ImageBrinco({ image: filename, BrincoId: brinco.id });
                await newImageBrinco.save();
            }

        }

        await Brinco.update(updateData, { where: { id: id } });

        res.status(200).json({ message: "att com successo!" })
    }

    static async concludeCompra(req, res) {
        const id = req.params.id;

        const brinco = await Brinco.findByPk(id);
        if (!brinco) {
            res.status(404).json({ message: "Produto não existe!" });
            return;
        }

        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (brinco.UserId !== currentUser.id) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        await brinco.save();

        res.status(200).json({ message: `Compra adicionada` })
    }

}