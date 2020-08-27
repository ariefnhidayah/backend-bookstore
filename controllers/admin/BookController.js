const config = require('../../config')
const Book = require('../../models/Book')
const Category = require('../../models/Category')
const fs = require('fs-extra') //untuk mengelola file / folder
const path = require('path')

Category.hasMany(Book, { 
    foreignKey: 'categoryId'
})

Book.belongsTo(Category, {
    foreignKey: 'categoryId'
})

module.exports = {
    index: async (req, res) => {
        const view_path = 'book/index.ejs'
        const isJavascript = false
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const book = await Book.findAll({
            include: [{
                model: Category
            }]
        })
        const alert = {
            message: alertMessage,
            status: alertStatus
        }
        const data = {
            content: view_path,
            menu_active: 'book',
            title: `Buku - ${config.site_name}`,
            isJavascript,
            alert,
            book
        }
        res.render('admin/index', data)
    },

    form: async (req, res) => {
        const category = await Category.findAll()
        const isJavascript = false;
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const alert = {
            message: alertMessage,
            status: alertStatus
        }
        if (req.params.id) {
            const { id } = req.params
            const view_path = 'book/form_edit.ejs'
            const book = await Book.findOne({
                where: {
                    id: id
                }
            })
            const data = {
                content: view_path,
                menu_active: 'book',
                title: `Edit Buku - ${config.site_name}`,
                isJavascript,
                category,
                alert,
                book
            }
            res.render('admin/index', data)
        } else {
            const view_path = 'book/form_add.ejs'
            const data = {
                content: view_path,
                menu_active: 'book',
                title: `Tambah Buku - ${config.site_name}`,
                isJavascript,
                category,
                alert
            }
            res.render('admin/index', data)
        }
    },

    add: async (req, res) => {
        try {
            let { name, author, description, price, stock, banner, categoryId, seo_url, weight } = req.body
            if (banner == undefined) {
                banner = 0
            } else {
                banner = 1
            }
            const check_url = await Book.findAll({
                where: {
                    seo_url: seo_url
                }
            })
            if (check_url.length > 0) {
                req.flash('alertMessage', 'Seo Url sudah digunakan!')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/book/add')
            } else {
                const book = await Book.create({
                    name,
                    author,
                    description,
                    price,
                    stock,
                    banner,
                    categoryId,
                    image: `images/${req.file.filename}`,
                    seo_url,
                    weight
                })
                if (book) {
                    req.flash('alertMessage', 'Buku berhasil ditambah')
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/book')
                } else {
                    req.flash('alertMessage', 'Buku gagal ditambah')
                    req.flash('alertStatus', 'danger')
                    res.redirect('/admin/book/add')
                }
            }
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/book/add')
        }
    },

    edit: async (req, res) => {
        const { id } = req.params
        try {
            let { name, author, description, price, stock, banner, categoryId, weight } = req.body
            if (banner == undefined) {
                banner = 0
            } else {
                banner = 1
            }
            const book = await Book.findOne({where: {id: id}})
            if (book) {
                if (req.file == undefined) {
                    await Book.update({
                        name: name,
                        author: author,
                        description: description,
                        price: price,
                        stock: stock,
                        banner: banner,
                        categoryId: categoryId,
                        weight: weight
                    }, {
                        where: {
                            id: id
                        }
                    })
                    req.flash('alertMessage', 'Buku berhasil diubah')
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/book')
                } else {
                    await fs.unlink(path.join(`public/${book.image}`))
                    await Book.update({
                        name: name,
                        author: author,
                        description: description,
                        price: price,
                        stock: stock,
                        banner: banner,
                        categoryId: categoryId,
                        image: `images/${req.file.filename}`,
                        weight: weight
                    }, {
                        where: {
                            id: id
                        }
                    })
                    req.flash('alertMessage', 'Buku berhasil diubah')
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/book')
                }
            } else {
                req.flash('alertMessage', 'Terjadi suatu kesalahan!')
                req.flash('alertStatus', 'danger')
                req.redirect('/admin/book/' + id)
            }
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.redirect('/admin/book/' + id)
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params
            const book = await Book.findOne({
                where: {
                    id: id
                }
            })
            if (book) {
                await fs.unlink(path.join(`public/${book.image}`))
                await Book.destroy({
                    where: {
                        id: id
                    }
                })
                req.flash('alertMessage', 'Buku berhasil dihapus')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/book')
            } else {
                req.flash('alertMessage', 'Gagal menghapus buku')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/book')
            }
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/book')
        }
    }
}