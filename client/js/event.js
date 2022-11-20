// 绑定按钮事件
btn.addEventListener('click', function () {
  const data = Object.assign({}, dataPacket)
  data.msg = input.value
  data.from = loginUser.loginName
  data.time = new Date().toLocaleTimeString()
  data.fromImgId = loginUser.imgId
  data.msgType = 0
  sendMsg(data)
})
// 给input框绑定键盘事件
input.addEventListener('keydown', function (key) {
  if (key.keyCode === 13) {
    const data = Object.assign({}, dataPacket)
    data.msg = input.value
    data.from = loginUser.loginName
    data.time = new Date().toLocaleTimeString()
    data.fromImgId = loginUser.imgId
    data.msgType = 0
    sendMsg(data)
    // 如果按下回车但是没有内容就提示，并让输入框失去焦点，防止误触enter
    key.preventDefault()
  }
})
// 给输入框绑定焦点事件，获得焦点之后 输入不能为空取消显示
input.addEventListener('focus', function () {
  nullInputDesc.style.display = 'none'
  emojiBox.style.visibility = 'hidden'
})
// 点击表情盒子显示
emojiIcon.addEventListener('click', function () {
  if (emojiBox.style.visibility === 'hidden') {
    emojiBox.style.visibility = 'visible'
  }
  else if (emojiBox.style.visibility === 'visible') {
    emojiBox.style.visibility = 'hidden'
  }
})


// 单个表情点击
emojiBox.addEventListener('click', function (e) {
  console.log(e)
})
// ws监听连接事件
ws.onopen = (e) => {
  // 刚连接时将自身的相关信息发送给服务端
  const data = Object.assign({}, dataPacket)
  data.toSystem = true
  data.from = loginUser.loginName
  data.to = 'system'
  data.fromImgId = loginUser.imgId
  data.time = new Date().toLocaleTimeString().slice(0,5)
  data.msgType = 1
  ws.send(JSON.stringify(data))
}
// ws监听消息事件
ws.onmessage = (msg) => {
  let ms = JSON.parse(msg.data)
  // 0代表群发消息
  if (ms.msgType === 0) {
    createEleLi(false, ms)
  }
  // 1代表系统提示的消息
  else if (ms.msgType === 1) {

    createEleLi(false, ms)
    if(ms.onlineUser) {
      loginUser.onlineUsers = []
      ms.onlineUser.split(',').forEach(item=>{
        // let onlineU = {}
        const onlineU = {}
        const nameImgId = item.split('/-_-/')
        onlineU.name = nameImgId[0]
        onlineU.imgId = nameImgId[1]
        onlineU.time = nameImgId[2]
       loginUser.onlineUsers.push(onlineU)
      })
    }
    createOrDeleteUser()
    
  }
  // 2代表系统广播用户下线
  else if(ms.msgType === 2) {
    ms.from
    let index = loginUser.onlineUsers.findIndex((item=>{
      return item.name === ms.from
    }))

    loginUser.onlineUsers.splice(index,1)
    createEleLi(false, ms)
    console.log('有人下线了');
    createOrDeleteUser()
  }
  console.log(ms);

}
// ws监听异常事件
ws.onerror = (err) => {
  console.log('服务器异常', err)
  alert('异常断开了连接')
}
// 监听关闭事件
ws.onclose = () => {
  console.log('服务器断开了连接')
}
//   
// console.log(loginUser.onlineUsers)