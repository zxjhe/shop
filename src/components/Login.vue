<template>
    <div class="login_container">
       <div class="login_box">
<!--         头像区域-->
         <div class="avatar_box">
           <img src="../assets/imgs/img.png" alt="">
         </div>

<!--         登录表单区域-->
         <el-form ref="loginRef" :model="form" :rules="rules" label-width="0px" class="login_form">
<!--           用户名-->
           <el-form-item prop="username">
             <el-input v-model="form.username" prefix-icon="el-icon-user-solid"></el-input>
           </el-form-item>
<!--           密码-->
           <el-form-item prop="password">
             <el-input v-model="form.password" prefix-icon="el-icon-key"
             type="password" ></el-input>
           </el-form-item>
<!--           按钮区域-->
           <el-form-item class="btns">
             <el-button type="primary" @click="login">登录</el-button>
             <el-button type="info" @click="reset">重置</el-button>
           </el-form-item>

          </el-form>
       </div>
    </div>
</template>

<script>
export default {
  name: "login.vue",
  data() {
    return {
      //数据表单绑定对象
      form: {
        username: 'admin',
        password: '123456',
      },
      rules: {
        //验证用户名是否合法
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        //验证密码
        password: [
          {required: true, message: '请输入登录密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
      },
    }
  },

  methods: {

    //重置处理逻辑
    reset() {
      // alert('jgjg')
      this.$refs.loginRef.resetFields();
    },

    //处理登录逻辑
    login() {
      this.$refs.loginRef.validate(async (valid)=>{
        if (!valid) return;
        const {data: res} = await this.$http.post('login' , this.form);
        if (res.meta.status !== 200) return this.$message.error('登录失败！没有此记录');
        this.$message.success('登录成功！');
        window.sessionStorage.setItem('token' , res.data.token);
        this.$router.push('/home');
      });

    }

  }

};
</script>

<style scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

}

.avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px pink;
  position: absolute;
  left: 50%;
  transform: translate(-50% , -50%);
  background-color: pink;
}

.avatar_box img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}



.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns{
  position: relative;
  float: right;
}

</style>
