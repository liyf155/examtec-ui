<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-form ref="ruleForm2" :model="ruleForm2" :rules="rules2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
              <el-input type="text" :value="ruleForm2.username" disabled />
            </el-form-item>
            <el-form-item label="原密码" prop="password">
              <el-input v-model="ruleForm2.password" type="password" auto-complete="off" />
            </el-form-item>
            <el-form-item label="密码" prop="newpassword1">
              <el-input v-model="ruleForm2.newpassword1" type="password" auto-complete="off" />
            </el-form-item>
            <el-form-item label="确认密码" prop="newpassword2">
              <el-input v-model="ruleForm2.newpassword2" type="password" auto-complete="off" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm2')">
                提交
              </el-button>
              <el-button @click="resetForm('ruleForm2')">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ElFormItem from 'element-ui/packages/form/src/form-item.vue'
import request from '@/router/axios'

export default {
  components: {
    ElFormItem
  },
  data () {
    var validatePass = (rule, value, callback) => {
      if (this.ruleForm2.password !== '') {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (this.ruleForm2.password !== '') {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm2.newpassword1) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      fileList: [],
      show: false,
      ruleForm2: {
        userId: undefined,
        username: '',
        password: '',
        newpassword1: '',
        newpassword2: ''
      },
      rules2: {
        newpassword1: [{ validator: validatePass, trigger: 'blur' }],
        newpassword2: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  created () {
    this.ruleForm2.userId = this.userInfo.userId
    this.ruleForm2.username = this.userInfo.username
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: '/admin/user/modify-passwd',
            method: 'put',
            data: this.ruleForm2
          }).then(response => {
            if (response.data) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              // 修改密码之后强制重新登录
              if (this.ruleForm2.newpassword1 !== '') {
                this.$store.dispatch('FedLogOut').then(() => {
                  this.$router.push({ path: '/login' }) // 为了重新实例化vue-router对象 避免bug
                })
              }
            } else {
              this.$notify({
                title: '失败',
                message: response.data.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    toggleShow () {
      this.show = !this.show
    }
  }
}
</script>
