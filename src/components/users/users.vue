<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="usersList" border stripe>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态" prop="mg_state"></el-table-column>
          <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {getUsersInfo} from '@/network/home.js'
export default {
  name: "users",
  data(){
      return {
          queryInfo:{
              query:'',
              pagenum:1,
              pagesize:2
          },
          usersList:[],
          total:0
      }
  },
  created(){
      this.getUsersInfo()
  },
  methods:{
      getUsersInfo(){
          getUsersInfo(this.queryInfo.query,this.queryInfo.pagenum,this.queryInfo.pagesize).then(res=>{
              console.log(res);
              if(res.meta.status!==200) return this.$message.error('用户获取失败')
            this.usersList = res.data.users
            this.total = res.data.total
          })
      }
  }
};
</script>

<style>
</style>