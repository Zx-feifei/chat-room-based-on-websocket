const ws = require('nodejs-websocket')
// const express = requeire('express')
// const app = express()
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
// 连接的数组
const connectList = []
// 建立连接通道
const server = ws.createServer(conn => {
  // console.log('来了一个新用户')
  connectList.push(conn)
  console.log(connectList.length)
  // 监听消息事件
  conn.on('text', function (str) {
    let getInfo = JSON.parse(str)
    if (getInfo.to === 'group') {
      console.log(getInfo.from, getInfo.to, getInfo.msg, getInfo.imgIndex, getInfo.time)
      // let groupInfo = getInfo.msg
      connectList.forEach(connect => {
        // 不用对自己广播
        if (connect !== conn) {
          connect.sendText(JSON.stringify(getInfo))
        }
      })
    }
  })

  // 监听连接事件
  conn.on('connect', function (code) {
    console.log('开启连接', code)
  })

  // 监听关闭事件
  conn.on('close', function (code, reason) {
    if (code == 1001) console.log('对方关闭了连接')
    // 关闭将当前连接通道移除
    connectList.splice(connectList.indexOf(conn), 1)
  })
  // 监听异常事件
  conn.on('error', function (code) {
    console.log('连接异常断开', code)
  })
})

// 监听8000端口
server.listen(8000, function () {
  console.log('websocket is listening on port 8000')
})
