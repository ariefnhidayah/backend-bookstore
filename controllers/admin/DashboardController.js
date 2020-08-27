const config = require('../../config')

module.exports = {

    index: (req, res) => {
        const view_path = 'dashboard/index.ejs'
        const isJavascript = false
        const data = {
            content: view_path,
            menu_active: 'dashboard',
            title: `Dashboard - ${config.site_name}`,
            isJavascript
        }
        res.render('admin/index', data)
    }

}