// Enter和btn都要发送消息，封装成函数
function sendMsg (info) {
  if (info.msg === '') {
    console.log('neirong 不能为空')
    nullInputDesc.style.display = 'block'
    return
  }
  console.log(info)
  ws.send(JSON.stringify(info))
  // createEleLi(true, to, msg, imgIndex)
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
function createEleLi (info) {
  const li = document.createElement('li')
  li.classList.add('message-item')
  let msgTime = formatTime()
  let template = ''
  if (info.toGroup) {
    template = `
    <div class="time" style="visibility:${msgTime ? 'visible' : 'hidden'}"><span>${info.time}</span></div>
    <div class="message-main ${me ? 'self' : ''}"><img width="36" height="36" src="./images/face/face${me ? imgIndex : imgInde}.webp" class="avatar">
    <div class="nickName ${me ? 'my-name' : ''}">${me ? loginName : '匿名'}</div>
      <div class="content">
        <div class="text">${msg}</div>
      </div>
    </div>
    `
  }
  else if (to === 'system') {
    template = `
    <div class="time"><span><strong
      style="color:rgb(222, 85, 85);margin-right:4px;font-weight: bold;">${1}</strong>用户已上线</span>
    </div>`
  }
  li.innerHTML = template
  ul.appendChild(li)
  input.value = ''
  // 让ul滚动到最底部
  ul.scrollTo(0, 999, 'smooth')
}

