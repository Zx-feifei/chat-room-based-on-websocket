// 绑定按钮事件
btn.addEventListener('click', function () {
  dataPacket.msg = input.value
  dataPacket.from = loginUser.loginName
  dataPacket.time = new Date().toLocaleString()
  sendMsg(dataPacket)
})
// 给input框绑定键盘事件
input.addEventListener('keydown', function (key) {
  if (key.keyCode === 13) {
    dataPacket.msg = input.value
    dataPacket.from = loginUser.loginName
    dataPacket.time = new Date().toLocaleString()
    dataPacket.fromImgId = loginUser.imgId
    sendMsg(dataPacket)
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
  console.log('建立了连接')
  // const userItem = {
  //   from: loginName,
  //   imgId: imgIndex,
  //   to: 'system',
  //   intro: '',
  //   time: new Date().toLocaleDateString()
  // }
  // console.log(userItem)
  // ws.send(JSON.stringify(userItem))
}
// ws监听消息事件
ws.onmessage = (msg) => {
  let ms = JSON.parse(msg.data)
  // console.log(ms)
  console.log('接收到了消息', ms)
  createEleLi(false, ms)

}
// ws监听异常事件
ws.onerror = (err) => {
  console.log('服务器异常', err)
  alert('异常断开了连接')
}
ws.onclose = () => {
  alert('结束了连接')
}