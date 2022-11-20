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
  console.log(`当前共有${connectList.length}个用户在线`)
  // 监听消息事件
  conn.on('text', function (str) {
    let getInfo = JSON.parse(str)
    if (getInfo.msgType === 0) {
      broadcast(false, conn, getInfo)
    }
    else if (getInfo.msgType === 1) {
      onlineUser.push(getInfo)
      getInfo.onlineUser = onlineUser.map(item => {
        return item.from + '/-_-/' + item.fromImgId + '/-_-/' + item.time
      }).join(',')
      broadcast(true, conn, getInfo)
      console.log(getInfo)
    }

  })


  // 监听关闭事件
  conn.on('close', function (code, reason) {
    if (code == 1001) console.log('对方关闭了连接')
    // 关闭将当前连接通道移除
    let index = connectList.indexOf(conn)
    connectList.splice(index, 1)
    const underLineUser = Object.assign({}, onlineUser.splice(index, 1)[0])
    underLineUser.msgType = 2

    // getInfo.onlineUser = onlineUser.map(item => {
    //   return item.from + '/-_-/' + item.fromImgId + '/-_-/' + item.time
    // }).join(',')
    connectList.forEach(connect => {
      connect.sendText(JSON.stringify(underLineUser))
    })
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
