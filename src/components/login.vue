<template>
  <div class="login_container">
    <!-- 头像区域 -->
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model='loginForm' :rules="loginFormRules"  label-width="0px" class="form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type='password'  v-model="loginForm.password"  prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {getLoginInfo} from '@/network/login.js'
export default {
  name: "login",
  data(){
    return {
      loginForm:{
        username:'',
        password:''
      },
      loginFormRules:{
        username:[ { required: true, message: '请输入登录名称', trigger: 'blur' },
                   { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password:[{ required: true, message: '请输入登录名称', trigger: 'blur' },
                  { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
      },
    }
  },
  methods:{
    resetForm(){
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      this.$refs.loginFormRef.validate((valid)=>{
        if(!valid) return;
        else 
          getLoginInfo(this.loginForm.username,this.loginForm.password).then(res=>{
            console.log(res);
            if(res.meta.status!==200)
             return console.log('登录失败');
            console.log('登录成功');
          })
        
      })
    }
  }
};
</script>

<style  lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
}
.avater_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: relative;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    widows: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.form {
  position: relative;
  top: -60px;
  padding: 20px;
}
.btn {
  display: flex;
  justify-content: flex-end;
}
</style>