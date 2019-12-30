<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-input v-model="listQuery.imeiNo" style="width: 200px;" class="filter-item" placeholder="模糊查询" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
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
      <el-table-column align="center" label="生厂商">
        <template slot-scope="scope">
          <span>{{ scope.row.manufacturer }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点名称">
        <template slot-scope="scope">
          <el-select v-model="scope.row.nodeId" class="filter-item" filterable placeholder="请选择">
            <el-option v-for="(item, idx) in allocatedExamNodes" :key="idx" :label="item.nodeName" :value="item.nodeId" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="allocateDevice(scope.row)">
            分配
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
  </div>
</template>

<script>
import {
  addPlanDevice,
  getUseableDevicePage
} from '@/api/checkin/planDevice'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'UseableDevice',
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
    }
  },
  data () {
    return {
      form: {
        planId: undefined,
        deviceId: undefined,
        imeiNo: undefined,
        nodeId: undefined,
        nodeName: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      rules: {},
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        imeiNo: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      ck_planDevice_add: false,
      ck_planDevice_del: false,
      ck_planDevice_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      allocatedExamNodes: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created () {
    this.getList(this.planId)
  },
  methods: {
    getList (planId) {
      if (planId) {
        this.listQuery.planId = planId
      }
      this.listLoading = true
      getUseableDevicePage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.current = 1
      this.getList(this.planId)
    },
    handleSizeChange (val) {
      this.listQuery.size = val
      this.getList(this.planId)
    },
    handleCurrentChange (val) {
      this.listQuery.current = val
      this.getList(this.planId)
    },
    allocateDevice (row) {
      if (!row.nodeId) {
        this.$notify({
          title: '提示',
          message: '请选择要分配的考点',
          type: 'warning',
          duration: 2000
        })
        return
      }
      var nodeName = ''
      this.allocatedExamNodes.forEach(element => {
        if (element.nodeId === row.nodeId) {
          nodeName = element.nodeName
        }
      })
      // 添加分配记录
      this.form.nodeId = row.nodeId
      this.form.nodeName = nodeName
      this.form.planId = this.planId
      this.form.deviceId = row.deviceId
      this.form.imeiNo = row.imeiNo
      addPlanDevice(this.form).then(() => {
        this.dialogFormVisible = false
        this.resetTemp()
        this.getList(this.planId)
        this.$notify({
          title: '成功',
          message: '分配设备成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    cancel (formName) {
      this.dialogFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    resetTemp () {
      this.form = {
        planId: undefined,
        deviceId: undefined,
        imeiNo: undefined,
        nodeId: undefined,
        nodeName: undefined,
        beginTime: undefined,
        endTime: undefined
      }
    }
  }
}
</script>
