<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="姓名：">
          <el-input v-model="listQuery.name" style="width: 200px;" class="filter-item" placeholder="模糊查询" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="身份证号：">
          <el-input v-model="listQuery.certId" style="width: 200px;" class="filter-item" placeholder="模糊查询" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button v-if="ck_checkinPeople_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
            添加
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-upload
            v-if="ck_checkinPeople_add" ref="upload" class="upload-demo"
            action="/checkin/checkin-peoples/import" :headers="headers" :data="uploadData"
            :on-error="uploadError" :show-file-list="false" :on-success="uploadSuccess"
            :before-upload="beforeUpload" :limit="1"
          >
            <el-button class="filter-item" type="primary" icon="el-icon-upload">
              批量导入
            </el-button>
            <el-button class="filter-item" type="info" icon="el-icon-back" @click="backToPlanPage">
              返回
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :key="tableKey" v-loading.body="listLoading" :data="list"
      element-loading-text="正在加载..." border fit
      highlight-current-row style="width: 99%"
    >
      <el-table-column align="center" label="省份名称">
        <template slot-scope="scope">
          <span>{{ scope.row.provinceName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="城市名称">
        <template slot-scope="scope">
          <span>{{ scope.row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点名称">
        <template slot-scope="scope">
          <span>{{ scope.row.nodeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证号">
        <template slot-scope="scope">
          <span>{{ scope.row.certId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="岗位名称">
        <template slot-scope="scope">
          <span>{{ scope.row.postName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目名称">
        <template slot-scope="scope">
          <span>{{ scope.row.subjectName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式">
        <template slot-scope="scope">
          <span>{{ scope.row.linkerPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="报名号">
        <template slot-scope="scope">
          <span>{{ scope.row.serialNo }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="ck_checkinPeople_edit" size="small" type="success" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button v-if="ck_checkinPeople_del" size="small" type="danger" @click="deleteCheckinPeople(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]" :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="省份名称" prop="provinceId">
              <el-select v-model="form.provinceId" placeholder="===请选择===" filterable clearable style="width: 220px" @change="initCities(form.provinceId)">
                <el-option v-for="p in provinceList" :key="p.areaCode" :label="p.name" :value="p.areaCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="城市名称" prop="cityId">
              <el-select v-model="form.cityId" placeholder="===请选择===" filterable clearable style="width: 220px" @change="initExamNodes(form.cityId)">
                <el-option v-for="c in cityList" :key="c.areaCode" :label="c.name" :value="c.areaCode" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="考点名称" prop="nodeId">
              <el-select v-model="form.nodeId" placeholder="===请选择===" filterable clearable style="width: 220px">
                <el-option v-for="n in nodeList" :key="n.id" :label="n.nodeName" :value="n.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="身份证号" prop="certId">
              <el-input v-model="form.certId" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" placeholder="===请选择===" style="width: 220px">
                <el-option v-for="s in sexList" :key="s.value" :label="s.label" :value="s.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="岗位名称" prop="postId">
              <el-select v-model="form.postId" placeholder="===请选择===" style="width: 220px">
                <el-option v-for="p in postList" :key="p.id" :label="p.postName" :value="p.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="科目名称" prop="subjectId">
              <el-select v-model="form.subjectId" placeholder="===请选择===" style="width: 220px">
                <el-option v-for="s in subjectList" :key="s.id" :label="s.subjectName" :value="s.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="联系方式" prop="linkerPhone">
              <el-input v-model="form.linkerPhone" placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="报名号" prop="serialNo">
              <el-input v-model="form.serialNo" placeholder="请输入报名号" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">
          取 消
        </el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createCheckinPeople('form')">
          确 定
        </el-button>
        <el-button v-else type="primary" @click="updateCheckinPeople('form')">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCheckinPeoplesByPage,
  addCheckinPeople,
  getCheckinPeople,
  delCheckinPeople,
  updCheckinPeople
} from '@/api/checkin/checkinPeople'
import { listAll } from '@/api/checkin/position'
import { getAdministrativeSelect } from '@/api/basic/administrative.js'
import { getNodeNameList } from '@/api/basic/examNode'
import { listByItemId } from '@/api/basic/examSubject'
import { mapGetters } from 'vuex'
import store from '@/store'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'CheckinPeople',
  directives: {
    waves
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: '正常',
        1: '锁定'
      }
      return statusMap[status]
    }
  },
  props: {
    planId: {
      type: String,
      default: undefined
    },
    itemId: {
      type: String,
      default: undefined
    }
  },
  data () {
    // var checkLinkerPhone = (rule, value, callback) => {
    //   var p = /^((0\d{2,3}-\d{6,8})|(1[3584]\d{9}))$/
    //   if (!value) {
    //     callback(new Error('请输入联系电话'))
    //   } else if (!p.test(value)) {
    //     callback(new Error('联系电话输入有误！'))
    //   } else {
    //     callback()
    //   }
    // }
    var checkCertId = (rule, value, callback) => {
      var cert = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      if (!value) {
        callback(new Error('请输入身份证号'))
      } else if (!cert.test(value)) {
        callback(new Error('身份证输入有误！'))
      } else {
        callback()
      }
    }
    return {
      form: {
        planId: undefined,
        provinceId: undefined,
        provinceName: undefined,
        cityId: undefined,
        cityName: undefined,
        nodeId: undefined,
        nodeName: undefined,
        name: undefined,
        certId: undefined,
        sex: undefined,
        postId: undefined,
        postName: undefined,
        subjectId: undefined,
        subjectName: undefined,
        linkerPhone: undefined,
        remark: undefined,
        photoInfo: undefined,
        serialNo: undefined
      },
      rules: {
        provinceId: [{ required: true, message: '请选择省份', trigger: 'change' }],
        cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
        nodeId: [{ required: true, message: '请选择考点', trigger: 'change' }],
        // postId: [{ required: true, message: '请选择岗位', trigger: 'change' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        certId: [{ required: true, validator: checkCertId, trigger: 'blur' }]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      ck_checkinPeople_add: false,
      ck_checkinPeople_del: false,
      ck_checkinPeople_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      uploadData: {
        planId: this.planId
      },
      postList: [],
      provinceList: [],
      cityList: [],
      sexList: [
        {
          label: '男',
          value: '男'
        },
        {
          label: '女',
          value: '女'
        }
      ],
      nodeList: [],
      subjectList: []
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    headers () {
      return {
        Authorization: 'Bearer ' + store.getters.access_token
      }
    }
  },
  created () {
    this.getList()
    this.ck_checkinPeople_add = this.permissions['ck_checkinPeople_add']
    this.ck_checkinPeople_edit = this.permissions['ck_checkinPeople_edit']
    this.ck_checkinPeople_del = this.permissions['ck_checkinPeople_del']
  },
  methods: {
    getList () {
      this.listLoading = true
      this.listQuery.planId = this.planId
      getCheckinPeoplesByPage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.current = 1
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.current = val
      this.getList()
    },
    handleCreate () {
      this.resetTemp()
      this.initProvinces()
      this.initPostition()
      this.initExamSubject()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      getCheckinPeople(row.id).then(response => {
        this.initProvinces()
        this.initCities(row.provinceId)
        this.initExamNodes(row.cityId)
        this.initExamSubject()
        this.initProvinces()
        this.initPostition()
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteCheckinPeople (row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCheckinPeople(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      })
    },
    createCheckinPeople (formName) {
      const set = this.$refs
      this.initForm()
      set[formName].validate(valid => {
        if (valid) {
          this.form.planId = this.planId
          addCheckinPeople(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    cancel (formName) {
      this.dialogFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    updateCheckinPeople (formName) {
      const set = this.$refs
      this.initForm()
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updCheckinPeople(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    initForm () {
      this.form.provinceName = this.getProvinceName()
      this.form.cityName = this.getCityName()
      this.form.nodeName = this.getNodeName()
      if (this.form.subjectId) {
        this.form.subjectName = this.getSubjectName()
      }
      if (this.form.postId) {
        this.form.postName = this.getPositionName()
      }
    },
    resetTemp () {
      this.form = {
        planId: undefined,
        provinceId: undefined,
        provinceName: undefined,
        cityId: undefined,
        cityName: undefined,
        nodeId: undefined,
        nodeName: undefined,
        name: undefined,
        certId: undefined,
        sex: undefined,
        postId: undefined,
        postName: undefined,
        subjectId: undefined,
        subjectName: undefined,
        linkerPhone: undefined,
        remark: undefined,
        photoInfo: undefined,
        serialNo: undefined
      }
    },
    backToPlanPage () {
      this.$emit('closePlanPeopleDialog')
    },
    // 上传成功后的回调
    uploadSuccess (response, file, fileList) {
      if (response.code !== 0) {
        this.$notify({
          title: '提示',
          message: response.msg,
          type: 'warning',
          duration: 3000
        })
      } else {
        this.$notify({
          title: '批量导入成功',
          message: response.msg,
          type: 'success',
          duration: 3000
        })
      }
      this.$refs.upload.clearFiles()
      this.getList()
    },
    // 上传错误
    uploadError (response, file, fileList) {
      this.$notify({
        title: '失败',
        message: '上传文件失败，请稍后再试',
        type: 'error',
        duration: 3000
      })
      this.$refs.upload.clearFiles()
      this.getList()
    },
    // 上传前对文件的大小的判断
    beforeUpload (file) {
      const extension = file.name.split('.')[1] === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension) {
        this.$notify({
          title: '提示',
          message: '上传文件要求是Excel格式',
          type: 'warning',
          duration: 3000
        })
      }
      if (!isLt2M) {
        this.$notify({
          title: '提示',
          message: '上传文件大于10M，请联系管理员进行处理',
          type: 'warning',
          duration: 3000
        })
      }
      return extension && isLt2M
    },
    initPostition () {
      listAll().then(response => {
        this.postList = response.data
      })
    },
    initExamNodes (cityId) {
      getNodeNameList(cityId).then(response => {
        this.nodeList = response.data
      })
    },
    initExamSubject () {
      listByItemId(this.itemId).then(response => {
        this.subjectList = response.data
      })
    },
    initProvinces () {
      getAdministrativeSelect(0).then(response => {
        this.provinceList = response.data
      })
    },
    initCities (provinceId) {
      this.form.cityId = ''
      getAdministrativeSelect(provinceId).then(response => {
        this.cityList = response.data
      })
    },
    getProvinceName () {
      let provinceName = ''
      this.provinceList.find((item) => {
        if (item.areaCode === this.form.provinceId) {
          provinceName = item.name
        }
      })
      return provinceName
    },
    getCityName () {
      let cityName = ''
      this.cityList.find((item) => {
        if (item.areaCode === this.form.cityId) {
          cityName = item.name
        }
      })
      return cityName
    },
    getNodeName () {
      let nodeName = ''
      this.nodeList.find((item) => {
        if (item.id === this.form.nodeId) {
          nodeName = item.nodeName
        }
      })
      return nodeName
    },
    getPositionName () {
      let positionName = ''
      this.postList.find((item) => {
        if (item.id === this.form.postId) {
          positionName = item.postName
        }
      })
      return positionName
    },
    getSubjectName () {
      let subjectName = ''
      this.subjectList.find((item) => {
        if (item.id === this.form.subjectId) {
          subjectName = item.subjectName
        }
      })
      return subjectName
    }
  }
}
</script>
