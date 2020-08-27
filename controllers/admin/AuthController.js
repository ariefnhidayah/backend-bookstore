const config = require('../../config')
const Admin = require('../../models/Admin')
const bcrypt = require('bcrypt')

module.exports = {
    index: async (req, res) => {
        if (req.session.user == null || req.session.user == undefined) {
            const view_path = 'auth/login.ejs'
            const isJavascript = false
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {
                message: alertMessage,
                status: alertStatus
            }
            const data = {
                content: view_path,
                title: `Buku - ${config.site_name}`,
                isJavascript,
                alert
            }
            res.render('admin/auth/login.ejs', data)
        } else {
            res.redirect('/admin/dashboard')
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body
            const admin = await Admin.findOne({
                where: {
                    username: username
                }
            })
            if (admin) {
                const isPasswordMatch = await bcrypt.compare(password, admin.password)
                if (!isPasswordMatch) {
                    req.flash('alertMessage', 'Password salah!')
                    req.flash('alertStatus', 'danger')
                    res.redirect('/admin/login')
                } else {
                    req.session.user = {
                        id: admin.id,
                        username: username,
                        name: admin.name
                    }
                    res.redirect('/admin/dashboard')
                }
            } else {
                req.flash('alertMessage', 'Akun tersebut tidak ada!')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/login')
            }
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/login')
        }
    },

    logout: async (req, res) => {
        req.session.destroy()
        res.redirect('/admin/login')
    }
}