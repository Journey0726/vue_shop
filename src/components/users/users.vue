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
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersInfo"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersInfo"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
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
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUsers(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
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
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUsers(scope.row.id)"
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
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        label-width="70px"
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="changeUserVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        label-width="70px"
        :model="changeUsersInfo"
        :rules="changeUsersInfoRules"
        ref="changeUsersInfoRef"
      >
        <el-form-item label="用户名">
          <el-input v-model="changeUsersInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="changeUsersInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="changeUsersInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsersInfo,
  userStateChanged,
  addUsers,
  queryUserInfo,
  changeUserInfo,
  deleteUserInfo
} from "@/network/home.js";
export default {
  name: "users",
  data() {
    var checkEmail = (rules, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rules, value, cb) => {
      const regMobile = /^(1[3|5-9])\d{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      usersList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      changeUsersInfo: {},
      changeUsersInfoRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      changeUserVisible: false,
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
        if (res.meta.status !== 200) return this.$message.error("用户获取失败");
        this.usersList = res.data.users;
        this.total = res.data.total;
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUsersInfo();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUsersInfo();
    },
    // 监听switch开关状态的改变
    userStateChanged(userInfo) {
      userStateChanged(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(
        (res) => {
          if (res.meta.status !== 200) {
            userInfo.mg_state = !userInfo.mg_state;
            return this.$message.error("更新用户状态失败");
          }
          this.$message.closeAll();
          this.$message.success("更新用户状态成功");
        }
      );
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        addUsers(
          this.addForm.username,
          this.addForm.password,
          this.addForm.email,
          this.addForm.mobile
        ).then((res) => {
          if (res.meta.status !== 201)
            return this.$message.error("添加用户失败");
          return this.$message.success("添加用户成功！");
        });
        this.addDialogVisible = false;
        this.getUsersInfo();
      });
    },
    editUsers(id) {
      this.changeUserVisible = true;

      queryUserInfo(id).then((res) => {
        if (res.meta.status !== 200) return this.$message.error("查询用户失败");
        this.changeUsersInfo = res.data;
      });
    },
    editDialogClose() {
      this.$refs.changeUsersInfoRef.resetFields();
    },
    editUserInfo() {
      this.$refs.changeUsersInfoRef.validate((valid) => {
        if (!valid) return;
        changeUserInfo(
          this.changeUsersInfo.id,
          this.changeUsersInfo.email,
          this.changeUsersInfo.mobile
        ).then((res) => {
          if (res.meta.status !== 200)
            return this.$message.error("修改用户失败");
          return this.$message.success("修改用户成功！");
        });
      
        this.changeUserVisible = false;
        this.getUsersInfo();
      });
    },
    deleteUsers(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUserInfo(id).then((res) => {
            if (res.meta.status !== 200)
              return this.$message.error("删除用户失败");
            this.$message.success("您已成功删除该用户");
            this.getUsersInfo();
          });
        })
        .catch(() => {
          this.$message.error("已取消删除");
        });
    },
  },
};
</script>

<style>
</style>