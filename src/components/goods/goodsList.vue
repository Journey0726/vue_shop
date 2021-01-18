<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsInfo"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsInfo"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
        ></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="upd_time"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加商品对话框 -->
      <el-dialog
      title="添加商品"
      :visible.sync="addDialogVisible"
      width="50%"
     
    >
      <el-form
        label-width="70px"
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
      >
        <el-form-item label="商品名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList } from "@/network/goods.js";
export default {
  name: "goodsList",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      //获取到的商品列表
      goodsList: [],
      total: 0,
      addDialogVisible:false,
      addForm:{},
      addFormRules:{}
    };
  },
  created() {
    this.getGoodsInfo();
  },
  methods: {
    getGoodsInfo() {
      getGoodsList(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then((res) => {
        console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("获取商品列表失败");
        this.goodsList = res.data.goods;
        this.total = res.data.total;
      });
    },
  },
};
</script>

<style>
</style>