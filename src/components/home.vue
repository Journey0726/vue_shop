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
      <el-aside :width="isShow ? '64px':'200px'">
          <div class="toggle_botton" @click="toogle">|||</div>
        <el-menu
         unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse='isShow'
          :collapse-transition= 'false'
          :router="true"
          :default-active="activePath"
        >
          <el-submenu :index="item.id.toString()" v-for="item in  asideInfo" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+item2.path" v-for="item2 in item.children" :key="item2.id" @click="saveNavState('/'+item2.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {getHomeAsideInfo} from '@/network/home.js'
export default {
  name: "home",
  data(){
      return {
          asideInfo:[],
          iconList:{
              '125':'el-icon-user-solid',
              '103':'el-icon-s-cooperation',
              '101':'el-icon-shopping-bag-1',
              '102':'el-icon-document',
              '145':'el-icon-data-line'
          },
          isShow:false,
          activePath:''
      }
  },
  created(){
      this.getHomeAsideInfo1()
      this.activePath = window.sessionStorage.getItem('path')
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
        //   console.log(this.asideInfo);
                })
            },
        toogle(){
            this.isShow = !this.isShow
        },
        saveNavState(path){
            window.sessionStorage.setItem('path',path)
            this.activePath = path
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
    border-right: none;
}
.toggle_botton{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>