<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="设备号">
          <el-input v-model="listQuery.imeiNo" style="width: 200px;" class="filter-item" placeholder="设备号模糊查询" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button v-if="bs_device_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
            添加
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo" action="/basic/devices/upload" :headers="headers"
            :on-error="uploadError"
            :on-success="uploadSuccess" :before-upload="beforeUpload" :show-file-list="true"
            :on-progress="uploadProgress"
          >
            <el-button class="filter-item" type="primary" icon="el-icon-upload">
              批量导入
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
      <el-table-column align="center" label="设备串号">
        <template slot-scope="scope">
          <span>{{ scope.row.imeiNo }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceType | deviceTypeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="生产商">
        <template slot-scope="scope">
          <span>{{ scope.row.manufacturer }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.useable }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="bs_device_edit"
            size="small"
            type="success"
            @click="handleUpdate(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="bs_device_del"
            size="small"
            type="danger"
            @click="deleteDevice(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        :current-page.sync="listQuery.current"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="设备串号" prop="imeiNo">
          <el-input v-model="form.imeiNo" placeholder="请输入设备串号" />
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="form.deviceType" placeholder="==请选择==">
            <el-option v-for="d in deviceTypeList" :key="d.value" :label="d.label" :value="d.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="生产商" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入生产商" />
        </el-form-item>
        <el-form-item label="状态" prop="useable">
          <el-input v-model="form.useable" placeholder="请输入状态 0 可用  1 不可用" />
        </el-form-item>
        <el-form-item label="容量(单位：G)" prop="capacity">
          <el-input v-model="form.capacity" placeholder="请输入容量(单位：G)" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">
          取 消
        </el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" :disabled="disabledButton" @click="createDevice('form')">
          确 定
        </el-button>
        <el-button v-else type="primary" :disabled="disabledButton" @click="updateDevice('form')">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="showProgress" width="30%" :before-close="closeProgressDialog" center>
      <el-progress :percentage="uploadPercentage" :color="uploadColors" />
    </el-dialog>
  </div>
</template>

<script>
import {
  listByPage, save, getById, update, removeById
} from '@/api/basic/device'
import store from '@/store'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'Device',
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
    },
    deviceTypeFilter (status) {
      const deviceTypeMap = {
        0: '人证机',
        1: '智能抓拍机'
      }
      return deviceTypeMap[status]
    }
  },
  data () {
    return {
      form: {
        imeiNo: undefined,
        deviceType: undefined,
        manufacturer: undefined,
        useable: undefined,
        capacity: undefined,
        createId: undefined,
        createTime: undefined,
        updateId: undefined,
        updateTime: undefined
      },
      rules: {},
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
      bs_device_add: false,
      bs_device_del: false,
      bs_device_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      deviceTypeList: [
        {
          label: '人证机',
          value: '0'
        },
        {
          label: '智能抓拍机',
          value: '1'
        }
      ],
      disabledButton: false,
      showProgress: false,
      uploadPercentage: undefined,
      uploadColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]
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
    this.bs_device_add = this.permissions['bs_device_add']
    this.bs_device_edit = this.permissions['bs_device_edit']
    this.bs_device_del = this.permissions['bs_device_del']
  },
  methods: {
    getList () {
      this.listLoading = true
      listByPage(this.listQuery).then(response => {
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      getById(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteDevice (row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeById(row.id).then(() => {
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
    createDevice (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          save(this.form).then(() => {
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
    updateDevice (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          update(this.form).then(() => {
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
    resetTemp () {
      this.form = {
        imeiNo: undefined,
        deviceType: undefined,
        manufacturer: undefined,
        useable: undefined,
        capacity: undefined,
        createId: undefined,
        createTime: undefined,
        updateId: undefined,
        updateTime: undefined
      }
    },
    // 上传成功后的回调
    uploadSuccess (response) {
      if (response.code === 1) {
        this.$notify({
          title: '失败',
          message: response.msg,
          type: 'warning',
          duration: 5000
        })
      } else {
        this.uploadPercentage = 100
        this.$notify({
          title: '成功',
          message: response.msg,
          type: 'success',
          duration: 3000
        })
      }
      this.showProgress = false
      this.getList()
    },
    // 上传错误
    uploadError (response) {
      this.$notify({
        title: '失败',
        message: '上传文件失败，请检查文件内容格式是否正确',
        type: 'error',
        duration: 3000
      })
    },
    // 上传前对文件的大小的判断
    beforeUpload (file) {
      this.showProgress = true
      this.uploadPercentage = 10
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$notify({
          title: '提示',
          message: '上传文件要求是xls或xlsx格式',
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

      return extension || (extension2 && isLt2M)
    },
    uploadProgress (event, file, fileList) {
      console.log('会不会执行这里的方法')
      this.this.uploadPercentage = file.percentage
    },
    closeProgressDialog () {
      if (this.uploadPercentage !== 100) {
        return false
      }
    }
  }
}
</script>
