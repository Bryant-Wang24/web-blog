<template>
  <div class="details">
    <Header :light-index="1"></Header>

    <div v-if="isPC" class="toc-fixed">
      <mu-card class="card">
        <div class="toc">
          <div class="title">文章目录</div>
          <div v-for="item in toc" :key="item.name">
            <a @click="scrollToPosition(item.href)" v-html="item.name"></a>
          </div>
        </div>
      </mu-card>
      <div class="action" :class="toc.length > 0 ? '' : 'noMulu'">
        <mu-tooltip placement="top" content="点赞" >
          <mu-button fab color="primary" @click="handleLike">
            <mu-icon value="thumb_up" ></mu-icon>
          </mu-button>
        </mu-tooltip>

        <!-- <mu-tooltip placement="top" content="收藏">
          <mu-button fab color="purple500">
            <mu-icon value="grade"></mu-icon>
          </mu-button>
        </mu-tooltip> -->

        <mu-tooltip placement="top" content="评论">
          <mu-button @click="scrollToPosition('#comment')"  fab color="red">
            <mu-icon value="chat"></mu-icon>
          </mu-button>
        </mu-tooltip>
      </div>
    </div>

    <div class="content">
      <div v-if="isPC" class="right">
        <RightConfig showPosition="文章详情"></RightConfig>
      </div>
      <div class="left" :style="{ marginTop: isPC ? '16px' : 0 }">
        <div class="left-box" :style="{ width: isPC ? '70%' : '100%' }">
          <mu-card class="card">
            <mu-card-title
              :title="info.title"
              :sub-title="info.introduction"
            ></mu-card-title>
            <!-- <mu-card-media :style="{ height: isPC ? '400px' : 'auto' }">
              <img v-lazy="info.cover" style="height: 100%" />
            </mu-card-media> -->
            <mu-card-actions class="sub-title">
              <mu-button class="cursor-default" flat color="warning"
                >字数({{ info.content.length }})</mu-button
              >
              <mu-button class="cursor-default" flat color="secondary"
                >阅读大约{{ Math.ceil(info.content.length / 1000) }}分钟</mu-button
              >
              <mu-button class="cursor-default" flat color="info"
                >查看({{ info.views }})</mu-button
              >
              <mu-button class="cursor-default" flat color="error"
                >评论({{ info.comment }})</mu-button
              >
              <mu-button class="cursor-default" flat color="primary"
                >点赞({{ info.like }})</mu-button
              >
              <mu-button class="cursor-default" flat color="#9e9e9e"
                >{{ info.createTime }}</mu-button
              >
            </mu-card-actions>
            <mavonEditor
              v-model="info.content"
              :ishljs="true"
              :toolbarsFlag="false"
              :subfield="false"
              defaultOpen="preview"
              codeStyle="github"
              :navigation="isPC"
            />

            <mu-card-actions>
              <mu-button class="cursor-default" flat color="primary">
                <mu-icon left value="dns"></mu-icon>
                {{ info.categories }}
              </mu-button>
              <mu-button
                v-for="(tag, index) in info.tags"
                :key="index"
                flat
                class="chip cursor-default"
              >
                <mu-icon left value="loyalty"></mu-icon>
                {{tag}}
              </mu-button>
              <!-- <mu-button class="cursor-default" flat>
                <mu-icon left value="loyalty"></mu-icon>
                标签1
              </mu-button>
              <mu-button class="cursor-default" flat>
                <mu-icon left value="loyalty"></mu-icon>
                标签2
              </mu-button> -->
            </mu-card-actions>
          </mu-card>

          <!-- <div class="action-list">
            <mu-tooltip placement="top" content="点赞">
              <mu-button fab color="primary">
                <mu-icon value="thumb_up"></mu-icon>
              </mu-button>
            </mu-tooltip>

            <mu-tooltip placement="top" content="收藏">
              <mu-button fab color="purple500">
                <mu-icon value="grade"></mu-icon>
              </mu-button>
            </mu-tooltip>
          </div> -->

          <mu-card id="comment" class="card">
            <Comment
              @comment="comment"
              :comment-success="commentSuccess"
            ></Comment>
          </mu-card>

          <mu-card class="card" v-if="commentList.length > 0">
            <mu-card-title title="评论（3）"></mu-card-title>
            <mu-divider></mu-divider>
            <CommentList
              v-if="commentList.length > 0"
              :articleId="info._id"
              :articleTitle="info.title"
              :list="commentList"
            ></CommentList>
          </mu-card>

          <!-- <prev-next :prev="prev" :next="next"></prev-next> -->
        </div>
      </div>
    </div>

    <Footer></Footer>
  </div>
</template>
<script>
import RightConfig from "@/components/RightConfig";
import Comment from "@/components/Comment";
import CommentList from "@/components/CommentList";
// import PrevNext from "@/components/PrevNext";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

// import Clipboard from "clipboard";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
// import { markdown } from "@/utils/markdown";
import $ from "jquery";
import { getArticleDetail, postArticleLike } from '../../api/article';
import dayjs from "dayjs";
import { Toast } from "vant";

