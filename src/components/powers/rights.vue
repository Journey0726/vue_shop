<template>
  <div class="div">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限登记" prop="level">
            <template v-slot='scope'>
                <el-tag v-if="scope.row.level ==='0'">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.level ==='1'">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsInfo } from "@/network/rights.js";
export default {
  name: "rights",
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    this.getRightsInfo();
  },
  methods: {
    getRightsInfo() {
      getRightsInfo("/list").then((res) => {
        console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("获取权限列表失败");
        this.rightsList = res.data;
      });
    },
  },
};
</script>

<style scoped>

</style>