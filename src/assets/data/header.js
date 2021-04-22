// 定义左侧导航栏
const navMsg = [
  {name: '首页', path: '/'},
  {name: '歌单', path: '/song-list'},
  {name: '歌手', path: '/singer'},
  {name: '我的音乐', path: '/my-music'},
  {name: '为你推荐', path: '/tag'}
]

// 定义右侧导航栏  （登录功能）
const loginMsg = [
  {name: '登录', path: '/login-in'},
  {name: '注册', path: '/sign-up'}
]

// 用户下拉菜单
const menuList = [
  {name: '设置', path: '/setting'},
  {name: '退出', path: 0}
]

export {
  loginMsg,
  navMsg,
  menuList
}
