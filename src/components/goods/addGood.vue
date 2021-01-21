<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        show-icon
        center
      >
      </el-alert>
      <el-steps
        :space="200"
        align-center
        finish-status="success"
        :active="activeIndex - 0"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="tagChange"
          @tab-click="tabClick"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateInfo"
                :props="cascaderProps"
                @change="cateChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyInfo"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item2"
                  v-for="(item2, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyInfo"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers='headers'
              list-type="picture"
              :on-success='uploadSuccess'
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
  title="图片预览"
  :visible.sync="previewVisible"
  width="50%">
  <img :src="previewPath" alt="" class="img">
</el-dialog>
  </div>
</template>

<script>
import { getHomeCategoryInfo, cateParamsList } from "@/network/goods.js";
export default {
  name: "addGood",
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics:[]
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      cateInfo: [],
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      manyInfo: {},
      onlyInfo: {},
      uploadURL: "https://www.liulongbin.top:8888/api/private/v1/upload",
      //上传图片添加请求头
      headers:{
        Authorization:window.sessionStorage.getItem('token')
      },
      //预览地址
      previewPath:'',
      previewVisible:false
    };
  },
  created() {
    this.getHomeCategoryInfo();
  },
  computed: {
    getThirdID() {
      return this.addForm.goods_cat[2];
    },
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
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    tagChange(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    tabClick() {
      if (this.activeIndex === "1") {
        cateParamsList(this.getThirdID, "many").then((res) => {
          if (res.meta.status !== 200)
            return this.$message.error("获取数据失败");
          res.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          });
          this.manyInfo = res.data;
        });
      }
      if (this.activeIndex === "2") {
        cateParamsList(this.getThirdID, "only").then((res) => {
          if (res.meta.status !== 200)
            return this.$message.error("获取数据失败");
          this.onlyInfo = res.data;
        });
      }
    },
    //预览图片
      handlePreview(file){
        this.previewPath = file.response.data.url
        this.previewVisible = true
      },
      //移除图片
      handleRemove(file){
        const filePath = file.response.data.tmp_path
        for(let index in this.addForm.pics){
          if(this.addForm.pics[index].pic == filePath) 
          return this.addForm.pics.splice(index,1)
        }
        
      },
      //添加图片
      uploadSuccess(response){
        const pic= {pic : response.data.tmp_path}
        this.addForm.pics.push(pic)
      }
  },
};
</script>

<style scoped>
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.img{
  width: 100%;
}
</style>