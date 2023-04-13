<template>
  <div class="header">
    <mu-appbar :color="background">
      <!-- title -->
      <span class="name">王秋爽</span>
      <span class="sentence">{{ sentence }}</span>
      <mu-avatar style="cursor: default;" slot="left" class="header-avatar" :size="50">
        <img src="https://wangqiushuang.online:8080/logo/wqs.jpg" />
      </mu-avatar>

      <!-- 菜单 -->
      <mu-button
        v-show="isPC"
        class="menu-btn"
        slot="right"
        v-for="(item, index) in info.menu"
        :key="item.name"
        :color="lightIndex === index ? '#00e676' : ''"
        flat
        @click="go(item)"
      >
        <mu-icon size="16" :value="item.icon"></mu-icon>
        {{ item.name }}
      </mu-button>
        
      <!-- 菜单图标 -->
      <mu-button v-show="!isPC" @click="toggleWapMenu(true)" icon slot="left">
        <mu-icon value="menu"></mu-icon>
      </mu-button>

      <!-- wap-菜单 -->
      <mu-bottom-sheet :open.sync="openWapMenu">
        <mu-list @item-click="toggleWapMenu(false)">
          <mu-list-item
            @click="go(item)"
            v-for="(item, index) in info.menu"
            :key="item.name"
            button
          >
            <mu-list-item-action>
              <mu-icon
                :color="lightIndex === index ? '#00e676' : ''"
                :value="item.icon"
              ></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title
              :style="{ color: lightIndex === index ? '#00e676' : '' }"
              >{{ item.name }}</mu-list-item-title
            >
          </mu-list-item>
        </mu-list>
      </mu-bottom-sheet>

      <!-- 主题切换 -->
      <!-- <mu-button flat slot="right" ref="theme" @click="openTheme = !openTheme">
        <mu-icon value="color_lens"></mu-icon>
      </mu-button>
      <mu-popover :open.sync="openTheme" :trigger="triggerTheme">
        <mu-list>
          <mu-list-item button @click="toggleTheme('selfLight')">
            <mu-list-item-title class="theme-title">
              <mu-icon
                :color="me === 'selfLight' ? 'primary' : ''"
                value="brightness_7"
              ></mu-icon>
            </mu-list-item-title>
          </mu-list-item>
          <mu-list-item button @click="toggleTheme('selfDark')">
            <mu-list-item-title class="theme-title">
              <mu-icon
                :color="me === 'selfDark' ? 'primary' : ''"
                value="brightness_4"
              ></mu-icon>
            </mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-popover> -->

      <!-- 用户 -->
      <mu-button
        v-if="user"
      flat slot="right" ref="button" @click="openUser = !openUser">
        <div class="user">
          <span>{{ user.username }}</span>
          <mu-icon value="expand_more"></mu-icon>
        </div>
      </mu-button>
      <mu-popover :open.sync="openUser" :trigger="trigger">
        <mu-list>
          <mu-list-item button 
            @click="toUserCenter"
          >
            <mu-list-item-title>个人中心</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button
            @click="logout"
          >
            <mu-list-item-title>退出登录</mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-popover>
    </mu-appbar>

    <!-- 搜索按钮 -->
    <div class="tool" v-if="isShowAction">
      <div v-if="info.login && !user" class="tool-row">
        <mu-slide-left-transition>
          <mu-button
            v-show="showToolBtn"
            @click="
              openLoginModal = true;
              showToolBtn = false;
            "
            fab
            color="primary"
            >登录</mu-button
          >
        </mu-slide-left-transition>
      </div>
      <div class="tool-row">
        <mu-tooltip placement="right-start" content="登录/注册/搜索">
          <mu-button
            @click="showToolBtn = !showToolBtn"
            fab
            color="info"
            class="search-fab"
          >
            <mu-icon value="adb"></mu-icon>
          </mu-button>
        </mu-tooltip>

        <mu-slide-left-transition>
          <mu-button
            v-show="showToolBtn && info.openSearch"
            @click="handleSearch"
            fab
            color="error"
            >搜索</mu-button
          >
        </mu-slide-left-transition>
      </div>
      <div v-if="info.register && !user" class="tool-row">
        <mu-slide-left-transition>
          <mu-button
            v-show="showToolBtn"
            @click="
              openRegisterModal = true;
              showToolBtn = false;
            "
            fab
            color="warning"
            >注册</mu-button
          >
        </mu-slide-left-transition>
      </div>
    </div>

    <RegisterForm
      :open="openRegisterModal"
      @toggle="toggleRegisterModal"
    ></RegisterForm>
    <LoginForm :open="openLoginModal" @toggle="toggleLoginModal"></LoginForm>
    <SearchForm
      :open="openSearchModal"
      @toggle="toggleSearchModal"
    ></SearchForm>


    <mu-slide-bottom-transition>
      <mu-tooltip placement="top" content="Top">
        <mu-button
          class="back-top"
          v-show="showBackTop"
          @click="scrollTop"
          fab
          color="secondary"
        >
          <mu-icon value="arrow_upward"></mu-icon>
        </mu-button>
      </mu-tooltip>
    </mu-slide-bottom-transition>
  </div>
</template>

<script>
import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";
import SearchForm from "@/components/SearchForm";
import { getSentence,getUserInfo } from "../api/admin";
import { Toast,Dialog } from "vant";

