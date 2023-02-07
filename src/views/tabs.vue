<template>
  <el-descriptions title="用户信息" column="1">
    <template #extra>
      <el-button type="primary" size="small" @click="onBack">后退</el-button>
    </template>
    <el-descriptions-item label="姓名">
      <el-tag size="small">{{ userInfo.name }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="年龄">{{ userInfo.age }}</el-descriptions-item>
    <el-descriptions-item label="头衔">{{
      userInfo.position
    }}</el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  name: "UserDetail",

  props: ["id"],

  data() {
    return {
      userInfo: {},
    };
  },

  created() {
    this.getUserInfo();
  },

  methods: {
    // 请求数据
    async getUserInfo() {
      const { data: res } = await this.$http.get("/api/users/" + this.id);
      if (res.status !== 0) return alert("数据获取失败");
      this.userInfo = res.data;
      // console.log(this.userInfo);
    },
    onBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>

</style>
