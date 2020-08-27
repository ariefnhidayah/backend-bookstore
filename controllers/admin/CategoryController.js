const config = require('../../config')
const Category = require('../../models/Category')
const Book = require('../../models/Book')
const fs = require('fs-extra') //untuk mengelola file / folder
const path = require('path')

module.exports = {

    index: async (req, res) => {
        const view_path = 'category/index.ejs'
        const isJavascript = true
        const srcJs = '/javascripts/category.js'
        const category = await Category.findAll()
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const alert = {
            message: alertMessage,
            status: alertStatus
        }
        const data = {
            content: view_path,
            menu_active: 'category',
            title: `Kategori - ${config.site_name}`,
            category,
            isJavascript,
            srcJs,
            alert
        }
        res.render('admin/index', data)
    },

    form_add: (req, res) => {
        const view_path = 'category/form_add.ejs'
        const isJavascript = false
        const data = {
            content: view_path,
            menu_active: 'category',
            title: `Tambah Kategory - ${config.site_name}`,
            isJavascript
        }
        res.render('admin/index', data)
    },

    save_add: async (req, res) => {
        try {
            const { name } = req.body
            const category = await Category.create({
                name: name
            })
            if (category) {
                req.flash('alertMessage', 'Kategori Berhasil Ditambah')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/category')
            } else {
                req.flash('alertMessage', 'Kategori Gagal Ditambah')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/category')
            }
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }
    },

    save_edit: async (req, res) => {
        try {
            const { id, name } = req.body
            const category = await Category.update({
                name: name
            }, {
                where: {
                    id: id
                }
            })
            if (category) {
                req.flash('alertMessage', 'Kategori Berhasil Diubah')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/category')
            } else {
                req.flash('alertMessage', 'Kategori Gagal Diubah')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/category')
            }
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params
            const book = await Book.findAll({
                where: {
                    categoryId: id
                }
            })
            if (book.length > 0) {
                for (let i = 0; i < book.length; i++) {
                    await fs.unlink(`public/${book[i].image}`)
                }
                await Book.destroy({
                    where: {
                        categoryId: id
                    }
                })
            }
            const category = await Category.destroy({
                where: {
                    id: id
                }
            })
            if (category) {
                req.flash('alertMessage', 'Kategori Berhasil Dihapus')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/category')
            } else {
                req.flash('alertMessage', 'Kategori Gagal Dihapus')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/category')
            }
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }
    }

}