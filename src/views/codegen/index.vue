<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="数据库">
          <el-select
            v-model="listQuery.tableSchema" class="filter-item" filterable
            placeholder="请选择数据源" style="width:200px" clearable
            @change="databaseChange"
          >
            <el-option v-for="db in databases" :key="db" :label="db" :value="db" />
          </el-select>
        </el-form-item>
        <el-form-item label="表名">
          <el-input v-model="listQuery.tableName" style="width: 200px;" class="filter-item" placeholder="表名称" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-right: 10px;" type="text" :icon="extButtonIcon" @click="showMoreCond">
            展开
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="multiCondVisible" class="filter-container">
      <el-form inline>
        <el-form-item label="包名">
          <el-input v-model="generatorForm.packageName" style="width: 200px;" class="filter-item" placeholder="包名,例如：com.fstec.boot" />
        </el-form-item>
        <el-form-item label="模块名称">
          <el-input v-model="generatorForm.moduleName" style="width: 200px;" class="filter-item" placeholder="模块名称" />
        </el-form-item>
        <el-form-item label="表前缀">
          <el-input v-model="generatorForm.tablePrefix" style="width: 200px;" class="filter-item" placeholder="表前缀" />
        </el-form-item>
        <el-form-item label="开发人员">
          <el-input v-model="generatorForm.author" style="width: 200px;" class="filter-item" placeholder="开发人员" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="generatorForm.email" style="width: 200px;" class="filter-item" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="generatorForm.version" style="width: 200px;" class="filter-item" placeholder="版本号" />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="generateCode">
            生成代码
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :key="tableKey" ref="multipleTable" v-loading="listLoading"
      :data="list" element-loading-text="正在加载..." border
      fit highlight-current-row style="width: 99%"
    >
      <el-table-column type="selection" align="center" width="60" />
      <el-table-column align="center" label="表名称">
        <template slot-scope="scope">
          <span>{{ scope.row.tableName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="表注释">
        <template slot-scope="scope">
          <span>{{ scope.row.tableComment }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数据库引擎">
        <template slot-scope="scope">
          <span>{{ scope.row.engine }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
import { fetchList, fetchDatabases, generateAndDownload } from '@/api/codegen/gen'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'TableCodegen',
  directives: {
    waves
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: '正常',
        1: '已锁定'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1, // 当前页数
        size: 10 // 每页显示多少条
      },
      statusOptions: ['0', '1'],
      tableKey: 0,
      currentId: -1,
      selectedTables: [],
      databases: [],
      generatorForm: {
        packageName: undefined,
        author: undefined,
        version: undefined,
        email: undefined,
        tablePrefix: undefined,
        moduleName: undefined,
        tableSchema: undefined,
        tableNames: []
      },
      extButtonIcon: 'el-icon-caret-bottom',
      multiCondVisible: false
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created () {
    this.getDatabases()
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
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
    getDatabases () {
      fetchDatabases().then(res => {
        this.databases = res.data
      })
    },
    generateCode () {
      const selectResults = this.$refs.multipleTable.store.states.selection
      selectResults.forEach(element => {
        this.generatorForm.tableNames.push(element.tableName)
      })
      if (this.generatorForm.tableNames.size === 0) {
        Message({
          message: '请至少选择一行在进行操作',
          type: 'warning'
        })
      } else {
        this.generatorForm.tableSchema = this.listQuery.tableSchema
        generateAndDownload(this.generatorForm).then(() => {
          // console.log(res)
          this.getList()
        })
      }
    },
    databaseChange () {
      this.getList()
    },
    showMoreCond () {
      if (this.multiCondVisible) {
        this.multiCondVisible = false
        this.generatorForm.tableNames = ''
        this.generatorForm.author = ''
        this.generatorForm.version = ''
        this.generatorForm.email = ''
        this.generatorForm.tablePrefix = ''
        this.generatorForm.moduleName = ''
        this.generatorForm.tableNames = []
        this.generatorForm.packageName = ''
      } else {
        this.multiCondVisible = true
        this.extButtonIcon = 'el-icon-caret-top'
      }
    }
  }
}
</script>
