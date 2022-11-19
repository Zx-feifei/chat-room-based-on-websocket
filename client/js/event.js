// 绑定按钮事件
btn.addEventListener('click', function () {
  const data = Object.assign({}, dataPacket)
  data.msg = input.value
  data.from = loginUser.loginName
  data.time = new Date().toLocaleTimeString()
  data.fromImgId = loginUser.imgId
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
  const data = Object.assign({}, dataPacket)
  data.toSystem = true
  data.from = loginUser.loginName
  data.to = 'system'
  ws.send(JSON.stringify(data))
}
// ws监听消息事件
ws.onmessage = (msg) => {
  let ms = JSON.parse(msg.data)
  console.log(ms)
  // 不判断字符串是为了防止跟用户的名字冲突
  if (ms.toGroup && !ms.toSystem) {
    createEleLi(false, ms)
  }
  else if (ms.to === 'system' && ms.toSystem) {
    console.log('接收到了系统消息')
    console.log(ms)
    createEleLi(false, ms)
  }
}
// ws监听异常事件
ws.onerror = (err) => {
  console.log('服务器异常', err)
  alert('异常断开了连接')
}
ws.onclose = () => {
  alert('结束了连接')
}