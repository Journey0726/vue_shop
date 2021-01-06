<template>
  <div class="login_container">
      <div class="login_box">
          <div class="avater_box">
              <img src="../assets/logo.png" alt="">
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name:'login'
}
</script>

<style  lang='less' scoped>
 .login_container{
     background-color: #2b4b6b;
     height: 100%;
     display: flex;
     align-items: center;
     justify-content: center;
 }
 .login_box{
     width: 450px;
     height: 300px;
     background-color: #fff;
     border-radius: 3px;
 }
 .avater_box{
     height: 130px;
     width: 130px;
     border:1px solid #eee;
     border-radius: 50%;
     padding: 10px;
     box-shadow: 0 0 10px #ddd;
     position: relative;
     left: 50%;
     transform: translate(-50%,-50%);
     img{
        
         widows: 100%;
         height: 100%;
         border-radius: 50%;
         background-color: #eee;
     }
 }
</style>