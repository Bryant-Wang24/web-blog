<template>
  <div
    class="common"
    :style="{
      background: `url(${tagsDetailBgImg}) 0px center no-repeat`,
      backgroundSize: 'cover',
    }"
  >
    <Header :light-index="3" background="transparent"></Header>
    <div v-if="isPC">
      <Footer fixed></Footer>
    </div>

    <div class="content">
      <mu-paper v-if="isPC" :z-depth="5" class="pc-box">
        <mu-list>
          <div class="sub-title">标签-{{tagName}}({{ total }})</div>
          <mu-list-item button
            v-for="(item, index) in list"
            :key="index"
            @click="goDetail(item.id)"
          >
            <mu-list-item-title class="item">
              <span class="title">{{ item.title }}</span>
              <span>{{ item.createTime }}</span>
            </mu-list-item-title>
          </mu-list-item>
        </mu-list>

        <div class="pagination">
          <mu-pagination
            raised
            circle
            :total="total"
            :current.sync="page"
            :pageSize.sync="pageSize"
            @change="changePage"
          ></mu-pagination>
        </div>
      </mu-paper>

      <div class="wap-box" v-else>
        <div class="sub-title">标签-{{tagName}}({{ total }})</div>
        <mu-list>
          <mu-list-item button
            v-for="(item, index) in list"
            :key="index"
            @click="goDetail(item.id)"
          >
            <mu-list-item-title class="item">
              <span class="title">{{ item.title }}</span>
              <span>{{ item.createTime }}</span>
            </mu-list-item-title>
          </mu-list-item>
        </mu-list>
        <Footer></Footer>
      </div>

      <mu-button
        v-show="!isPC"
        @click="$router.go(-1)"
        class="back-fab"
        small
        fab
        color="#fff"
      >
        <mu-icon color="#ccc" value="arrow_back"></mu-icon>
      </mu-button>
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getArticleList } from "../../api/article";
import dayjs from "dayjs";
export default {
  name: "tagsDetails",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      page: 1,
      pageSize: this.isPC ? 10 : 15,
      tagName:"",
      total: 0,
      list: [],
      info: {
        list: [],
      },
      tagsDetailBgImg: "http://wangqiushuang.online:8080/logo/archive.jpg",
    };
  },
  mounted() {
    this.getArticleList();
  },
  methods: {
    changePage(page) {
      this.page = page;
      this.getArticleList();
    },
    goDetail(id) {
      this.$router.push({
        name: "articlesDetails",
        query: { id: id },
      });
    },
    getArticleList(){
      this.tagName = this.$route.query.name;
      getArticleList( this.page, this.pageSize,"",this.tagName ).then((res)=>{
        console.log("res", res)
        if(res.code===0){
          this.list = res.data.list;
          // 格式化时间
          this.list.forEach((item) => {
            item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm");
          });
          this.total = res.data.totalCount;
        }
      });
    }
  },
};
</script>
<style lang="less" scoped>
.content {
  padding-top: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>