export default {
  name: "articlesDetails",
  components: {
    RightConfig,
    Comment,
    Footer,
    Header,
    mavonEditor,
    CommentList,
    // PrevNext,
  },
  data() {
    return {
      info: {
        id: "601134b4c4ae0128013d322d",
        title: "使用jspdf+canvas2html将网页保存为pdf文件",
        introduction: "简介",
        cover: "https://wangqiushuang.online:8080/logo/github.png",
      },
      content: "",
      toc: [],
      commentSuccess: false,
      commentList: [
      // {
      //     targetReplayId: "",
      //     targetReplayContent: "",
      //     currentReplayContent: "good",
      //     commentTime: 1619316296,
      //     auditTime: 1619316309,
      //     auditStatus: "1",
      //     _id: "6084ce48e268db458626591a",
      //     avatar:
      //       "https://wangqiushuang.online:8080/logo/github.png",
      //     email: "1912324677@qq.com",
      //     nickName: "永不放弃",
      //     articleId: "601134b4c4ae0128013d322d",
      //     articleTitle: "测试评论文章",
      //   },
      //   {
      //     targetReplayId: "",
      //     targetReplayContent: "",
      //     currentReplayContent: "good",
      //     commentTime: 1619316296,
      //     auditTime: 1619316309,
      //     auditStatus: "1",
      //     _id: "6084ce48e268db458626591a",
      //     avatar:
      //       "https://wangqiushuang.online:8080/logo/github.png",
      //     email: "1912324677@qq.com",
      //     nickName: "永不放弃",
      //     articleId: "601134b4c4ae0128013d322d",
      //     articleTitle: "测试评论文章",
      //   },
      //   {
      //     targetReplayId: "",
      //     targetReplayContent: "",
      //     currentReplayContent: "好，不错",
      //     commentTime: 1611745373,
      //     auditTime: 1612108800,
      //     auditStatus: "1",
      //     _id: "6011485dc4ae0128013d3246",
      //     avatar:
      //       "https://wangqiushuang.online:8080/logo/github.png",
      //     email: "1912324677@qq.com",
      //     nickName: "永不放弃",
      //     articleId: "601134b4c4ae0128013d322d",
      //     articleTitle: "测试评论文章",
      //   },
      ],
    };
  },
  mounted() {
    getArticleDetail(this.$route.query.id).then((res) => {
      console.log("res", res);
      res.data.createTime = dayjs(res.data.createTime).format("YYYY-MM-DD HH:mm:ss")
      res.data.tags = res.data.tags.split(",");
      this.info = res.data;
      this.$nextTick(() => {
      const aArr = $(
        ".v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content a"
      ).toArray();
      console.log(aArr)
      let toc = [];
      aArr.forEach((item) => {
        let href = $(item).attr("id");
        let name = $(item).parent().text();
        if (href) {
          toc.push({
            href: "#" + href,
            name,
          });
        }
      });
      this.toc = toc;
    });
    });

    // this.$nextTick(() => {
    //   this.clipboard = new Clipboard(".copy-btn");
    //   // 复制成功失败的提示
    //   this.clipboard.on("success", () => {
    //     this.$toast.success("复制成功");
    //   });
    //   this.clipboard.on("error", () => {
    //     this.$toast.error("复制失败");
    //   });
    // });

    this.commentList = this.listToTree(this.commentList);
    console.log(this.commentList);
  },
  methods: {
    // 点赞
    handleLike() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        Toast.fail("请先登录");
        return;
      }
      const userId = user.userId;
      const articleId = parseInt(this.$route.query.id);
      postArticleLike({ userId, articleId }).then((res) => {
        if(res.code===0){
          Toast.success(res.msg || "点赞成功");
        } else {
          Toast.fail(res.msg || "点赞失败");
        }
      });
    },

    scrollToPosition(id) {
      var position = $(id).offset();
      position.top = position.top - 80;
      $("html,body").animate({ scrollTop: position.top }, 1000);
    },
    async comment(data) {
      console.log("评论数据", data);
      this.commentSuccess = true;
    },
    listToTree(list) {
      let info = list.reduce(
        (map, node) => ((map[node.id] = node), (node.children = []), map),
        {}
      );
      return list.filter((node) => {
        info[node.targetReplayId] &&
          info[node.targetReplayId].children.push(node);
        return !node.targetReplayId;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.details {
  padding-top: 64px;
}

.toc-fixed {
  position: fixed;
  width: 20%;
  right: 20px;
  top: 80px;
  .toc {
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
    word-break: break-all;
    padding: 0.2rem 0 0.2rem 0.2rem;
    .title {
      font-size: 0.4rem;
      margin-bottom: 10px;
    }
    a {
      display: inline-block;
      color: #2196f3;
      font-size: 0.32rem;
      cursor: pointer;
      padding: 5px 0;
      &:hover {
        color: #00e676;
      }
    }
  }
}

.action-list {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0.42667rem 0;
}
.action {
  margin-top: 0.42667rem;
  display: flex;
  justify-content: space-around;
}
.noMulu {
  flex-direction: column;
  align-items: center;
  height: 400px;
}
.isLike {
  //点赞后的样式
  color: orangered;
}

.content {
  padding-bottom: 0.53333rem;
  display: flex;
  .left {
    flex: 9;
    margin-top: 16px;
    .card {
      border-radius: 5px;
      margin-bottom: 0.48rem;
      .article-detail {
        width: 100%;
        padding: 0.42667rem 0.42667rem 0.42667rem 0.69333rem;
        box-sizing: border-box;
        word-break: break-all;
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
</style>