const menus = [
  {
    name: "首页",
    router: "index",
    icon: "home",
  },
  {
    name: "文章",
    router: "articles",
    icon: "note_add",
  },
  {
    name: "归档",
    router: "archives",
    icon: "drafts",
  },
  {
    name: "分类",
    router: "categories",
    icon: "dns",
  },
  {
    name: "标签",
    router: "tags",
    icon: "loyalty",
  },
  {
    name: "关于",
    router: "about",
    icon: "perm_identity",
  },
];

export default {
  name: "Header",
  components: {
    RegisterForm,
    LoginForm,
    SearchForm,
  },
  props: {
    lightIndex: {
      type: Number,
      default: 0,
    },
    background: {
      type: String,
    },
  },
  computed: {
    isShowAction() {
      return !(
        !this.info.openSearch &&
        !this.info.register &&
        !this.info.login
      );
    },
  },
  data() {
    return {
      sentence: "",
      openUser: false,
      openTheme: false,
      openWapMenu: false,
      openDialog: false,

      trigger: null,
      triggerTheme: null,

      info: {
        menu: menus,
        login: true,
        openSearch: true,
        register: true,
      },

      showToolBtn: false,
      user: JSON.parse(localStorage.getItem("user")) || "",

      openSearchModal: false,
      openLoginModal: false,
      openRegisterModal: false,
      showBackTop: false,
      me: "",
    };
  },
  mounted() {
    this.getSentence();
    let code = this.$route.query.code;
    if (code) {
      this.fetchUserInfo(code);
    }
    // const hours = new Date().getHours();
    let defaultTheme = "selfLight";
    // if (hours >= 8 && hours <= 18) {
    //   defaultTheme = "selfLight";
    // } else {
    //   defaultTheme = "selfDark";
    // }
    this.me = localStorage.getItem("theme") || defaultTheme;

    this.trigger = this.$refs.button.$el;
    this.triggerTheme = this.$refs.theme.$el;

    window.onscroll = () => {
      if (document.documentElement.scrollTop + document.body.scrollTop > 100) {
        this.showBackTop = true;
      } else {
        this.showBackTop = false;
      }
    };
  },
  methods: {
    getSentence(){
      getSentence().then(res => {
        this.sentence = res.data.hitokoto
      });
    },
// 获取用户信息
    fetchUserInfo(code) {
      getUserInfo(code).then(res => {
        if (res.code === 0) {
          this.user = res.data.userInfo;
          localStorage.setItem("user", JSON.stringify(res.data.userInfo));
          // 跳转到article页面
          // 怎么把article?code=xxx从路由表中去掉
          // window.location.href = "/articles";
          // 弹窗提示初始密码为123456，点击确定跳转到个人中心
          Dialog.alert({
            title: "修改密码",
            message: `用户名为 ${res.data.userInfo.username}, 初始密码为123456，点击确认修改密码`,
          }).then(() => {
          });
        } else {
          Toast(res.data.msg);
        }
      });
    },

    toggleWapMenu(openWapMenu) {
      this.openWapMenu = openWapMenu;
    },
    go(item) {
      if (this.$route.name === item.router) {
        return;
      }
      this.$router.push({
        name: item.router,
      });
    },
    toUserCenter() {
      this.$router.push({
        name: "user",
      });
    },
    // 退出登录
    logout() {
      localStorage.removeItem("user");
      Toast.success("退出成功");
      window.location.reload();
    },
    handleSearch() {
      this.openSearchModal = true;
      this.showToolBtn = false;
    },

    toggleRegisterModal(bool) {
      this.openRegisterModal = bool;
    },
    toggleLoginModal(bool) {
      this.openLoginModal = bool;
    },
    toggleSearchModal(bool) {
      this.openSearchModal = bool;
    },
    scrollTop() {
      document.body.scrollIntoView({ block: "start", behavior: "smooth" });
    },
    toggleTheme(me) {
      this.theme.use(me);
      this.me = me;
      localStorage.setItem("theme", me);
      this.openTheme = false;
    },
  },
};
</script>

<style scoped lang="less">
.header {
  position: fixed;
  z-index: 1501;
  width: 100%;
  top: 0;
}
.header .name{
  margin-right: 30px;
  @media  (max-width:960px) {
    display: none!important;
  }
}
.header .sentence{
  position: absolute;
  top: 0;
  font-size: 16px;
  overflow-x: auto;
  @media  (max-width:821px) {
    font-size: 12px;
    margin-left: -15px;
    padding:0px 0px 0px 0px;
    z-index: 9999;
    position: absolute;
    top: 0;
  }
}

.header-avatar {
  margin-left: 20px;
  cursor: pointer;
  @media  (max-width:500px) {
    display: none;
  }
}

.mu-appbar {
  .mu-flat-button {
    flex: 1;
  }
  /deep/ .mu-appbar-right {
    flex: 1;
  }
}

.user {
  display: flex;
  justify-content: space-around;
  align-items: center;
  span {
    display: block;
    width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: right;
  }
}

.tool {
  position: fixed;
  left: 0;
  bottom: 2.66667rem;
  .tool-row {
    margin-top: 20px;
    height: 56px;
    .search-fab {
      margin-left: -28px;
      margin-right: 20px;
    }
  }
}

.back-top {
  position: fixed;
  right: 0.26667rem;
  bottom: 0.4rem;
  background: #595959;
}
</style>
