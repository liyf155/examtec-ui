<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="可分配设备" name="first">
          <UseableDevice ref="UseableDevice" :plan-id="planId" />
        </el-tab-pane>
        <el-tab-pane label="已分配设备" name="second">
          <AllocatedDevice ref="AllocatedDevice" :plan-id="planId" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { allcatedExamNodes } from '@/api/checkin/checkinPeople'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'DeviceConfig',
  components: {
    'AllocatedDevice': () => import('./allocatedDevice'),
    'UseableDevice': () => import('./useableDevice')
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
  props: {
    planId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      listLoading: false,
      listQuery: {},
      total: undefined,
      activeName: 'first',
      useableDevices: [],
      currentDevices: [],
      allocatedExamNodes: [],
      nodeId: undefined
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
  },
  created () {
    this.getAllocatedExamNodes(this.planId)
    this.activeName = 'first'
  },
  methods: {
    initTab () {
      this.activeName = 'first'
    },
    handleClick (tab, event) {
      if (tab.index === '0') {
        this.$refs.UseableDevice.getList(this.planId)
        this.$refs.UseableDevice.allocatedExamNodes = this.allocatedExamNodes
      }
      if (tab.index === '1') {
        this.$refs.AllocatedDevice.getList(this.planId)
      }
    },
    getAllocatedExamNodes (planId) {
      console.log(planId)
      allcatedExamNodes(planId).then(res => {
        this.allocatedExamNodes = res.data
        this.$refs.UseableDevice.allocatedExamNodes = this.allocatedExamNodes
      })
    }
  }
}
</script>
