<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="searchRolesInfo(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRolesInfo(scope.row.id)"
              >删除</el-button
            >
            <el-button type="warning" icon="el-icon-setting" size="mini"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色信息"
      :visible.sync="addRolesVisible"
      width="50%"
      @close="addRolsesClosed"
    >
      <el-form
        label-width="100px"
        :model="addRoles"
        :rules="addRolesRules"
        ref="addRolesRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色信息 -->
    <el-dialog
      title="编辑角色信息"
      :visible.sync="editRolesVisible"
      width="50%"
      @close="editRolsesClosed"
    >
      <el-form
        label-width="100px"
        :model="editRoles"
        :rules="addRolesRules"
        ref="editRolesRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesInfo,
  addRoles,
  searchRolesInfo,
  changeRolesInfo,
  deleteRolesInfo,
} from "@/network/rights.js";
export default {
  name: "roles",
  data() {
    return {
      rolesList: [],
      addRolesVisible: false,
      editRolesVisible: false,
      addRoles: {
        roleName: "",
        roleDesc: "",
      },
      addRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      editRoles: {},
    };
  },
  created() {
    this.getRolesInfo();
  },
  methods: {
    getRolesInfo() {
      getRolesInfo().then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error("获取用户列表失败");
        this.rolesList = res.data;
      });
    },
    addRole() {
      this.addRolesVisible = true;
    },
    addRolsesClosed() {
      this.$refs.addRolesRef.resetFields();
    },
    addRolesInfo() {
      this.$refs.addRolesRef.validate((valid) => {
        if (!valid) return this.$message.error("添加角色失败");
        addRoles(this.addRoles.roleName, this.addRoles.roleDesc).then((res) => {
          if (res.meta.status !== 201)
            return this.$message.error("添加角色失败");
          return this.$message.success("添加用户成功！");
        });
        this.addRolesVisible = false;
        this.getRolesInfo();
      });
    },
    searchRolesInfo(id) {
      this.editRolesVisible = true;
      searchRolesInfo(id).then((res) => {
        if (res.meta.status !== 200) return this.$message.error("查询角色失败");
        this.editRoles = res.data;
      });
    },
    editRolsesClosed() {
      this.$refs.editRolesRef.resetFields();
    },
    changeRolesInfo() {
      this.$refs.editRolesRef.validate((valid) => {
        if (!valid) return;
        changeRolesInfo(
          this.editRoles.roleId,
          this.editRoles.roleName,
          this.editRoles.roleDesc
        ).then((res) => {
          if (res.meta.status !== 200)
            return this.$message.error("修改角色失败");
          return this.$message.success("修改角色成功！");
        });
        (this.editRolesVisible = false), this.getRolesInfo();
      });
    },
    deleteRolesInfo(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteRolesInfo(id).then((res) => {
          if (res.meta.status !== 200)
            return this.$message.error("删除角色失败");
          this.$message.success("您已成功删除该角色");
          this.getRolesInfo();
        });
      });
    },
  },
};
</script>

<style scoped>
.el-card {
  position: relative;
  overflow: auto;
  height: calc(100vh - 100px);
}
</style>