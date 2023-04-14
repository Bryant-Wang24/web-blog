<template>
  <div>
    <mu-dialog :fullscreen="!isPC" width="60%" :open.sync="openModal">
      <slot name="title">
        <mu-auto-complete
          action-icon="search"
          label-float
          :data="keywords"
          label="文章搜索"
          :max-search-results="20"
          v-model="keyword"
          open-on-focus
          avatar
          full-width
          @change="handleSearch"
          :action-click="handleSearch"
        >
          <template slot-scope="scope">
            <mu-list-item-action>
              <mu-avatar color="primary">{{scope.item.substring(0, 1)}}</mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content v-html="scope.highlight"></mu-list-item-content>
          </template>
        </mu-auto-complete>
      </slot>
      <div v-if="list && list.length === 0" class="no-content">暂无内容</div>

      <mu-list v-else class="list" textline="two-line">
        <mu-list-item :key="item._id" v-for="item in list" button @click="goDetail(item)">
          <mu-list-item-action>
            <mu-avatar>
              <img :src="item.cover" />
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-content>
            <mu-list-item-title>{{item.title}}</mu-list-item-title>
            <mu-list-item-sub-title>
              <span>{{item.introduction}}</span>
            </mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action style="min-width:140px;">{{item.createTime}}</mu-list-item-action>
        </mu-list-item>
      </mu-list>

      <mu-button v-if="!isPC" class="close" icon @click="clear(false)">
        <mu-icon value="close"></mu-icon>
      </mu-button>
    </mu-dialog>
  </div>
</template>
<script>
import { getTagList } from '../api/tag';
import {getArticleList} from '../api/article';
import dayjs from 'dayjs';
export default {
  props: ["open"],
  computed: {
    openModal: {
      get() {
        return this.open;
      },
      set(val) {
        this.clear(val);
      }
    }
  },
  data() {
    return {
      keywords: [],
      keyword: "",
      list: null,
      fullscreen: false
    };
  },
  mounted() {
    this.getTags();
  },
  methods: {
    async getTags() {
      const res = await getTagList();
      if (res.data) {
        this.keywords = res.data.list.map(item => item.name);
      }
    },
    clear(val) {
      this.keyword = "";
      this.$emit("toggle", val);
      this.list = null;
    },
    async handleSearch() {
      if (!this.keyword) return;
      const res = await getArticleList(1,99999,'',this.keyword);
      if (res.code===0) {
        this.list = res.data.list.map(item => {
          item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss");
          return item;
        });
      }
    },
    goDetail(item) {
      this.clear();
      this.$router.push({
        name: "articlesDetails",
        query: { id: item.id }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.list {
  overflow-y: auto;
  max-height: 450px;
}
.no-content {
  text-align: center;
}
.close {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>