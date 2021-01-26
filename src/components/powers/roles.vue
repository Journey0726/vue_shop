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
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['botton', index1 == 0 ? 'top' : '']"
               class="firstrow"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable  @close='removeRightById(scope.row,item1.id)'>
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 == 0 ? '' : 'top']"
                  class="secondrow"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable  @close='removeRightById(scope.row,item2.id)' >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close='removeRightById(scope.row,item3.id)'
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
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
            @click="showSetRight(scope.row)"
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
    <!-- 分配权限 -->
    <el-dialog
  title="分配权限"
  :visible.sync="setRightsVisible"
  width="50%"
  @close='setRightsClosed'
  >
  <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id"
  :default-expand-all='true' :default-checked-keys='defKeys' ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightsVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRight">确 定</el-button>
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
  deleteRolesRight,
  getRightsInfo,
  distributeRights
} from "@/network/rights.js";
export default {
  name: "roles",
  data() {
    return {
      rolesList: [],
      addRolesVisible: false,
      editRolesVisible: false,
      setRightsVisible:false,
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
      //所有权限列表
      rightsList:[],
      treeProps:{
        label:'authName',
        children:'children'
      },
      //默认选中节点ID数组
      defKeys:[],
      //当前分配权限角色的ID
      roleID:''
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
        this.getRolesInfo();
        this.addRolesVisible = false;
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
        this.editRolesVisible = false, 
        this.getRolesInfo();
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
        })
          this.getRolesInfo();
      }).catch(()=>{this.$message.info('取消删除')});
    },
    removeRightById(role,rightId){
       this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(()=>{
        
          deleteRolesRight(role.id,rightId).then(res=>{
          if (res.meta.status !== 200)
            return this.$message.error("删除权限失败");
          this.$message.success("您已成功删除该权限");
           role.children = res.data
        })
      }
        
      ).catch(()=>{this.$message.info('取消删除')})
    },
    showSetRight(node){
      this.roleID = node.id
      getRightsInfo('/tree').then(res=>{
        if (res.meta.status !== 200)
          return this.$message.error("获取权限列表失败");
        this.rightsList = res.data
      })
      this.getLeafKeys(node,this.defKeys)
      this.setRightsVisible = true
    },
    //通过递归获取角色下所有三级权限的id
    getLeafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>{
        this.getLeafKeys(item,arr)
      })
    },
    //将defkey赋空
    setRightsClosed(){
      this.defKeys = []
    },
    //分配权限
    allotRight(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
       const idString = keys.join(',')
       distributeRights(this.roleID,idString).then(res=>{
          if (res.meta.status !== 200)
          return this.$message.error("分配权限失败");
          this.$message.success('分配权限成功') 
       })
       this.getRolesInfo()
       this.setRightsVisible = false
       
    }
  },
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.botton {
  border-bottom: 1px solid #eee;
}
.top {
  border-top: 1px solid #eee;
}
.firstrow,.secondrow{
  display: flex;
  align-items: center;
}
</style>