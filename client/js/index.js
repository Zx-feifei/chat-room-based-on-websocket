// 创建websocket对象
const ws = new WebSocket('ws://localhost:8000')
// 获取输入框DOM
const input = document.querySelector('.send-text textarea')
// 获取发送按钮
const btn = document.querySelector('.send')
// 获取聊天内容的盒子
const ul = document.querySelector('.message-wrapper ul')
// 获取发送为空的提示框
const nullInputDesc = document.querySelector('.warn')
// 获取表情盒子
const enjoyBox = document.querySelector('.emojiBox')
// 初始化讨论组成员
const groupPerson = {
  'aa': './images/face/face1.webp',
  'bb': './images/face/face2.webp',
  'cc': './images/face/face3.webp',
  'dd': './images/face/face4.webp',
  'ee': './images/face/face5.webp',
  'ff': './images/face/face6.webp',
  'gg': './images/face/face0.webp'
}

// 绑定按钮事件
btn.addEventListener('click', function () {
  sendMsg(input.value)
})
// 给input框绑定键盘事件
input.addEventListener('keydown', function (key) {
  if (key.keyCode === 13) {
    sendMsg(input.value)
  }
})
// 给输入框绑定焦点事件，获得焦点之后 输入不能为空取消显示
input.addEventListener('focus', function () {
  nullInputDesc.style.display = 'none'
})
// ws监听连接事件
ws.onopen = (e) => {
  console.log('建立了连接')
}
// ws监听消息事件
ws.onmessage = (msg) => {
  createEleLi(false, msg.data)

}
// ws监听异常事件
ws.onerror = (err) => {
  console.log('服务器异常', err)
  alert('异常断开了连接')
}
ws.onclose = () => {
  alert('结束了连接')
}


// Enter和btn都要发送消息，封装成函数
function sendMsg (msg) {
  if (msg === '') {
    nullInputDesc.style.display = 'block'
    return
  }
  ws.send(msg)
  createEleLi(true, msg)

}
// 日期格式化函数
function formatTime () {
  const d = new Date()
  let hour = d.getHours()
  let minute = d.getMinutes()
  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute
  return hour + ':' + minute
}
// 当接收到消息和发送消息后都创建li标签
// 默认为我发的消息
function createEleLi (me = true, msg = '') {
  const li = document.createElement('li')
  li.classList.add('message-item')
  let msgTime = formatTime()
  let template = `
  <div class="time"><span>${msgTime}</span></div>
  <div class="message-main ${me ? 'self' : ''}"><img width="36" height="36" src="./images/face/face${me ? '0' : '1'}.webp" class="avatar">
    <div class="content">
      <div class="text">${msg}</div>
    </div>
  </div>
  `
  li.innerHTML = template
  ul.appendChild(li)
  input.value = ''
  // 让ul滚动到最底部
  ul.scrollTo(0, 999, 'smooth')
}