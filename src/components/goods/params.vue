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
          <el-button
            type="primary"
            size="mini"
            :disabled="this.selectKeys.length !== 3"
            @click="showAddManyParams"
            >添加参数</el-button
          >
          <el-table :data="manyCateInfo" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="this.selectKeys.length !== 3"
            @click="showAddOnlyParams"
            >增加属性</el-button
          >
          <el-table :data="onlyCateInfo" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot='scope'>
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  >修改</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数 -->
    <el-dialog
      title="添加动态参数"
      :visible.sync="addManyParamsVisible"
      width="50%"
      @close="addManyParamsClosed"
    >
      <el-form
        :model="addManyParams"
        :rules="addParamsRules"
        ref="addManyParamsRef"
        label-width="100px"
      >
        <el-form-item label="动态参数" prop="attr_name">
          <el-input v-model="addManyParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addManyParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加静态属性 -->
    <el-dialog
      title="添加静态属性"
      :visible.sync="addOnlyParamsVisible"
      width="50%"
      @close="addOnlyParamsClosed"
    >
      <el-form
        :model="addOnlyParams"
        :rules="addParamsRules"
        ref="addOnlyParamsRef"
        label-width="100px"
      >
        <el-form-item label="静态参数" prop="attr_name">
          <el-input v-model="addOnlyParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getHomeCategoryInfo,
  cateParamsList,
  AddCateParamsList,
  deleteParamsById,
} from "@/network/goods.js";
export default {
  name: "params",
  data() {
    return {
      cateInfo: [],
      selectKeys: [],
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      activeName: "many",
      paramsInfo: {},
      //动态数据
      manyCateInfo: [],
      //静态数据
      onlyCateInfo: [],
      //添加动态数据
      addManyParams: {
        attr_name: "",
      },
      //添加静态属性
      addOnlyParams: {
        attr_name: "",
      },
      addParamsRules: {
        attr_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 1,
            max: 16,
            message: "长度在 1 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
      addManyParamsVisible: false,
      addOnlyParamsVisible: false,
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
      if (this.selectKeys.length !== 3) {
        this.selectKeys = [];
        return;
      }
      cateParamsList(
        this.selectKeys[this.selectKeys.length - 1],
        this.activeName
      ).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error("获取分类参数失败");
        if (this.activeName === "many") this.manyCateInfo = res.data;
        else this.onlyCateInfo = res.data;
      });
    },
    handleClick() {
      this.cateChange();
    },
    showAddManyParams() {
      this.addManyParamsVisible = true;
    },
    showAddOnlyParams() {
      this.addOnlyParamsVisible = true;
    },
    addManyParamsClosed() {
      this.$refs.addManyParamsRef.resetFields();
    },
    addOnlyParamsClosed() {
      this.$refs.addOnlyParamsRef.resetFields();
    },
    addParams() {
      const id = this.selectKeys[this.selectKeys.length - 1];
      const sel = this.activeName;
      const name =
        this.activeName == "many"
          ? this.addManyParams.attr_name
          : this.addOnlyParams.attr_name;
      AddCateParamsList(id, sel, name).then((res) => {
        if (res.meta.status !== 201) return this.$message.error("添加参数失败");
        this.$message.success("添加参数成功");
      });
      this.cateChange();
      this.addManyParamsVisible = false;
      this.addOnlyParamsVisible = false;
    },
    deleteParams(params) {
      const attrid = params.attr_id;
      const id = params.cat_id;
      this.$confirm("此操作将永久删除该类商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteParamsById(id, attrid).then((res) => {
            console.log(res);
            if (res.meta.status !== 200) return this.$message.error("删除失败");
            this.$message.success("您已成功删除该参数");
          this.cateChange()
          });
        })
        .catch(()=>this.$message.info("取消删除"));
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