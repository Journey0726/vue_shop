<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="showAddCates">添加分类</el-button>
      <tree-table
        :data="categoryInfo"
        :columns="columns"
        class="treeTable"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template v-slot:isOk="scope">
          <i
            v-if="!scope.row.cat_deleted"
            class="el-icon-success"
            style="color: lightgreen"
          ></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>
        <!-- 层级 -->
        <template v-slot:sort="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:operate="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editGoodsCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
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
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateVisible"
      width="50%"
      @close="addCateFormClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateInfo"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCates">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑商品分类 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateVisible"
      width="50%"
      @close="editCateFormClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateRules"
        ref="editCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import {
  getHomeCategoryInfo,
  addCategoryInfo,
  queryCateById,
  editCate,
  deleteCateById,
} from "@/network/goods.js";
export default {
  name: "categories",
  data() {
    return {
      categoryInfo: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          type: "template",
          template: "sort",
        },
        {
          label: "操作",
          type: "template",
          template: "operate",
        },
      ],
      addCateVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 1,
            max: 16,
            message: "长度在 1 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
      parentCateInfo: [],
      //被选定的父级分类的ID数组
      selectKeys: [],
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: "false",
      },
      editCateVisible: false,
      editCateForm: {},
      editCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 1,
            max: 16,
            message: "长度在 1 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getHomeCategoryInfo();
  },
  methods: {
    getHomeCategoryInfo() {
      getHomeCategoryInfo(
        this.queryInfo.type,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error("获取商品列表失败");
        this.categoryInfo = res.data.result;
        this.total = res.data.total;
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getHomeCategoryInfo();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getHomeCategoryInfo();
    },
    showAddCates() {
      this.getParentCateInfo();
      this.addCateVisible = true;
    },
    getParentCateInfo() {
      getHomeCategoryInfo(2).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error("获取父级分类数据失败");
        this.parentCateInfo = res.data;
      });
    },
    parentCateChange() {
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        this.addCateForm.cat_level = this.selectKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = this.selectKeys.length;
      }
    },
    addCates() {
      this.$refs.addCateRef.validate((valid) => {
        if (!valid) return;
        addCategoryInfo(
          this.addCateForm.cat_pid,
          this.addCateForm.cat_name,
          this.addCateForm.cat_level
        ).then((res) => {
          if (res.meta.status !== 201)
            return this.$message.error("添加分类数据失败");
          this.$message.success("添加分类数据成功");
        });
        this.getHomeCategoryInfo();
        this.addCateVisible = false;
      });
    },
    addCateFormClosed() {
      this.$refs.addCateRef.resetFields();
      (this.selectKeys = []), (this.addCateForm.cat_pid = 0);
      this.addCateForm.cat_level = 0;
    },
    editGoodsCate(cat_id) {
      console.log(cat_id);
      queryCateById(cat_id).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error("获取商品信息失败");
        this.editCateForm = res.data;
        console.log(this.editCateForm);
        this.editCateVisible = true;
      });
    },
    editCateFormClosed() {
      this.editCateForm = {};
      this.$refs.editCateRef.resetFields();
    },
    editCate() {
      this.$refs.editCateRef.validate((valid) => {
        if (!valid) return;
        editCate(this.editCateForm.cat_id, this.editCateForm.cat_name).then(
          (res) => {
            if (res.meta.status !== 200)
              return this.$message.error("修改商品失败");
            return this.$message.success("修改商品成功！");
          }
        );
        this.getHomeCategoryInfo();
        this.editCateVisible = false;
      });
    },
    deleteCate(id) {
      this.$confirm("此操作将永久删除该类商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteCateById(id).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error("删除商品失败");
           this.$message.success("您已成功删除该商品");
          this.getHomeCategoryInfo();
          });
        })
        .catch(() => this.$message.info("取消删除"));
    },
  },
};
</script>

<style scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>