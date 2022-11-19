
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

// 统一数据包格式
const dataPacket = {
  from: '游客',
  to: 'group',
  fromImgId: 'string',
  toImgId: '9999',
  msg: '',
  toGroup: true,
  toSystem: false,
  time: ''
}
// 统一当前的登录信息
const loginUser = {
  loginName: 'string',
  imgId: 'string|number',
  onlineUsers: [],
  nowChat: 'onlineIndex'
}
function init (loginUser) {
  // 1. 当前登录用户的姓名以及头像 注意中文使用encodeURI
  let params = decodeURI(location.search).slice(1)
  // 判断当前参数是否为空
  // 如果参数不为空
  if (params) {
    let keyValue = params?.split('&')
    keyValue.forEach(item => {
      re = item.split('=')
      loginUser[re[0]] = re[1]
    })
  }
  // 如果参数为空
  else {
    loginUser.loginName = '游客',
      loginUser.imgId = '11',
      loginUser.nowChat = 1
    // 默认是群发消息

  }
  // 2. 设置左上角登录图像
  avatar.src = `./images/face/face${loginUser.imgId}.webp`
  // 渲染emojiBox
  let emojiArr = new Array(100).fill('./images/emoji/').map((item, index) => item + parseInt(index + 100) + '.gif')
  emojiArr.forEach(src => {
    const li = document.createElement('li')
    const img = document.createElement('img')
    img.setAttribute('src', src)
    li.appendChild(img)
    emojiBox.appendChild(li)
  })

}
init(loginUser)

// 各种事件






