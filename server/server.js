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
// 连接用户数 
let onlineUser = []
// 建立连接通道
const server = ws.createServer(conn => {

  connectList.push(conn)
  let str = `房间来了第${connectList.length}个用户,当前共有${connectList.length}个用户在线`
  console.log(str)
  // 监听消息事件
  conn.on('text', function (str) {
    let getInfo = JSON.parse(str)
    console.log(getInfo.toGroup, getInfo.toSystem)
    if (getInfo.to === 'group') {
      broadcast(false, conn, getInfo)
      console.log('消息发送了')
    }
    else if (getInfo.to === 'system') {
      onlineUser.push(getInfo)
      // getInfo.onlineUsers = JSON.stringify(onlineUser)
      console.log(getInfo)
      broadcast(true, conn, getInfo)
      console.log('系统收到了消息')
    }
  })


  // 监听关闭事件
  conn.on('close', function (code, reason) {
    if (code == 1001) console.log('对方关闭了连接')
    // 关闭将当前连接通道移除
    let index = connectList.indexOf(conn)
    // console.log('onlineUserList')
    // console.log(onlineUser[index])
    connectList.splice(index, 1)
    // let underlineUserInfo = Object.assign({}, onlineUser[index])
    // underlineUserInfo.underline = true
    // console.log(onlineUser[index])
    // console.log(underlineUserInfo, '下线了')
    // onlineUser.splice(index, 1)
    // broadcast(false, undefined, underlineUserInfo)
  })
  // 监听异常事件
  conn.on('error', function (code) {
    console.log('连接异常断开')
  })
})
function broadcast (includeMe = false, conn, getInfo) {
  if (!includeMe) {
    connectList.forEach(connect => {
      // 不用对自己广播
      if (connect !== conn) {
        connect.sendText(JSON.stringify(getInfo))
      }
    })
  }
  // 不对自己广播
  else {
    connectList.forEach(connect => {
      // 也要对自己广播
      connect.sendText(JSON.stringify(getInfo))

    })
  }
}
// 监听8000端口
server.listen(8000, function () {
  console.log('websocket is listening on port 8000')
})
