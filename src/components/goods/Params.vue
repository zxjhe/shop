<template>
  <div>
    <!--     面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--      卡片视图区域-->
    <el-card>
      <!--        警告区域-->
      <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          show-icon
          :closable="false"
          type="warning">
      </el-alert>

      <!--        选择商品分类区域-->
      <el-row class="cat_opt">
        <el-col>
          <sapn>选择商品分类：</sapn>
          <!--            选择商品分类的链级选择框-->
          <el-cascader
              v-model="selectedCateKeys"
              :options="catelist"
              :props="cateProps"
              class="cas"
              @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>

      <!--        tab页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="AddDialogVisible=true">添加参数</el-button>
          <!--            动态参数表格-->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag"
                           size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger"
                           icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="AddDialogVisible=true">添加属性</el-button>

          <el-table :data="onlyTableData" border stripe>
            <!--              <el-table-column type="expand"></el-table-column>-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger"
                           icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>

    <!--      添加参数的对话框-->
    <el-dialog
        :title="'添加' + titleText"
        v-model="AddDialogVisible"
        width="50%" @close="addDialogClosed">
      <!--        添加参数的对话框-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="AddDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addParams">确 定</el-button>
    </span>
      </template>
    </el-dialog>

    <!--      修改参数对话框-->
    <el-dialog
        :title="'修改' + titleText"
        v-model="editDialogVisible"
        width="50%" @close="editDialogClosed">
      <!--        添加参数的对话框-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editParams">确 定</el-button>
    </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return{
      //商品分类列表
      catelist: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      selectedCateKeys: [],
      activeName: 'many',
      manyTableData:[],
      onlyTableData: [],
      AddDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules:{
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },


    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取所有的商品分类列表
    async getCateList() {
      const {data:res} = await this.$http.get('categories')
      if (res.meta.status !== 200){
        return this.$message.error('获取商品分类失败！')
      }
      this.catelist = res.data
    },
    handleChange() {
      this.getParamsData()

    },

    handleClick() {
      this.getParamsData()
    },


    async getParamsData() {
      if (this.selectedCateKeys.length !== 3){
        this.selectedCateKeys = []
        return
      }
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
      if (res.meta.status !== 200){
        return this.$message.error('获取参数列表失败！')
      }
      res.data.forEach(item =>{
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many'){
        this.manyTableData = res.data
      }else{
        this.onlyTableData = res.data
      }
    },

    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },

    addParams() {
      this.$refs.addFormRef.validate(async valid =>{
        if (!valid) return
        const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.AddDialogVisible = false
        this.getParamsData()
      })
    },
    async showEditDialog(attr_id) {
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
          {params: {attr_sel: this.activeName}
          })
      if (res.meta.status !== 200){
        return this.$message.error('获取参数信息失败！')
      }
      this.editForm = res.data

      this.editDialogVisible = true
    },

    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    editParams() {
      this.$refs.editFormRef.validate(async valid =>{
        if (!valid) return
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {attr_name:this.editForm.attr_name,attr_sel:this.activeName})
        if (res.meta.status !== 200){
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm'){
        return this.$message.info('已取消删除')
      }
      //删除
      const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)

      if (res.meta.status !== 200){
        return this.$message.error('删除参数失败！')
      }
      this.$message.success('删除参数成功！')
      this.getParamsData()
    },

    handleInputConfirm(row) {
      row.inputVisible = false
    },

    showInput(row) {
      row.inputVisible = true
    },




  },
  computed: {
    isBtnDisabled(){
      if (this.selectedCateKeys.length !== 3){
        return true
      }
      return false
    },
    cateId() {
      if (this.selectedCateKeys.length === 3){
        return this.selectedCateKeys[2]
      }
      return  null
    },

    titleText() {
      if (this.activeName ==='many') {
        return '动态参数'
      }
      return '静态属性'
    },






  },
}
</script>

<style lang="less" scoped>
.cat_opt{
  margin: 15px 0;
}

.input-new-tag{
  width: 120px;
}



</style>
