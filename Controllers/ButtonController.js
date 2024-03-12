const Button = require('../Model/Button/Button')
const User = require('../Model/User')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const jwt = require('jsonwebtoken')
const ImageButton = require('../Model/Button/ImageButton')

module.exports = class ButtonController {
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

        const button = new Button({
            nome: nome,
            preco: preco,
            UserId: currentUser.id,
            admin : admin
        });

        try {
            const newButton = await button.save();

            const images = req.files;
            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    const filename = images[i].filename;
                    const newImageButton = new ImageButton({ image: filename, ButtonId: newButton.id });
                    await newImageButton.save();
                }
            }
            res.status(201).json({ message: 'Produto cadastrado com sucesso', newButton });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAll(req, res) {
        const buttons = await Button.findAll({
            order: [['createdAt', 'DESC']],
            include: ImageButton
        });
        res.status(200).json({ buttons : buttons });

    }

    static async getAllUserButton(req, res) {
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        const buttons = await Button.findAll({
            where: { userId: currentUserId },
            order: [['createdAt', 'DESC']],
            include: ImageButton
        })

        res.status(200).json({ buttons })

    }

    static async getButtonById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'ID Inválido' })
            return
        }
        const button = await Button.findByPk(id, { include: ImageButton });

        if (!button) {
            res.status(422).json({ message: 'Produto não existe' })
            return
        }

        res.status(200).json({ button : button })
    }

    static async removeButtonById(req, res) {
        const id = req.params.id

        if (isNaN(id)) {
            res.status(422).json({ message: 'ID Inválido' })
            return
        }
        const button = await Button.findByPk(id)

        if (!button) {
            res.status(422).json({ message: 'Produto não existe' })
            return
        }
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        await Button.destroy({ where: { id: id } })

        res.status(200).json({ message: 'Produto removido com sucesso' })
    }


    static async updateButton(req, res) {
        const id = req.params.id
        const { nome, preco } = req.body

        const updateData = {}
        const button = await Button.findByPk(id);

        if (!button) {
            res.status(404).json({ message: "Produto não existe!" });
            return;
        }

        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (button.UserId !== currentUser.id) {
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
            await ImageButton.destroy({ where: { ButtonId: button.id } });
            for (let i = 0; i < imageFilenames.length; i++) {
                const filename = imageFilenames[i];
                const newImageButton = new ImageButton({ image: filename, ButtonId: button.id });
                await newImageButton.save();
            }

        }

        await Button.update(updateData, { where: { id: id } });

        res.status(200).json({ message: "att com successo!" })
    }

    static async concludeCompra(req, res) {
        const id = req.params.id;

        const button = await Button.findByPk(id);
        if (!button) {
            res.status(404).json({ message: "Produto não existe!" });
            return;
        }

        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (button.UserId !== currentUser.id) {
            res.status(422).json({ message: "ID inválido!" });
            return;
        }

        await button.save();

        res.status(200).json({ message: `Compra adicionada` })
    }

}