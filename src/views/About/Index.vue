<template>
  <div class="common">
    <Header :light-index="5" background="transparent"></Header>
    <Footer fixed></Footer>

    <mu-carousel
      hide-indicators
      hide-controls
      style="position: fixed; height: 100%; margin-top: 0"
    >
      <mu-carousel-item v-for="item in info.imgs" :key="item.id">
        <img :src="item.imgUrl | 'https://wangqiushuang.online:8080/logo/wqs.jpg'" />
      </mu-carousel-item>
    </mu-carousel>

    <div class="content" :style="{ paddingTop: isPC ? '64px' : '56px' }">
      <mu-card class="card" :style="{ marginTop: isPC ? '100px' : '0' }">
        <mu-card-header v-if="isPC">
          <mu-paper v-if="isPC" class="avatar-box" circle :z-depth="5">
            <img class="avatar" src="https://avatars.githubusercontent.com/u/71873944?v=4" />
          </mu-paper>
        </mu-card-header>

        <mu-card-text>
          <div v-html="info.desc"></div>
        </mu-card-text>
        <div class="tags">
          <mu-chip
            class="tag"
            v-for="(item) in info.tags"
            :key="item.name"
            :color="item.color"
            >{{ item.name }}</mu-chip
          >
          <!-- <mu-button
            color="primary"
            v-if="info.tags && info.tags.length === 0"
            @click="reset"
            >reset</mu-button
          > -->
        </div>
      </mu-card>
    </div>
  </div>
</template>
<script>
import { randomColor } from "@/utils";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAbout } from "../../api/about";

export default {
  name: "about",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      info: {
        imgs: [],
        desc:"",
        tags: [],
      },
    };
  },
  mounted() {
    this.getAboutInfo();
  },

  methods: {
    // 获取个人信息
    getAboutInfo() {
      getAbout().then((res) => {
        if (res.code === 0){
          this.info = res.data
          this.info.tags = res.data.tags?.map((item) => {
            return {
              name: item,
              color: randomColor(),
            };
          });
        }
      });
    },
    // remove(index) {
    //   this.info.tags.splice(index, 1);
    // },
    // reset() {
    //   this.info.tags = [
    //     {
    //       name: "Vue",
    //       color: randomColor(),
    //     },
    //     {
    //       name: "React",
    //       color: randomColor(),
    //     },
    //     {
    //       name: "Node.js",
    //       color: randomColor(),
    //     },
    //   ];
    // },
  },
};
</script>
<style lang="less" scoped>
.content {
  padding-top: 64px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /deep/ .mu-card-header {
    display: flex;
    justify-content: flex-end;
    height: 1.33333rem;
  }
  .avatar-box {
    width: 2.66667rem;
    height: 2.66667rem;
    position: absolute;
    top: -1.33333rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.tags {
  padding: 0.42667rem;
  .tag {
    margin-bottom: 0.42667rem;
    margin-right: 0.42667rem;
  }
}
.mu-carousel {
  height: 5.33333rem;
  margin-top: 0.53333rem;
}
.mu-carousel-item > img {
  height: 100%;
}
.card {
  max-width: 10rem;
  width: 10rem;
  margin: 0 auto;
}
</style>