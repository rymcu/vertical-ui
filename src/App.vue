<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import SockJS from  'sockjs-client';
import Stomp from 'stompjs';
export default {
  name: 'app',
  computed: {
    hasPermissions() {
      return this.$store.getters.hasPermissions('user');
    }
  },
  data() {
    return {
      path: "/ws",
      stompClient: '',
      timer:''
    }
  },
  watch: {
    hasPermissions: function () {
      let idUser = this.$store.state.idUser;
      if (idUser) {
        this.initWebSocket();
      }
    }
  },
  methods:{
    initWebSocket() {
      this.connection();
    },
    connection() {
      let _ts = this;
      let token = this.$store.state.token;
      let idUser = this.$store.state.idUser;
      // 建立连接对象
      let socket = new SockJS(this.path);
      // 获取STOMP子协议的客户端对象
      _ts.stompClient = Stomp.over(socket);
      // 停用 stompJs debug 日志
      _ts.stompClient.debug = null;
      // 定义客户端的认证信息,按需求配置
      let headers = {
        Authorization: token
      };
      // 向服务器发起websocket连接
      _ts.stompClient.connect(headers,() => {
        _ts.stompClient.subscribe('/public/greetings', (msg) => { // 订阅服务端提供的某个topic
         _ts.sendMessage(msg);
        },headers);
        _ts.stompClient.subscribe('/user/' + idUser + '/message', (msg) => { // 订阅服务端提供的某个topic
         _ts.sendMessage(msg);
        },headers);
      }, (err) => {
        // 连接发生错误时的处理函数
        console.log('socket 连接失败');
        console.log(err);
      });
      socket.onerror = function (err) {
        console.log(err);
      }
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
    },
    sendMessage (msg) {
      let _ts = this;
      // 如果用户同意接收通知，我们就尝试发送通知
      if (window.Notification && Notification.permission === "granted") {
        new Notification(msg, {tag: 'soManyNotification'});
      } else {
        _ts.$notify({
          title: '自定义位置',
          message: '右上角弹出的消息'
        });
      }
    },
    initNotificationPermission() {
      // 首先，让我们检查我们是否有权限发出通知
      // 如果没有，我们就请求获得权限
      if (window.Notification && Notification.permission !== "granted") {
        Notification.requestPermission(function (status) {
          if (Notification.permission !== status) {
            Notification.permission = status;
          }
        });
      }
    },
    loadAprilFoolsDay() {
      let _ts = this;
      let date = new Date();
      if (date.getMonth() == 3 && date.getDate() == 1 ) {
          let isAprilFoolsDay = localStorage.getItem('isAprilFoolsDay');
          if (!isAprilFoolsDay) {
            let new_element = document.createElement("style");
            new_element.id = "aprilFoolsDay";
            new_element.innerHTML =("\n" +
                    "\n" +
                    "  html {\n" +
                    "    filter: flipV();\n" +
                    "  }\n" +
                    "  body{\n" +
                    "    -webkit-transform: rotateX(180deg);\n" +
                    "    transform: rotateX(180deg);\n" +
                    "    -moz-transform: skew(180deg, 0deg) scale(-1, 1);\n" +
                    "    -o-transform: skew(180deg, 0deg) scale(-1, 1);\n" +
                    "  }");
            document.body.appendChild(new_element);
            setTimeout(function () {
              _ts.$notify({
                title: '提示',
                message: '愚人节快乐!',
                duration: 0,
                position: 'bottom-right',
                onClose: function () {
                  localStorage.setItem('isAprilFoolsDay', 'true');
                  let aprilFoolsDay = document.getElementById('aprilFoolsDay');
                  if (aprilFoolsDay) {
                    document.body.removeChild(aprilFoolsDay);
                  }
                }
              });
            }, 2000);
          }
      } else {
        let aprilFoolsDay = document.getElementById('aprilFoolsDay');
        if (aprilFoolsDay) {
          document.body.removeChild(aprilFoolsDay);
        }
      }
    },
    loadMourn() {
      let date = new Date();
      if (date.getMonth() == 3 && date.getDate() == 4 ) {
        let new_element = document.createElement("style");
        new_element.id = "mourn";
        new_element.innerHTML =("\n" +
                "  html {\n" +
                "    -webkit-filter: grayscale(100%);\n" +
                "    -moz-filter: grayscale(100%);\n" +
                "    -o-filter: grayscale(100%);\n" +
                "    filter: grayscale(100%);\n" +
                "  }");
        document.body.appendChild(new_element);
      } else {
        let mourn = document.getElementById('mourn');
        if (mourn) {
          document.body.removeChild(mourn);
        }
      }
    }
  },
  mounted(){
    let idUser = this.$store.state.idUser;
    if (idUser) {
      this.initWebSocket();
    }
    this.initNotificationPermission();
    this.loadAprilFoolsDay();
    this.loadMourn();
  },
  beforeDestroy: function () {
    // 页面离开时断开连接,清除定时器
    this.disconnect();
    clearInterval(this.timer);
  }
}
</script>

