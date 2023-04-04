<template>
  <div
    class="common"
    :style="{
      background: `url('../../assets/archive.jpg') center center no-repeat`,
      backgroundSize: 'cover',
    }"
  >
    <Header :light-index="2" background="transparent"></Header>

    <div class="content">
      <ul class="timeline timeline-centered"
        v-for="(item, index) in list"
        :key="index"
      >
        <li class="timeline-item period">
          <div class="timeline-info"></div>
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <h2 class="timeline-title">{{ item.year }}</h2>
          </div>
        </li>
        <li class="timeline-item"
          v-for="(item, index) in item.articles"
          :key="index"
          @click="goDetail(item.id)"
        >
          <div class="timeline-info">
            <span>{{ item.monthDay }}</span>
          </div>
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <h3 class="timeline-title">{{ item.title }}</h3>
            <p>{{ item.introduction }}</p>
          </div>
        </li>
      </ul>
      <Footer></Footer>
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dayjs from "dayjs";
import { getArticleList } from "@/api/article";

export default {
  name: "archive",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      list: [],
      archiveBgImg: "http://120.79.23.205:8080/logo/wqs.jpg",
    };
  },
  mounted() {
    this.fetchArticles();
  },
  methods: {
    goDetail(id) {
      this.$router.push({
        name: "articlesDetails",
        query: { id: id },
      });
    },
    fetchArticles() {
      getArticleList (1,9999).then((res) => {
        if(res.code === 0) {
          this.list = res.data.list.map((item) => {
            return {
              id: item.id,
              title : item.title,
              introduction : item.introduction,
              updateTime : dayjs(item.updateTime).format("YYYY-MM-DD HH:mm:ss"),
              year : dayjs(item.updateTime).format("YYYY"),
              monthDay : dayjs(item.updateTime).format("MM-DD"),
            };
          })
          // 把数据按照年份分组,按照时间降序排列
          const group = this.list.reduce((acc, cur) => {
            const year = cur.year;
            delete cur.year;
            if (!acc[year]) {
              acc[year] = [];
            }
            acc[year].push(cur);
            return acc;
          }, {});
          this.list = Object.keys(group).map((key) => {
            return {
              year: key,
              articles: group[key].sort((a, b) => {
                return new Date(b.updateTime) - new Date(a.updateTime);
              }),
            };
          });
          this.list.sort((a, b) => {
            return b.year - a.year;
          });
          console.log("this.list",this.list)

        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  position: absolute;
  top: 64px;
  bottom: 0;
  overflow: auto;
  width: 100%;
  padding-top: 20px;
}

.timeline {
  line-height: 1.4em;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: inherit;
  }
}

.timeline-item {
  padding-left: 40px;
  position: relative;
  cursor: pointer;
  &:last-child {
    padding-bottom: 0;
  }
}

.timeline-info {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  margin: 0 0 0.5em 0;
  text-transform: uppercase;
  white-space: nowrap;
}

.timeline-marker {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 15px;
  &:before {
    background: #00e676;
    border: 3px solid transparent;
    border-radius: 100%;
    content: "";
    display: block;
    height: 15px;
    position: absolute;
    top: 4px;
    left: 0;
    width: 15px;
    transition: background 0.3s ease-in-out, border 0.3s ease-in-out;
  }
  &:after {
    content: "";
    width: 3px;
    background: #ccd5db;
    display: block;
    position: absolute;
    top: 24px;
    bottom: 0;
    left: 6px;
  }
  .timeline-item:last-child &:after {
    content: none;
  }
}
.timeline-item:not(.period):hover .timeline-marker:before {
  background: transparent;
  border: 3px solid #00e676;
}

.timeline-content {
  padding-bottom: 40px;
  p:last-child {
    margin-bottom: 0;
  }
}

.period {
  padding: 0;
  .timeline-info {
    display: none;
  }
  .timeline-marker {
    &:before {
      background: transparent;
      content: "";
      width: 15px;
      height: auto;
      border: none;
      border-radius: 0;
      top: 0;
      bottom: 30px;
      position: absolute;
      border-top: 3px solid #ccd5db;
      border-bottom: 3px solid #ccd5db;
    }
    &:after {
      content: "";
      height: 32px;
      top: auto;
    }
  }
  .timeline-content {
    padding: 40px 0 70px;
  }
  .timeline-title {
    margin: 0;
  }
}

.timeline-split {
  @media (min-width: 768px) {
    .timeline {
      display: table;
    }
    .timeline-item {
      display: table-row;
      padding: 0;
    }
    .timeline-info,
    .timeline-marker,
    .timeline-content,
    .period .timeline-info {
      display: table-cell;
      vertical-align: top;
    }
    .timeline-marker {
      position: relative;
    }
    .timeline-content {
      padding-left: 30px;
    }
    .timeline-info {
      padding-right: 30px;
    }
    .period .timeline-title {
      position: relative;
      left: -45px;
    }
  }
}

.timeline-centered {
  @extend .timeline-split;
  @media (min-width: 992px) {
    &,
    .timeline-item,
    .timeline-info,
    .timeline-marker,
    .timeline-content {
      display: block;
      margin: 0;
      padding: 0;
    }
    .timeline-item {
      padding-bottom: 40px;
      overflow: hidden;
    }
    .timeline-marker {
      position: absolute;
      left: 50%;
      margin-left: -7.5px;
    }
    .timeline-info,
    .timeline-content {
      width: 50%;
    }
    > .timeline-item:nth-child(odd) .timeline-info {
      float: left;
      text-align: right;
      padding-right: 30px;
    }
    > .timeline-item:nth-child(odd) .timeline-content {
      float: right;
      text-align: left;
      padding-left: 30px;
    }
    > .timeline-item:nth-child(even) .timeline-info {
      float: right;
      text-align: left;
      padding-left: 30px;
    }
    > .timeline-item:nth-child(even) .timeline-content {
      float: left;
      text-align: right;
      padding-right: 30px;
    }
    > .timeline-item.period .timeline-content {
      float: none;
      padding: 0;
      width: 100%;
      text-align: center;
    }
    .timeline-item.period {
      padding: 50px 0 90px;
    }
    .period .timeline-marker:after {
      height: 30px;
      bottom: 0;
      top: auto;
    }
    .period .timeline-title {
      left: auto;
    }
  }
}
</style>