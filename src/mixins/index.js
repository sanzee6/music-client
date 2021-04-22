import {likeSongOfName, getCollectOfUserId} from '../api/index'
import {mapGetters} from 'vuex'
export const mixin = {
  computed: {
    ...mapGetters([
      'loginIn', // 登录状态
      'userId' // 当前登录用户的id
    ])
  },
  methods: {
    // 提示信息
    notify (title, type) {
      this.$notify({
        title: title,
        type: type
      })
    },
    // 获取图片地址
    attachImageUrl (srcUrl) {
      return srcUrl ? this.$store.state.configure.HOST + srcUrl : this.$store.state.configure.HOST + '/img/user.jpg'
    },
    // 根据歌手名字模糊搜索
    getSong () {
      if (!this.$route.query.keywords) {
        this.$store.commit('setListOfSongs', [])
        this.notify('您输入的内容为空', 'warning')
      } else {
        likeSongOfName(this.$route.query.keywords)
          .then(res => {
            if (!res.length) {
              this.$store.commit('setListOfSongs', [])
              this.notify('为搜索到符合条件的歌曲', 'warning')
            } else {
              this.$store.commit('setListOfSongs', res)
            }
          }).catch(err => {
            console.log(err)
          })
      }
    },
    // 或缺名字前半部分歌手名--歌名
    replaceLName (str) {
      let arr = str.split('-')
      return arr[0]
    },
    replaceFName (str) {
      let arr = str.split('-')
      return arr[1]
    },
    // 播放功能
    toplay: function (id, url, pic, index, name, lyric) { // id 地址 图片 序号 歌名 歌词
      this.$store.commit('setId', id)
      this.$store.commit('setUrl', this.$store.state.configure.HOST + url)
      this.$store.commit('setPicUrl', this.$store.state.configure.HOST + pic)
      this.$store.commit('setListIndex', index)
      this.$store.commit('setTitle', this.replaceFName(name)) //  歌名
      localStorage.setItem('songTitle', this.replaceFName(name))
      this.$store.commit('setArtist', this.replaceLName(name)) // 歌手名
      this.$store.commit('setLyric', this.parseLyric(lyric))
      this.$store.commit('setIsActive', false)
      if (this.loginIn) {
        getCollectOfUserId(this.userId)
          .then(res => {
            for (let item of res) {
              if (item.songId === id) {
                this.$store.commit('setIsActive', true)
                break
              }
            }
          })
      }
    },
    // 解析歌词
    parseLyric (text) {
      let lines = text.split('\n') // 将歌词按行分解成数组
      let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g // 时间格式的正则表达式
      let result = [] // 返回值
      // 对于歌词格式不对的直接返回
      if (!(/\[.+\]/.test(text))) {
        return [[0, text]]
      }
      // 去掉前面格式不正确的行
      while (!pattern.test(lines[0])) {
        lines = lines.slice(1)
      }
      // 遍历每一行，形成一个每行带着俩元素的数组，第一个元素是以秒为计算单位的时间，第二个元素是歌词
      for (let item of lines) {
        let time = item.match(pattern) // 存前面的时间段
        let value = item.replace(pattern, '')// 存后面的歌词
        for (let item1 of time) {
          let t = item1.slice(1, -1).split(':') // 取出时间，换算成数组
          if (value !== '') {
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value])
          }
        }
      }
      // 按照第一个元素--时间--排序
      result.sort(function (a, b) {
        return a[0] - b[0]
      })
      return result
    },
    // 从数据库获取歌手生日显现到歌手页面
    attachBirth (val) {
      return val.substr(0, 10)
    }
  }
}
