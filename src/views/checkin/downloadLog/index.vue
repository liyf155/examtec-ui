<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-input
          v-model="listQuery.imeiNo"
          style="width: 200px;"
          class="filter-item"
          placeholder="模糊查询"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
      </el-form>
    </div>
    <el-table
      :key="tableKey"
      v-loading.body="listLoading"
      :data="list"
      element-loading-text="正在加载..."
      border
      fit
      highlight-current-row
      style="width: 99%"
    >
      <el-table-column align="center" label="设备号">
        <template slot-scope="scope">
          <span>{{ scope.row.imeiNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下载类型">
        <template slot-scope="scope">
          <span>{{ scope.row.downType | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下载时间">
        <template slot-scope="scope">
          <span>{{ scope.row.downTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="耗时(单位：秒)">
        <template slot-scope="scope">
          <span>{{ scope.row.usedTime }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            v-if="ck_downloadLog_del"
            size="small"
            type="danger"
            @click="deleteDownloadLog(scope.row)"
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
  </div>
</template>

<script>
import {
  getDownloadLogsByPage,
  getDownloadLog,
  delDownloadLog
} from '@/api/checkin/downloadLog'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'DownloadLog',
  directives: {
    waves
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: '全量下载',
        1: '增量下载'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      form: {
        planId: undefined,
        imeiNo: undefined,
        downTime: undefined,
        downType: undefined,
        success: undefined
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
      ck_downloadLog_add: false,
      ck_downloadLog_del: false,
      ck_downloadLog_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created () {
    this.getList()
    this.ck_downloadLog_add = this.permissions['ck_downloadLog_add']
    this.ck_downloadLog_edit = this.permissions['ck_downloadLog_edit']
    this.ck_downloadLog_del = this.permissions['ck_downloadLog_del']
  },
  methods: {
    getList () {
      this.listLoading = true
      getDownloadLogsByPage(this.listQuery).then(response => {
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
      getDownloadLog(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteDownloadLog (row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDownloadLog(row.id).then(() => {
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
    cancel (formName) {
      this.dialogFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    resetTemp () {
      this.form = {
        planId: undefined,
        imeiNo: undefined,
        downTime: undefined,
        downType: undefined,
        success: undefined
      }
    }
  }
}
</script>
