<template>
  <div class="articles">
    <Header :light-index="1"></Header>
    <div class="content">
      <div v-if="isPC" class="right">
        <RightConfig showPosition="文章"></RightConfig>
      </div>
      <div :class="[{ 'wap-left': !isPC }, 'left']">
        <mu-card class="card" @click="goDetail(item.id)"
          v-for="(item, index) in info.list"
          :key="index"
        >
          <div v-if="isPC" class="cover">
            <img
              class="cover-img"
              :src=item.cover
              alt="封面"
            />
          </div>
          <div class="card-box">
            <div class="title">{{item.title}}</div>
            <mu-card-actions class="sub-title">
              <mu-button class="cursor-default" flat color="info"
                >查看({{item.views}})</mu-button
              >
              <mu-button class="cursor-default" flat color="error"
                >评论({{item.comment}})</mu-button
              >
              <!-- <mu-button class="cursor-default" flat color="primary"
                >点赞({{item.like}})</mu-button
              > -->
              <mu-button class="cursor-default" flat color="#9e9e9e"
                >{{item.updateTime}}</mu-button
              >
            </mu-card-actions>
            <mu-card-text v-if="item.introduction" class="text">简介: {{item.introduction}}</mu-card-text>
            <mu-card-actions>
              <mu-button flat class="chip cursor-default" color="primary">
                <mu-icon left value="dns"></mu-icon>
                {{item.categories}}
              </mu-button>

              <!-- v-for渲染标签 -->
              <mu-button
                v-for="(tag, index) in item.tags"
                :key="index"
                flat
                class="chip cursor-default"
              >
                <mu-icon left value="loyalty"></mu-icon>
                {{tag}}
              </mu-button>
              <!-- <mu-button flat class="chip cursor-default">
                <mu-icon left value="loyalty"></mu-icon>
                标签1
              </mu-button> -->
              <!-- <mu-button flat class="chip cursor-default">
                <mu-icon left value="loyalty"></mu-icon>
                标签2
              </mu-button> -->
            </mu-card-actions>
          </div>
        </mu-card>
      </div>
    </div>

    <div v-if="info.totalCount > pageSize" class="pagination">
      <mu-pagination
        raised
        circle
        :total="info.totalCount"
        :current.sync="page"
        :pageSize.sync="pageSize"
        :pageCount="5"
        @change="pageChange"
      ></mu-pagination>
    </div>

    <Footer></Footer>
  </div>
</template>
<script>
import dayjs from "dayjs";
import RightConfig from "@/components/RightConfig";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {getArticleList} from "../../api/article";
export default {
  name: "articles",
  components: {
    RightConfig,
    Footer,
    Header,
  },

  data() {
    return {
      page: 1,
      pageSize: 20,
      info: {
        page: 1,
        pageSize: 10,
        totalCount: 50,
        list: [],
      },
    };
  },
  mounted() {
    this.fetchArticles();
  },
  // page变化，重新获取数据，刷新页面
  // watch: {
  //   page() {
  //     this.fetchArticles();
  //   },
  // },
  methods: {
    goDetail(id) {
      this.$router.push({
        name: "articlesDetails",
        query: { id: id },
      });
    },
    pageChange(page) {
      this.page = page;
      this.fetchArticles();
    },
    
    fetchArticles() {
      // 判断url中是否有code参数，有则传给后端
      let code = this.$route.query.code;
    
      getArticleList (this.page,this.pageSize,'','',code).then((res) => {
        if(res.code === 0) {
          res.data.list.forEach((item) => {
            item.updateTime = dayjs(item.updateTime).format("YYYY-MM-DD HH:mm:ss");
            item.tags = item.tags.split(",");
          });
          this.info = res.data;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.articles {
  padding-top: 64px;
  .content {
    padding-bottom: 0.53333rem;
    display: flex;
    .left {
      flex: 9;
      &.wap-left {
        .card {
          float: none;
          width: 90%;
        }
      }
      .card {
        width: 80%;
        float: left;
        margin: 0.42667rem auto 0;
        display: flex;
        flex-wrap: wrap;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
          animation: pulse 1s;
        }
        .title {
          padding: 0.42667rem 0.42667rem 0 0.42667rem;
          font-size: 0.4rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          cursor: pointer;
        }
        .sub-title {
          display: flex;
          flex-wrap: wrap;
        }
        .text {
          padding: 0 0.42667rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
        .chip {
          margin-right: 0.26667rem;
        }
        .cover {
          flex: 1;
          border-radius: 0;
          padding: 0.42667rem;
          .cover-img {
            object-fit: cover;
            width: 100%;
            height: 4.26667rem;
            vertical-align: middle;
          }
        }
        .card-box {
          flex: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }
      }
    }
    .right {
      flex: 3;
      display: flex;
      justify-content: center;
    }
  }

  .box {
    justify-content: center !important;
    padding-bottom: 0.53333rem;
  }
}

.pagination {
  margin: 0.53333rem 0;
  display: flex;
  justify-content: center;
}
</style>