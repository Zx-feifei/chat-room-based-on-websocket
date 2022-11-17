const { connect } = require('http2')
const { findSourceMap } = require('module')
const ws = require('nodejs-websocket')

const TYPE_ENTER = 0
const TYPE_LEAVE = 1
const TYPE_MSG = 2
/*    type:消息的类型      0:进入      1:离开      2:正常message  */

// 记录当前连接上来的用户数量
let count = 0

// connect 代表每个连接到服务器的用户，都会有一个connect对象
const server = ws.createServer(connect => {
  console.log('新的连接')
  count++
  connect.userName = `用户${count}`

  // 1.告诉所有用户，有人加入了聊天室
  broadcast({
    type: TYPE_ENTER,
    msg: `${connect.userName}进入了聊天室`,
    time: new Date().toLocaleTimeString()
  })

  // 每当接受到用户传递数据过来(客户端的send方法)，text事件就会被触发
  connect.on('text', data => {
    // 2.当我们接收到某个用户的数据,广播给所有用户
    console.log('接受到数据：' + data)
    broadcast({
      type: TYPE_MSG,
      msg: connect.userName + "：" + data,
      time: new Date().toLocaleTimeString()
    })
  })

  // 关闭连接时触发
  connect.on('close', data => {
    console.log('关闭连接')

    // 3.有人离开了,广播给所有用户
    count--
    broadcast({
      type: TYPE_LEAVE,
      msg: `${connect.userName}离开了聊天室`,
      time: new Date().toLocaleTimeString()
    })
  })
  // 发生异常
  connect.on('error', data => {
    console.log("发生异常")
  })
})

// 广播,给所有的用户发送消息  connections(这个数组里,保存了每个连接)
function broadcast (msg) {
  server.connections.forEach(connect => {
    connect.send(JSON.stringify(msg))
  })
}

server.listen(8000, () => {
  console.log('Server started Complete: ws://127.0.0.1:8000')
})
