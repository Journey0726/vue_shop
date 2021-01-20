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
          <el-button type="primary" @click="toAddGoodPage"
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
        <el-table-column label="创建时间" >
          <template v-slot='scope'>
            {{scope.row.add_time|dateShow}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot='scope'>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditGood(scope.row.goods_id)"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGood(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加商品对话框 -->
    <!-- <el-dialog title="添加商品" :visible.sync="addDialogVisible" width="50%">
      <el-form
        label-width="100px"
        :model="addForm"
        :rules="editFormRules"
        ref="addFormRef"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="addForm.goods_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog> -->
    <!-- 编辑商品对话框 -->
    <el-dialog title="编辑商品" :visible.sync="editDialogVisible" width="50%">
      <el-form
        label-width="100px"
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label='介绍'>
          <el-input v-model="editForm.goods_introduce"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList ,deleteGoodsById,getGoodsById} from "@/network/goods.js";
import { formatDate } from '@/common/utils.js'
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
      addDialogVisible: false,
      addForm: {
        goods_name: "",
      },
      editFormRules: {
         goods_name: [
          { required: true, message: "请输入商品名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        goods_price: [
          { required: true, message: "请输入商品名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        goods_number: [
          { required: true, message: "请输入商品名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        goods_weight: [
          { required: true, message: "请输入商品名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      editForm:{},
      editDialogVisible:false,
    };
  },
  //过滤时间
  filters:{
    dateShow(value) {
      let date = new Date(value*1000);
      return formatDate(date, "yyyy-MM-dd  h:m:s");
    }
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
        if (res.meta.status !== 200)
          return this.$message.error("获取商品列表失败");
          
        
        this.goodsList = res.data.goods;
        this.total = res.data.total;
      });  
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getGoodsInfo()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage;
      this.getUsersInfo();
    },
    deleteGood(id){
       this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning", 
      }).then(()=>{
         deleteGoodsById(id).then(res=>{
          if(res.meta.status !==200) return this.$message.error('删除商品失败')
          this.$message.success('删除商品成功')
        })
        this.getGoodsInfo()
      }
      ).catch(()=>{this.$message.info('已取消删除商品')})
      
    },
    showEditGood(id){
      getGoodsById(id).then(res=>{
        if(res.meta.status !==200) return this.$$message.error('获取商品信息失败')
        this.editForm = res.data
      })
      this.editDialogVisible = true
    },
    toAddGoodPage(){
      this.$router.push('/goods/add')
    }
  },
};
</script>

<style>
</style>