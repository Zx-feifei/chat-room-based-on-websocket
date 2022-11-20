// Enter和btn都要发送消息，封装成函数
function sendMsg (info) {
  if (info.msg === '') {
    console.log('neirong 不能为空')
    nullInputDesc.style.display = 'block'
    return
  }
  ws.send(JSON.stringify(info))
  // 如果是自己发送的消息，则不需要传递第二个参数，也就是接收到的数据包，第一个参数默认为true
  createEleLi(true, info)
}

// 日期格式化函数
function formatTime () {

  let d = new Date().toLocaleTimeString()
  let [nowH, nowM] = d.split(':')
  let allM = parseInt(nowH) * 60 + parseInt(nowM)
  let s = ul.querySelectorAll('.time span')
  // 之前没有发送过消息
  if (s.length === 0) {
    return nowH + ':' + nowM
  } else {
    // console.log('s的length不为0')
    let [h, m] = s[s.length - 1].innerHTML.split(':')
    // 之前的时间
    let al = parseInt(h) * 60 + parseInt(m)
    // console.log(allM, al)
    console.log(al)
    if (allM - al > 2) {
      // console.log(nowH + ':' + nowM)
      return nowH + ':' + nowM
    }
    else {
      return ''
    }
  }
}
formatTime()
// 当接收到消息和发送消息后都创建li标签
// 默认为我发的消息
function createEleLi (isMe, data) {
  const li = document.createElement('li')
  li.classList.add('message-item')
  let nowTime = formatTime()
  let template = ''
  if (data.msgType === 0) {
    template = `
  <div class="time" style="visibility:${nowTime ? 'visible' : 'hidden'}"><span>${nowTime}</span></div>
  <div class="message-main ${isMe ? 'self' : ''}"><img width="36" height="36" src="./images/face/face${isMe ? loginUser.imgId : data.fromImgId}.webp" class="avatar">
  <div class="nickName ${isMe ? 'my-name' : ''}">${isMe ? loginUser.loginName : data.from}</div>
    <div class="content">
      <div class="text">${isMe ? input.value : data.msg}</div>
    </div>
  </div>
  `
  }
  // msgType为2则说明是系统群发的某人上线
  else if (data.msgType === 1) {
    template = `
    <div class="time" style="margin-bottom:10px;"><strong
      style="color:rgb(222, 85, 85);font-weight: bold;">${data.from} </strong>于<strong style="color:rgb(69, 219, 69);margin-right:2px;font-weight: bold;margin-left:12px;">${data.time}</strong>上线
    </div>`
  }
  // msgType为2则说明是系统群发的某人下线
  else if (data.msgType === 2) {
    template = `
    <div class="time" style="margin-bottom:10px;"><strong
      style="color:rgb(222, 85, 85);font-weight: bold;">${data.from} </strong>下线了
    </div>`
  }
  li.innerHTML = template
  ul.appendChild(li)
  input.value = ''
  // 让ul滚动到最底部
  ul.scrollTo(0, 999, 'smooth')
}


function createOrDeleteUser () {
  userList.innerHTML = ''

  loginUser.onlineUsers.forEach(user => {
    const li = document.createElement('li')
    li.setAttribute('class', 'session-list')
    let temp = ` 
    <div class="list-left">
      <img width="42" height="42" alt="我的好友" src="./images/face/face${user.imgId}.webp" class="avatar">
    </div>
    <div class="list-right">
      <p class="name">${user.name}</p> <span class="time">${user.time}</span>
      <p class="last-msg">按回车可以发送信息，还可以给我发送表情哟</p>
    </div>`
    li.innerHTML = temp
    userList.appendChild(li)
  })
}