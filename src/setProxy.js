const {createProxyMiddleware} = require('http-proxy-middleware')
module.exports = app = {
    app.use(
        createProxyMiddleware('/en-us/39578023/kipp/api/roomtype/GetRoomList?recStatus=1,0',
        {
            target:"https://ycs.agoda.com",
            changeOrigin:true
        })
    )
    }