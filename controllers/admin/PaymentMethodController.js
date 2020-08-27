const config = require('../../config')
const Payment_method = require('../../models/Payment_method')
const fs = require('fs-extra') //untuk mengelola file / folder
const path = require('path')

module.exports = {

    index: async (req, res) => {
        const view_path = 'payment_method/index.ejs'
        const isJavascript = false
        // const srcJs = '/javascripts/payment_method.js'
        const payment_method = await Payment_method.findAll()
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const alert = {
            message: alertMessage,
            status: alertStatus
        }
        const data = {
            content: view_path,
            menu_active: 'payment-method',
            title: `Metode Pembayaran - ${config.site_name}`,
            isJavascript,
            // srcJs,
            alert,
            payment_method
        }
        res.render('admin/index', data)
    },

    form: async (req, res) => {
        const isJavascript = false;
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const alert = {
            message: alertMessage,
            status: alertStatus
        }
        if (req.params.id) {
            const { id } = req.params
            const view_path = 'payment_method/form_edit.ejs'
            const payment_method = await Payment_method.findOne({
                where: {
                    id: id
                }
            })
            const data = {
                content: view_path,
                menu_active: 'payment-method',
                title: `Edit Metode Pembayaran - ${config.site_name}`,
                isJavascript,
                alert,
                payment_method
            }
            res.render('admin/index', data)
        } else {
            const view_path = 'payment_method/form_add.ejs'
            const data = {
                content: view_path,
                menu_active: 'payment-method',
                title: `Tambah Metode Pembayaran - ${config.site_name}`,
                isJavascript,
                alert
            }
            res.render('admin/index', data)
        }
    },

    add: async (req, res) => {
        try {
            const { name_bank, account_name, account_number } = req.body
            const payment_method = await Payment_method.create({
                name_bank,
                account_name,
                account_number,
                image: `images/${req.file.filename}`
            })
            if (payment_method) {
                req.flash('alertMessage', 'Metode pembayaran berhasil ditambah!')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/payment-method')
            } else {
                req.flash('alertMessage', 'Metode pembayaran gagal ditambah!')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/payment-method')
            }
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/payment-method')
        }
    },

    edit: async (req, res) => {
        const { id } = req.params
        try {
            const { name_bank, account_number, account_name } = req.body
            const payment_method = await Payment_method.findOne({where: {id: id}})
            if (payment_method) {
                if (req.file == undefined) {
                    await Payment_method.update({
                        name_bank,
                        account_name,
                        account_number
                    }, {
                        where: {
                            id: id
                        }
                    })
                    req.flash('alertMessage', 'Metode pembayaran berhasil diubah!')
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/payment-method')
                } else {
                    await fs.unlink(path.join(`public/${payment_method.image}`))
                    await Payment_method.update({
                        name_bank,
                        account_name,
                        account_number,
                        image: `images/${req.file.filename}`
                    }, {
                        where: {
                            id: id
                        }
                    })
                    req.flash('alertMessage', 'Metode pembayaran berhasil diubah!')
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/payment-method')
                }
            } else {
                req.flash('alertMessage', 'Metode pembayaran gagal diubah!')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/payment-method')
            }
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/payment-method/' + id)
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params
            const payment_method = await Payment_method.findOne({where: {id: id}})
            if (payment_method) {
                await fs.unlink(path.join(`public/${payment_method.image}`))
                await Payment_method.destroy({
                    where: {
                        id: id
                    }
                })
                req.flash('alertMessage', 'Metode pembayaran berhasil dihapus!')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/payment-method')
            } else {
                req.flash('alertMessage', 'Metode pembayaran gagal dihapus!')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/payment-method')    
            }
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/payment-method')
        }
    }

}