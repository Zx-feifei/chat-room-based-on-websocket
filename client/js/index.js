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
const emojiBox = document.querySelector('.emojiBox')
// 聊天用户列表
const userList = document.querySelector('.msg-list ul')
// 表情选项
const emojiIcon = document.querySelector('.emoji i')
// 获取头像DOM
const avatar = document.querySelector('header img')
// 发送消息的时间
// const timeDi = document.querySelector('.message-wrapper ul')
// 默认用户名是zrt,图片是旺仔
let loginName = '游客'
let imgIndex = 11
  // 当前登录用户的姓名以及头像 注意中文使用encodeURI
  ; (function () {
    let params = decodeURI(location.search).slice(1)
    let keyValue = params?.split('&')
    let result = {}
    keyValue.forEach(item => {
      re = item.split('=')
      result[re[0]] = re[1]
    })
    // 保存当前登录的用户名
    loginName = result['name']
    imgIndex = result['img']

    // 设置左上角登录图像
    avatar.src = `./images/face/face${imgIndex ?? '11'}.webp`
  }
  )()

// 绑定按钮事件
btn.addEventListener('click', function () {
  sendMsg(input.value, loginName)
})
// 给input框绑定键盘事件
input.addEventListener('keydown', function (key) {
  if (key.keyCode === 13) {
    sendMsg(input.value, loginName)
    // 如果按下回车但是没有内容就提示，并让输入框失去焦点，防止误触enter
    // input.blur()
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
  // console.log(emojiBox.style.visibility)
  if (emojiBox.style.visibility === 'hidden') {
    // console.log('hidden变为visible')
    emojiBox.style.visibility = 'visible'
  }
  else if (emojiBox.style.visibility === 'visible') {
    emojiBox.style.visibility = 'hidden'
  }
})
  // 渲染emojiBox
  ; (function () {
    let emojiArr = new Array(100).fill('./images/emoji/').map((item, index) => item + parseInt(index + 100) + '.gif')
    emojiArr.forEach(src => {
      const li = document.createElement('li')
      const img = document.createElement('img')
      img.setAttribute('src', src)
      li.appendChild(img)
      emojiBox.appendChild(li)
    })
  })()
// 单个表情点击
emojiBox.addEventListener('click', function (e) {
  console.log(e)
})
// ws监听连接事件
ws.onopen = (e) => {
  console.log('建立了连接')
}
// ws监听消息事件
ws.onmessage = (msg) => {
  // console.log(msg.data)
  let ms = JSON.parse(msg.data)
  let imgInde = ms.imgIndex
  createEleLi(false, ms.msg, imgInde, ms.from)

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
function sendMsg (msg, loginName = '游客') {
  if (msg === '') {
    nullInputDesc.style.display = 'block'
    return
  }
  console.log(loginName)
  let sendInfo = {
    from: loginName,
    imgIndex,
    to: 'group',
    msg,
    time: formatTime()
  }
  ws.send(JSON.stringify(sendInfo))
  createEleLi(true, msg)
}
// 日期格式化函数
// console.log(ul.lastChild.innerHTML)

function formatTime () {
  const d = new Date()
  let hour = d.getHours()
  let minute = d.getMinutes()
  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute
  let [lastMinute, lastHour] = ul.lastElementChild.querySelector('.time span')?.innerHTML?.split(':')
  // 将时间格式转化为分钟判断
  const nowAddMinute = parseInt(hour) * 60 + parseInt(minute)
  const lastAddMinute = parseInt(lastHour) * 60 + parseInt(lastMinute)
  if (nowAddMinute - lastAddMinute > 3) {
    return hour + ':' + minute
  }
  return ''
  // 如果距离上次发送消息时间在10分钟以内则不显示发送时间


}
// 当接收到消息和发送消息后都创建li标签
// 默认为我发的消息
function createEleLi (me = false, msg = '', imgInde = 11, nickname) {
  const li = document.createElement('li')
  li.classList.add('message-item')
  let msgTime = formatTime()
  let template = `
  <div class="time" style="visibility:${msgTime ? 'visible' : 'hidden'}"><span>${msgTime}</span></div>
  <div class="message-main ${me ? 'self' : ''}"><img width="36" height="36" src="./images/face/face${me ? imgIndex ?? '11' : imgInde}.webp" class="avatar">
  <div class="nickName ${me ? 'my-name' : ''}">${nickname ?? loginName ?? '游客'}</div>
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