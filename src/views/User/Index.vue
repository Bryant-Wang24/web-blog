<template>
  <div class="user">
    <mu-card class="slider-card">
      <mu-button
        color="grey600"
        class="edit"
        @click="openUpdateModal = true"
        icon
      >
        <mu-icon value="edit" left></mu-icon>
      </mu-button>
      <mu-avatar class="avatar" size="100">
        <img v-lazy="userInfo.avatar" alt />
        <input class="file" type="file" accept="image/*" @change="uploadFile" />
      </mu-avatar>
      <div class="title">{{ userInfo.username }}</div>
      <!-- <div class="email">{{ userInfo.email }}</div> -->
      <div class="desc">{{ userInfo.introduction }}</div>
    </mu-card>

    <UpdateUserForm
      :userInfo="userInfo"
      :open="openUpdateModal"
      @toggle="toggleUpdateModal"
    ></UpdateUserForm>

    <div class="right">
      <mu-appbar class="title">
        <mu-button @click="$router.go(-1)" icon slot="left">
          <mu-icon value="arrow_back" left></mu-icon> </mu-button
        >我的收藏
        <mu-menu slot="right" open-on-hover>
          <mu-button icon>
            <mu-icon value="menu"></mu-icon>
          </mu-button>
          <mu-list slot="content">
            <mu-list-item button @click="cancelCollect(null)">
              <mu-list-item-title>一键取消</mu-list-item-title>
            </mu-list-item>
          </mu-list>
        </mu-menu>
      </mu-appbar>
      <div class="wrapper">
        <div class="card-box" v-if="collectList && collectList.length !== 0">
          <mu-card class="card" v-for="item in collectList" :key="item._id">
            <mu-card-media @click="goDetail(item)" :title="item.title">
              <img :src="item.cover" />
            </mu-card-media>
            <mu-card-text @click="goDetail(item)">{{
              item.introduction
            }}</mu-card-text>
            <mu-card-actions class="action">
              <mu-button @click="cancelCollect(item._id)" flat color="pink500">
                <mu-icon value="remove_circle" left></mu-icon>取消
              </mu-button>
              <mu-button @click="like(item._id)" color="primary" flat>
                <mu-icon value="thumb_up" left></mu-icon>点赞
              </mu-button>
            </mu-card-actions>
          </mu-card>
        </div>

        <NotFound
          v-else
          title="暂无收藏内容"
          desc="卧槽！我太懒了竟然没有收藏文章！"
        ></NotFound>
      </div>
    </div>
  </div>
</template>

<script>
import UpdateUserForm from "@/components/UpdateUserForm";
import NotFound from "@/components/NotFound";
export default {
  name: "user",
  data() {
    return {
      // email:
      //   "1916579055@qq.com" || JSON.parse(localStorage.getItem("user")).email,
      openUpdateModal: this.$route.query.id == 1,
      collectList: [
        
      ],
      userInfo: {
        avatar:
          "https://wangqiushuang.online:8080/logo/github.png",
        username: "wangqiushuang",
        // email: "1916579055@qq.com",
        // introduction:
        //   "有4年开发经验，熟悉Vue、React、Angular、Taro等前端主流框架。熟悉小程序开发，以及NodeJs、Koa等技术也有深入研究。具有良好的沟通能力、工作协调能力、不断学习新技术、熟练前端技术、热衷于前端开发。",
      },
    };
  },
  components: {
    UpdateUserForm,
    NotFound,
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("user"));
    
    if (!this.userInfo.username) {
      return this.$router.push("/articles");
    }

  },
  methods: {
    goDetail(item) {
      this.$router.push({
        name: "articlesDetails",
        query: { id: item._id },
      });
    },
    toggleUpdateModal(openUpdateModal, isUpdate) {
      this.openUpdateModal = openUpdateModal;
      if (isUpdate) {
        // 重新获取用户信息
        this.userInfo = JSON.parse(localStorage.getItem("user"));
      }
    },
    uploadFile() {},
    cancelCollect() {},
  },
};
</script>

<style lang="less" scoped>
.user {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.slider-card {
  width: 5rem;
  position: relative;
  text-align: center;
  padding: 16px;
  border-radius: 0;
  .avatar {
    cursor: pointer;
    margin-top: 20px;
    box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2),
      0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12);
  }
  .title {
    font-size: 20px;
    color: #00e676;
  }
  .email {
    font-size: 16px;
  }
  .desc {
    font-size: 14px;
    margin: 10px 0;
    text-align: left;
  }
}
.right {
  flex: 1;
  .wrapper {
    padding-left: 5%;
    padding-top: 90px;
    .card-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
    .card {
      width: 100%;
      margin-right: 4%;
      margin-bottom: 20px;
      max-width: 6rem;
      .mu-card-media {
        img {
          height: 5rem;
        }
      }
    }
  }
  .title {
    position: fixed;
    top: 0;
    right: 0;
    left: 5rem;
  }
}
.action {
  display: flex;
  justify-content: space-around;
}
.file {
  width: 100px;
  height: 100px;
  opacity: 0;
  position: absolute;
  cursor: pointer;
}
.edit {
  position: absolute;
  right: 40px;
  top: 20px;
}
</style>