<style>
  body {
    margin: 0;
    display: block;
    overflow-wrap: break-word;
    -webkit-font-smoothing: antialiased;
    background-color: rgb(246, 247, 248);
    overflow-x: hidden;
  }

  a, li {
    text-decoration:none !important;
  }
  h1 a, h2 a, h3 a, h4 a, h5 a, h6 a, .h1 a, .h2 a, .h3 a, .h4 a, .h5 a, .h6 a {
    color: inherit;
  }
  h4, .h4 {
    font-size: 1.125rem;
  }

  h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
    margin-bottom: 0.66em;
    font-family: inherit;
    font-weight: 600;
    line-height: 1.1;
    color: inherit;
  }

  p {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }

  .avatar-md {
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: 1rem;
  }

  .avatar {
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    border-radius: 50%;
    display: inline-block;
    background: #ced4da no-repeat center/cover;
    position: relative;
    text-align: center;
    color: #868e96;
    font-weight: 600;
    vertical-align: bottom;
    font-size: .875rem;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .pt-5, .py-5 {
    padding-top: 1.5rem !important;
  }

  .text-default {
    color: #495057 !important;
  }

  .text-muted {
    color: #9aa0ac !important;
  }

  .d-block {
    display: block !important;
  }

  .article-summary-md {
    position:relative;
    line-height:1.4em;
    /* 3 times the line-height to show 3 lines */
    height:4.2em;
    overflow:hidden;
  }

  .article-summary-md::after {
    content:"...";
    font-weight:bold;
    position:absolute;
    bottom:0;
    right:0;
    padding:0 20px 1px 45px;
    /*background:url(http://newimg88.b0.upaiyun.com/newimg88/2014/09/ellipsis_bg.png) repeat-y;*/
  }

  .article-summary-sd {
    position:relative;
    line-height:1.4em;
    /* 1 times the line-height to show 1 lines */
    height:1.4em;
    overflow:hidden;
  }

  .article-summary-sd::after {
    content:"...";
    font-weight:bold;
    position:absolute;
    bottom:0;
    right:0;
    padding:0 20px 1px 45px;
    /*background:url(http://newimg88.b0.upaiyun.com/newimg88/2014/09/ellipsis_bg.png) repeat-y;*/
  }

  .text-center {
    text-align: center !important;
  }

  .wrapper {
    max-width: 980px;
    margin: 0 auto;
    display: block;
    padding-left: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;
    float: none;
  }

  .mr-3, .mx-3 {
    margin-right: 0.75rem !important;
  }


  .navbar-brand-img {
    height: 2rem;
    line-height: 2rem;
    vertical-align: bottom;
    margin-right: .5rem;
    width: auto;
  }

  .topic-brand-img {
    height: 4rem;
    line-height: 2rem;
    vertical-align: bottom;
    margin-right: .5rem;
    width: auto;
  }

  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }

</style>
