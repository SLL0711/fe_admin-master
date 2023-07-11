<template>
  <el-dialog :visible.sync="dialogVisible" :title="curId ? '编辑成品' : '新增成品'" width="700px" :before-close="close">
    <el-form ref="ruleForm" label-position="left  " :model="ruleForm" status-icon :rules="rules" label-width="100px"
      class="demo-ruleForm">
      <el-form-item label="成品编码" prop="code">
        <el-input v-model="ruleForm.code" clearable autocomplete="off" />
      </el-form-item>
      <el-form-item label="成品名称" prop="name">
        <el-input v-model="ruleForm.name" clearable autocomplete="off" />
      </el-form-item>
      <el-form-item label="成本价" prop="price">
        <el-input v-model="ruleForm.price" clearable autocomplete="off" />
      </el-form-item>
      <el-form-item label="售价" prop="sellprice">
        <el-input v-model="ruleForm.sellprice" clearable autocomplete="off" />
      </el-form-item>
      <el-form-item label="原材料编码" prop="materials">
        <el-select v-model="ruleForm.materials" multiple placeholder="选择原材料">
          <el-option v-for="item in mataerialsData" :key="item.name" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getProduct, createProduct, updateProduct } from "@/api/product/product.js"
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'CuForm',
  components: { Treeselect },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    curId: {
      type: Number,
      default: null
    },
  },
  data() {
    return {
      ruleForm: {
        code: '',
        name: '',
        price: '',
        sellprice: '',
        materials: [],
      },
      mataerialsData: [],
      rules: {
        code: [{ required: true, trigger: 'blur', message: '成品编码不能为空' }],
        name: [{ required: true, trigger: 'blur', message: '成品名称不能为空' }],
        price: [
          { required: true, trigger: 'blur', message: '成本价不能为空' },
          { validator: this.validateAmount, trigger: 'blur' }
        ],
        sellprice: [
          { required: true, trigger: 'blur', message: '售价不能为空' },
          { validator: this.validateAmount, trigger: 'blur' }
        ],
        materials: [{ required: true, trigger: 'blur', message: '原材料不能为空' }],
      }
    }
  },
  watch: {
    dialogVisible(v) {
      if (v) {
        if (this.curId) {
          getProduct(this.curId).then(res => {
            // createdby & modifyBy 默认不上传
            delete res.data.created_by && delete res.data.modify_by;
            console.log('res', res);
            this.ruleForm = res.data;
          })
        }
        this.getMataerials()
      }
    }
  },
  methods: {
    close() {
      this.$refs.ruleForm.resetFields();
      this.$emit('close');
    },
    search() {
      this.close()
      this.$emit('search')
    },
    getMataerials() {
      //TODO api返回材料数据
      this.mataerialsData = [];
      for (let index = 1; index < 4; index++) {
        const name = `材料${index}`;
        const id = index;
        this.mataerialsData.push({ name, id });
      }
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.curId) {
            updateProduct(this.curId, this.ruleForm).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.search()
            })
          } else {
            createProduct(this.ruleForm).then(res => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.search()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 表单金额校验规则
    validateAmount(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入金额'));
      } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        callback(new Error('请输入正确的金额格式'));
      } else {
        callback();
      }
    },

  }
}
</script>
