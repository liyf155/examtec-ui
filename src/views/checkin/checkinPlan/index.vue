<template>
  <div v-if="!planPeopleDialogVisible" class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form>
        <el-input v-model="listQuery.planName" style="width: 200px;" class="filter-item" placeholder="模糊查询" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button v-if="ck_checkinPlan_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
          添加
        </el-button>
      </el-form>
    </div>
    <el-table
      :key="tableKey" v-loading.body="listLoading" :data="list"
      element-loading-text="正在加载..." border fit
      highlight-current-row style="width: 99%"
    >
      <el-table-column align="center" label="计划名称">
        <template slot-scope="scope">
          <span>{{ scope.row.planName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="考试名称">
        <template slot-scope="scope">
          <span>{{ scope.row.itemName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="310px" label="场次编辑">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="openRoundConfig(scope.row)">
            <span
              v-if="scope.row.beginTime"
            >{{ scope.row.beginTime | parseTime('{y}-{m}-{d} {h}:{i}') }} 至
              {{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            <span v-else>- 至 -</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="人员分配">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handlePlanPeople(scope.row)">
            <span>{{ scope.row.peopleCount }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备分配">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-share" @click="openDeviceConfig(scope.row)">
            <span />
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="ck_checkinPlan_edit" size="small" type="success" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button v-if="ck_checkinPlan_del" size="small" type="danger" @click="deleteCheckinPlan(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        :current-page.sync="listQuery.current" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="计划名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入计划名称" />
        </el-form-item>
        <el-form-item label="考试项目" prop="itemId">
          <el-select v-model="form.itemId" class="filter-item" filterable placeholder="请选择考试项目" style="width:350px">
            <el-option v-for="item in examItems" :key="item.id" :label="item.itemName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">
          取 消
        </el-button>
        <el-button v-if="dialogStatus == 'create'" type="primary" @click="createCheckinPlan('form')">
          确 定
        </el-button>
        <el-button v-else type="primary" @click="updateCheckinPlan('form')">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 场次编排会话 -->
    <el-dialog :title="roundConfigTitle" width="50%" :before-close="closeRoundConfig" :visible.sync="roundConfigVisible">
      <RoundConfig ref="RoundConfig" :plan-id="currentPlanId" @page="getList" />
    </el-dialog>
    <!-- 设备配置会话 -->
    <el-dialog :title="deviceConfigTitle" width="60%" :before-close="closeDeviceConfigDialog" :visible.sync="deviceConfigVisible">
      <DeviceConfig ref="DeviceConfig" :plan-id="currentPlanId" @page="getList" />
    </el-dialog>
  </div>
  <div v-else>
    <!-- 考生编辑会话 -->
    <PlanPeople ref="planPeopleClient" :plan-id="currentPlanId" :item-id="currentItemId" @closePlanPeopleDialog="closePlanPeopleDialog" />
  </div>
</template>

<script>
import {
  getCheckinPlansByPage,
  addCheckinPlan,
  getCheckinPlan,
  delCheckinPlan,
  updCheckinPlan
} from '@/api/checkin/checkinPlan'
import { getExamItemList } from '@/api/basic/examItem'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'CheckinPlan',
  components: {
    PlanPeople: () => import('./planPeople'),
    RoundConfig: () => import('./roundConfig'),
    DeviceConfig: () => import('./deviceConfig')
  },
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
  data () {
    return {
      form: {
        planName: undefined,
        itemId: '',
        itemName: ''
      },
      rules: {
        planName: [
          {
            required: true,
            message: '请输入签到计划名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 40,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
          }
        ],
        itemId: [
          {
            required: true,
            message: '请选择考试项目',
            trigger: 'blur'
          }
        ]
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
      planPeopleDialogVisible: false,
      dialogStatus: '',
      ck_checkinPlan_add: false,
      ck_checkinPlan_del: false,
      ck_checkinPlan_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      currentPlanId: '',
      currentItemId: '',
      examItems: [],
      roundConfigVisible: false,
      roundConfigTitle: '场次编辑',
      deviceConfigVisible: false,
      deviceConfigTitle: '设备编排'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created () {
    this.getList()
    this.ck_checkinPlan_add = this.permissions['ck_checkinPlan_add']
    this.ck_checkinPlan_edit = this.permissions['ck_checkinPlan_edit']
    this.ck_checkinPlan_del = this.permissions['ck_checkinPlan_del']
  },
  methods: {
    getList () {
      this.listLoading = true
      getCheckinPlansByPage(this.listQuery).then(response => {
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
      getExamItemList().then(res => {
        this.examItems = res.data
      })
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      getExamItemList().then(res => {
        this.examItems = res.data
      })
      getCheckinPlan(row.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteCheckinPlan (row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCheckinPlan(row.id).then(() => {
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
    createCheckinPlan (formName) {
      const set = this.$refs
      this.form.itemName = this.getItemLabel()
      set[formName].validate(valid => {
        if (valid) {
          addCheckinPlan(this.form).then(() => {
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
    getItemLabel () {
      let itemName = ''
      this.examItems.find((item) => {
        if (item.id === this.form.itemId) {
          itemName = item.itemName
        }
      })
      return itemName
    },
    cancel (formName) {
      this.dialogFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    updateCheckinPlan (formName) {
      const set = this.$refs
      this.form.itemName = this.getItemLabel()
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updCheckinPlan(this.form).then(() => {
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
        planName: undefined,
        roundCount: undefined,
        nodeCount: undefined,
        peopleCount: undefined
      }
    },
    handlePlanPeople (row) {
      this.currentPlanId = row.id
      this.currentItemId = row.itemId
      this.planPeopleDialogVisible = true
    },
    closePlanPeopleDialog () {
      this.currentPlanId = ''
      this.currentItemId = ''
      this.planPeopleDialogVisible = false
      this.getList()
    },
    openRoundConfig (row) {
      this.currentPlanId = row.id
      this.roundConfigVisible = true
      this.$refs.RoundConfig.getList(row.id)
    },
    closeRoundConfig () {
      this.roundConfigVisible = false
      this.currentPlanId = ''
      this.getList()
    },
    openDeviceConfig (row) {
      this.deviceConfigTitle = row.planName + '-设备编排'
      this.currentPlanId = row.id
      this.deviceConfigVisible = true
      this.$refs.DeviceConfig.initTab()
    },
    closeDeviceConfigDialog () {
      this.currentPlanId = ''
      this.deviceConfigVisible = false
      this.getList()
    }
  }
}
</script>
