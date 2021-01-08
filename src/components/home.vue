<template>
  <el-container class="home_container">
    <!-- 头 -->
    <el-header>
      <div>
        <img class="header_img" src="@/assets/header.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="1-1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
import {getHomeAsideInfo} from '@/network/home.js'
export default {
  name: "home",
  data(){
      return {
          asideInfo:[]
      }
  },
  created(){
      this.getHomeAsideInfo1()
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
     getHomeAsideInfo1(){
      getHomeAsideInfo().then(res=>{
          if(res.meta.status !==200) return this.$message.error(res.meta.msg)
          this.asideInfo = res.data
      })
  }
  }
 
};
</script>

<style lang='less' scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.home_container {
  height: 100%;
}
.header_img {
  width: 50px;
  vertical-align: middle;
  margin-right: 15px;
}
.el-menu {
  width: 200px;
}
</style>