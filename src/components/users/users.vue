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
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template v-slot:default="scope">
            <el-switch v-model="scope.row.mg_state"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template>
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
               :enterable='false'
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable='false'
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
               :enterable='false'
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getUsersInfo } from "@/network/home.js";
export default {
  name: "users",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      usersList: [],
      total: 0,
    };
  },
  created() {
    this.getUsersInfo();
  },
  methods: {
    getUsersInfo() {
      getUsersInfo(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("用户获取失败");
        this.usersList = res.data.users;
        this.total = res.data.total;
      });
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getUsersInfo()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUsersInfo()
    }
  },
};
</script>

<style>
</style>