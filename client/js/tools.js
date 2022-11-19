// Enter和btn都要发送消息，封装成函数
function sendMsg (info) {
  if (info.msg === '') {
    console.log('neirong 不能为空')
    nullInputDesc.style.display = 'block'
    return
  }
  ws.send(JSON.stringify(info))
  createEleLi(true)
}

// 日期格式化函数
function formatTime (flag = true) {
  const d = new Date()
  let hour = d.getHours()
  let minute = d.getMinutes()
  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute
  if (flag) {
    let [lastMinute, lastHour] = ul?.lastElementChild?.querySelector('.time span')?.innerHTML?.split(':')
    // 将时间格式转化为分钟判断
    const nowAddMinute = parseInt(hour) * 60 + parseInt(minute)
    const lastAddMinute = parseInt(lastHour) * 60 + parseInt(lastMinute)
    if (nowAddMinute - lastAddMinute > 3) {
      return hour + ':' + minute
    }
    return ''
    // 如果距离上次发送消息时间在10分钟以内则不显示发送时间
  } else {
    return hour + ':' + minute
  }
}
// 当接收到消息和发送消息后都创建li标签
// 默认为我发的消息
function createEleLi (isMe, data) {
  const li = document.createElement('li')
  li.classList.add('message-item')
  console.log(data)
  let template = ''
  // style="visibility:${msgTime ? 'visible' : 'hidden'}"

  template = `
    <div class="time" ><span>${new Date().toLocaleTimeString()}</span></div>
    <div class="message-main ${isMe ? 'self' : ''}"><img width="36" height="36" src="./images/face/face${isMe ? loginUser.imgId : data.fromImgId}.webp" class="avatar">
    <div class="nickName ${isMe ? 'my-name' : ''}">${isMe ? loginUser.loginName : data.from}</div>
      <div class="content">
        <div class="text">${isMe ? input.value : data.msg}</div>
      </div>
    </div>
    `

  // else if (to === 'system') {
  //   template = `
  //   <div class="time"><span><strong
  //     style="color:rgb(222, 85, 85);margin-right:4px;font-weight: bold;">${1}</strong>用户已上线</span>
  //   </div>`
  // }
  li.innerHTML = template
  ul.appendChild(li)
  input.value = ''
  // 让ul滚动到最底部
  ul.scrollTo(0, 999, 'smooth')
}

