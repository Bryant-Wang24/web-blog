<template>
  <div>
    <IndexAnimation></IndexAnimation>
    <Header background="transparent"></Header>
    <Footer fixed></Footer>
    <div class="common">
      <div class="home">
        <p>{{ info.introduction }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IndexAnimation from "@/components/IndexAnimation";
// var CryptoJS = require("crypto-js");
const crypto = require("crypto");

let i = 0;
let timer = null;
export default {
  name: "index",
  components: {
    Header,
    Footer,
    IndexAnimation,
  },
  data() {
    return {
      info: {
        introduction: "王秋爽",
        introductionTarget: "自我介绍：我叫王秋爽，我的爱好是唱，跳，rap，篮球。我的前女友有1.迪丽娜扎，2.古力热巴，3.马尔扎哈。我学过的编程语言有 JavaScript，golang。",
      },
    };
  },
  mounted() {
    this.typing();
    let key = "UhEUgAAARIA";
    let word =
      "4qHK04/3b223cf5a19c39a06baf2f17359bbe60/360p_0068/output_sd.m3u81622987620";
    const hmac = crypto.createHash("md5", key);
    const a = hmac.update(word).digest();
    const l = a.toString('base64');
    return l.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")

  },
  methods: {
    typing() {
      if (i <= this.info.introductionTarget.length) {
        this.info.introduction =
          this.info.introductionTarget.slice(0, i++) + "_";
        timer = setTimeout(this.typing, 100);
      } else {
        this.info.introduction = this.info.introductionTarget; //结束打字,移除 _ 光标
        clearTimeout(timer);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.home {
  position: absolute;
  top: 50%;
  width: 100%;
  text-align: center;
  transform: translateY(-50%);
  font-size: 0.48rem;
  color: #fff;
  font-weight: 500;
}
</style>