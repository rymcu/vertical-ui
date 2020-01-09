<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import SockJS from  'sockjs-client';
import  Stomp from 'stompjs';
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
      timer:'',
    }
  },
  methods:{
    initWebSocket() {
      this.connection();
    },
    connection() {
      let _ts = this;
      let token = localStorage.getItem("x-auth-token");
      let idUser = localStorage.getItem("idUser");
      // 建立连接对象
      let socket = new SockJS(this.path);
      // 获取STOMP子协议的客户端对象
      _ts.stompClient = Stomp.over(socket);
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
        console.log('失败');
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
      console.log(msg);
      // 如果用户同意接收通知，我们就尝试发送通知
      if (window.Notification && Notification.permission === "granted") {
        new Notification('Hi!', {tag: 'soManyNotification'});
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
      console.log('Notification:' + Notification.permission);
      if (window.Notification && Notification.permission !== "granted") {
        Notification.requestPermission(function (status) {
          if (Notification.permission !== status) {
            Notification.permission = status;
          }
        });
      }
    }
  },
  mounted(){
    // this.initWebSocket();
    this.initNotificationPermission();
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
    background: url('assets/bg_dot.png') center top 80px no-repeat fixed rgb(246, 247, 248);
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
