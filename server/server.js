const ws = require('nodejs-websocket')
const express = requeire('express')
const app = express()
// 初始化用户以及用户头像列表
const groupPerson = {
  'aa': ['aa123', './images/face/face1.webp'],
  'bb': ['bb123', './images/face/face2.webp'],
  'cc': ['cc123', './images/face/face3.webp'],
  'dd': ['dd123', './images/face/face4.webp'],
  'ee': ['ee123', './images/face/face5.webp'],
  'ff': ['ff123', './images/face/face6.webp'],
  'gg': ['gg123', './images/face/face0.webp']
}
app.get('/login', (req, res) => {
  console.log(req.query)
})
app.listen(8001, function () {
  console.log('express is listen on 8001')
})
// 连接的数组
const connectList = []
// 建立连接通道
const server = ws.createServer(conn => {
  console.log('来了一个新用户')
  // 监听消息事件
  conn.on('text', function (str) {
    console.log('接收到的数据为', str)
    conn.sendText(`${str}666666`)
  })

  // 监听连接事件
  conn.on('connect', function (code) {
    console.log('开启连接', code)
  })

  // 监听关闭事件
  conn.on('close', function (code, reason) {
    console.log('当前连接被关闭！', code, reason)
  })
  // 监听异常事件
  conn.on('error', function (code) {
    console.log('异常断开', code)
  })
})

// 监听8000端口
server.listen(8000, function () {
  console.log('websocket is listening on port 8000')
})
function broadcast (msg) {
  server.connectList.forEach(connect => {
    conn.send(JSON.stringify(msg))
  })
}