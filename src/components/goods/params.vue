<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectKeys"
            :options="cateInfo"
            :props="cascaderProps"
            @change="cateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
           <el-button type="primary" size="mini" :disabled='this.selectKeys.length!==3'>添加参数</el-button>
           <el-table :data="manyCateInfo" border stripe>
             <el-table-column  type="expand"></el-table-column>
             <el-table-column  type="index"></el-table-column>
             <el-table-column  prop="attr_name" label="参数名称">
             </el-table-column>
             <el-table-column label="操作">
               <template >
                 <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
                 <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
               </template>
             </el-table-column>
           </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
           <el-button type="primary" size="mini" :disabled='this.selectKeys.length!==3'>增加属性</el-button>
           <el-table :data="onlyCateInfo" border stripe>
             <el-table-column  type="expand"></el-table-column>
             <el-table-column  type="index"></el-table-column>
             <el-table-column  prop="attr_name" label="参数名称">
             </el-table-column>
             <el-table-column label="操作">
               <template >
                 <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
                 <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
               </template>
             </el-table-column>
           </el-table>
        </el-tab-pane>
        
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getHomeCategoryInfo, cateParamsList } from "@/network/goods.js";
export default {
  name: "params",
  data() {
    return {
       cateInfo:[],
      selectKeys: [],
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
  
      },
      activeName: 'many',
      paramsInfo:{},
      //动态数据
      manyCateInfo:[],
      //静态数据
      onlyCateInfo:[]
    };
  },
  created() {
    this.getHomeCategoryInfo();
  },
  methods: {
    getHomeCategoryInfo() {
      getHomeCategoryInfo().then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error("获取商品分类数据失败");
        this.cateInfo = res.data;
      });
    },
    cateChange() {
      //如果不是3级分类
      if(this.selectKeys.length!==3){
        this.selectKeys = []  ;
        return;
      }
      cateParamsList(this.selectKeys[this.selectKeys.length-1],this.activeName).then(res=>{
        if(res.meta.status !==200) return this.$message.error('获取分类参数失败')
        if(this.activeName==='many') this.manyCateInfo = res.data
        else this.onlyCateInfo = res.data
      });
    },
    handleClick() {
      this.cateChange()
    },
  },
};
</script>

<style scoped>
.cat_opt {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>