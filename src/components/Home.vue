<template>

  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/imgs/img.png " alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="danger" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollape ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
<!--        侧边栏菜单区域-->
        <el-menu
            background-color="#333744"
            text-color="#fff"
            unique-opened
            :collapse = "isCollape"
            :collapse-transition="false"
            router
            :default-active="activePath "
            active-text-color="#409BFF">
<!--          一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
<!--            一级菜单模板区域-->
            <template #title>
<!--              图标-->
              <i :class="iconsObj[item.id]"></i>
<!--              文本-->
              <span>{{item.authName}}</span>
            </template>
<!--            二级菜单-->
            <el-menu-item :index= " '/' + subItem.path" v-for="subItem in item.children"
             :key="subItem.id" @click="save('/' + subItem.path)">
              <template #title>
                <!--              图标-->
                <i class="el-icon-menu"></i>
                <!--              文本-->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu >

        </el-menu>
      </el-aside>
<!--      右侧内容主题-->
      <el-main>
<!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>


</template>

<script>
export default {
  data(){
    return{
      //左侧菜单数据
      menulist: [],
      iconsObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      isCollape: false,
      activePath: '',
    }
  },

  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  name: "Home",
  methods: {
    logout(){
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    //获取所有的菜单
   async getMenuList(){
     const {data: res} = await this.$http.get('menus')
     if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
     this.menulist = res.data
    },

    //点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollape = ! this.isCollape;
    },

    //保存链接激活的状态
    save(activePath){
        window.sessionStorage.setItem('activePath' , activePath)
        this.activePath = activePath
    },

  }
}
</script>

<style lang="less" scoped>

.home-container{
  height: 100%;
}

.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div{
    display: flex;
    align-items: center;


    span{
      position: relative;
      margin-left: 7px;
    }

    img{
      width: 65px;
      height: 60px;
      border-radius: 50%;
    }
  }
}

.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}

.el-main{
  background-color: #EAEDF1;
}

.iconfont{
  margin-right: 10px;
}

.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2rem;
  cursor: pointer;
}



</style>
