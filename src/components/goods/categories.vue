<template>
  <div>
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary">添加分类</el-button>
      <tree-table :data='categoryInfo' :columns='columns' class="treeTable"
        :selection-type='false' :expand-type='false' 
        show-index index-text='#' border :show-row-hover='false'>
        <!-- 是否有效 -->
        <template v-slot:isOk='scope'>
          <i v-if="!scope.row.cat_deleted" class="el-icon-success" style="color:lightgreen"></i>
          <i v-else class="el-icon-error" style="color:red"></i>
        </template>
        <!-- 层级 -->
        <template v-slot:sort='scope'>
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:operate>
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
        </tree-table>
        <!-- 分页 -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {getHomeCategoryInfo} from '@/network/goods.js'
export default {
    name:'categories',
    data(){
      return {
        categoryInfo:[],
        queryInfo:{
          type:3,
          pagenum:1,
          pagesize:5,
        },
        total:0,
        columns:[{
          label:'分类名称',
          prop:'cat_name',
          
        },{
          label:'是否有效',
          type:"template",
          template:'isOk'
        },{
          label:'排序',
          type:'template',
          template:'sort'
        },{
          label:'操作',
          type:'template',
          template:'operate'
        }]
      }
    },
    created(){
      this.getHomeCategoryInfo()
    },
    methods:{
      getHomeCategoryInfo(){
        getHomeCategoryInfo(this.queryInfo.type,this.queryInfo.pagenum,this.queryInfo.pagesize).then(res=>{
          console.log(res);
          if(res.meta.status !==200) return this.$message.error('获取商品列表失败')
          this.categoryInfo = res.data.result
          this.total = res.data.total
        })
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getHomeCategoryInfo()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getHomeCategoryInfo()
      }
    }
}
</script>

<style scoped>
.treeTable{
  margin-top: 15px;
}
</style>