<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="计划：">
          <el-select v-model="listQuery.planId" placeholder="===请选择===" clearable style="width: 300px" @change="examPlanChange">
            <el-option v-for="p in planIdList" :key="p.id" :label="p.planName" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="考点：">
          <el-select v-model="listQuery.nodeId" class="filter-item" filterable clearable placeholder="===请选择===" @change="examNodeFilter">
            <el-option
              v-for="(item, idx) in examNodes"
              :key="idx"
              :label="item.nodeName"
              :value="item.nodeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入场时间：">
          <el-date-picker
            v-model="timeSegment"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form>
    </div>
    <el-table
      :key="tableKey" v-loading.body="listLoading" :data="list"
      element-loading-text="正在加载..." border fit
      highlight-current-row style="width: 99%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column align="center" label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.provinceName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点">
        <template slot-scope="scope">
          <span>{{ scope.row.nodeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="报考人数" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.bkCount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参考人数" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.ckCount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参考率" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.ckRate }}%</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listCheckinSocketStat } from '@/api/checkin/checkinSocket'
import { getPlanList } from '@/api/checkin/checkinPlan'
import { mapGetters } from 'vuex'
import { allcatedExamNodes } from '@/api/checkin/checkinPeople'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'CheckinSocket',
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
    dataTypeFilter (type) {
      const typeMap = {
        0: '人证机',
        1: '智能抓拍机'
      }
      return typeMap[type]
    }
  },
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        planId: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      ck_checkinSocket_add: false,
      ck_checkinSocket_del: false,
      ck_checkinSocket_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      planIdList: null,
      dataTypeList: [
        {
          label: '人证机',
          value: 0
        },
        {
          label: '智能抓拍机',
          value: 1
        }
      ],
      checkinSocketDown: {
        planId: undefined,
        imeiNo: undefined,
        dataType: undefined
      },
      timeSegment: [],
      examNodes: []
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
  },
  created () {
    this.getPlanIdList()
  },
  methods: {
    getList () {
      this.listLoading = true
      if (this.timeSegment.length > 0) {
        this.listQuery.startTime = this.timeSegment[0]
        this.listQuery.endTime = this.timeSegment[1]
      }
      listCheckinSocketStat(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
      this.listPlanNodes(this.listQuery.planId)
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
    cancel (formName) {
      this.dialogFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    getPlanIdList () {
      getPlanList().then(response => {
        this.planIdList = response.data
        this.listQuery.planId = response.data[0].id
        this.getList()
      })
    },
    examPlanChange () {
      this.listQuery.nodeId = ''
      this.getList()
    },
    listPlanNodes (planId) {
      allcatedExamNodes(planId).then(res => {
        this.examNodes = res.data
      })
    },
    examNodeFilter () {
      this.getList()
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row.ckRate !== '0.00') {
        if (row.ckRate < 70) {
          return 'warning-row'
        } else {
          return 'success-row'
        }
      } else {
        return 'error-row'
      }
    }
  }
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-table .error-row {
    background: #da9b9b;
  }
</style>
