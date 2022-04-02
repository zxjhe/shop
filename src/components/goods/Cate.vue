<template>
  <!--     面包屑导航-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>

<!--  卡片视图-->
  <el-card>
     <el-row>
       <el-col>
         <el-button type="primary" @click="show">添加分类</el-button>
       </el-col>
     </el-row>
<!--    表格-->
    <el-table
        :data="catelist"
        style="width: 100%"
        row-key="cat_id"
        border
        :lazy="true"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column  type="index" label="序号"></el-table-column>

      <el-table-column
          prop="cat_name"
          label="分类名称">
      </el-table-column>

      <el-table-column
          prop="cat_delete"
          label="是否有效">
        <template v-slot="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else  style="color: red"></i>

        </template>
      </el-table-column>

      <el-table-column
          prop="cat_level"
          label="排序">
        <template v-slot="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          prop=""
          label="操作">
        <template v-slot="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


<!--    分页区域-->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </el-card>

<!--  添加分类的对话框-->
  <el-dialog
      title="添加分类"
      v-model="addCateDialogVisble"
      width="50%" @close="addCateDialogClosed">
<!--    添加分类的表单-->
    <el-form :model="addCateForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="分类名称：" prop="cat_name">
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类：">
        <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="props"
            @change="parentCateChange">

        </el-cascader>

      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="addCateDialogVisble = false">取 消</el-button>
      <el-button type="primary" @click="addCate">确 定</el-button>
    </span>
    </template>
  </el-dialog>

</template>

<script>
export default {
  name: "Cate",
  data() {
    return{
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类的数据列表，默认为空
      catelist: [],
      total: 0,
      //控制添加分类对话框 的显示与隐藏
      addCateDialogVisble: false,
      parentCateList: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true,
      },
      selectedKeys: [],

      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0

      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
    }
  },
  created() {
    this.getCateList()
  },

  methods: {
    //获取商品分类数据
    async getCateList() {
      const {data:res} = await this.$http.get('categories',{params:this.querInfo})
      if (res.meta.status !== 200){
        return this.$message.error('获取商品分类失败！')
      }
      this.catelist = res.data.result
      this.total = res.data.total
    },

    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },

    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },

    show() {
      this.getParentCateList()
      this.addCateDialogVisble = true
    },

   async getParentCateList() {
      const {data:res} = await this.$http.get('categories' , {params:{type:2}})
      if (res.meta.status !==200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      this.parentCateList = res.data
    },

    parentCateChange() {
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[
        this.selectedKeys.length - 1
            ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },

    addCate() {
      this.$refs.ruleForm.validate(  async valid =>{
         if (!valid)  return
          const {data:res} = await this.$http.post('categories' , this.addCateForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加失败！')
          }
         this.$message.success('添加分类成功！')
         this.getCateList()
          this.addCateDialogVisble = false
      })
    },

    addCateDialogClosed() {
       this.$refs.ruleForm.resetFields()
       this.selectedKeys = []
       this.addCateForm.cat_level = 0
       this.addCateForm.cat_pid = 0
    },



  }
}
</script>

<style lang="less" scoped>


</style>
