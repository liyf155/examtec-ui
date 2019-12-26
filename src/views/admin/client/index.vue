<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.clientId" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="sys_client_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="toAdd">
        添加
      </el-button>
    </div>
    <el-table
      :key="tableKey" v-loading="listLoading" :data="list"
      element-loading-text="正在加载..." border fit
      highlight-current-row style="width: 99%" @current-change="handleDataCurrentChange"
    >
      <el-table-column align="center" label="客户端名称">
        <template slot-scope="scope">
          <span>{{ scope.row.clientId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户端密钥">
        <template slot-scope="scope">
          <span>{{ scope.row.clientSecret }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="域">
        <template slot-scope="scope">
          <span>{{ scope.row.scope }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="授权模式">
        <template slot-scope="scope">
          <span>{{ scope.row.authorizedGrantTypes }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="自动放行">
        <template slot-scope="scope">
          <span>{{ scope.row.autoapprove }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="sys_client_edit" size="mini" type="success" @click="toEdit(scope.row)">
            编辑
          </el-button>
          <el-button v-if="sys_client_del" size="mini" type="danger" @click="DelClient(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="客户端名称" prop="clientId">
          <el-input v-if="dialogStatus=='update'" v-model="form.clientId" placeholder="请输入客户端名称" :disabled="true" />
          <el-input v-if="dialogStatus=='create'" v-model="form.clientId" placeholder="请输入客户端名称" />
        </el-form-item>
        <el-form-item label="客户端秘钥" prop="clientSecret">
          <el-input v-model="form.clientSecret" placeholder="请输入客户端密钥" />
        </el-form-item>
        <el-form-item label="域" prop="scope">
          <el-input v-model="form.scope" placeholder="请输入域" />
        </el-form-item>
        <el-form-item label="授权模式" prop="authorizedGrantTypes">
          <el-input v-model="form.authorizedGrantTypes" placeholder="授权模式，例password,refresh_token" />
        </el-form-item>
        <el-form-item label="自动放行" prop="autoapprove">
          <el-radio v-model="form.autoapprove" label="0">
            是
          </el-radio>
          <el-radio v-model="form.autoapprove" label="1">
            否
          </el-radio>
        </el-form-item>
        <el-form-item label="回调地址" prop="webServerRedirectUri">
          <el-input v-model="form.webServerRedirectUri" placeholder="请输入回调地址" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">
          取 消
        </el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="AddClient('form')">
          确 定
        </el-button>
        <el-button v-else type="primary" @click="UpdClient('form')">
          修 改
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getClientsByPage, addClient, delClient, updClient, getClient } from '@/api/admin/client'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { mapGetters } from 'vuex'

export default {
  name: 'TableAuthClient',
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
        current: 1,
        size: 10
      },
      rules: {
        clientId: [
          {
            required: true,
            message: '请输入客户端名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        clientSecret: [
          {
            required: true,
            message: '请输入客户端密钥',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        scope: [
          {
            required: true,
            message: '请输入域值，如：server',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
        // authorizedGrantTypes: [
        //   {
        //     required: true,
        //     message: '请输入授权模式，例如password,refresh_token',
        //     trigger: 'blur'
        //   },
        //   {
        //     min: 3,
        //     max: 20,
        //     message: '长度在 3 到 50 个字符',
        //     trigger: 'blur'
        //   }
        // ]
      },
      form: {
        autoapprove: 0
      },
      statusOptions: ['0', '1'],
      dialogFormVisible: false,
      dialogClientVisible: false,
      dialogStatus: '',
      sys_dict_add: false,
      sys_dict_upd: false,
      sys_dict_del: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      currentId: -1
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created () {
    this.getList()
    this.sys_client_add = this.permissions['sys_client_add']
    this.sys_client_edit = this.permissions['sys_client_edit']
    this.sys_client_del = this.permissions['sys_client_del']
  },
  methods: {
    getList () {
      this.listLoading = true
      this.listQuery.orderByField = 'crt_time'
      this.listQuery.isAsc = false
      getClientsByPage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDataCurrentChange (val) {
      this.currentId = val.id
    },
    closeClientDialog () {
      this.dialogClientVisible = false
    },
    DelClient (row) {
      this.$confirm(
        '此操作将永久删除数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        delClient(row.clientId)
          .then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
          .cache(() => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
      }).catch(() => {
      })
    },
    toEdit (row) {
      getClient(row.clientId).then(res => {
        this.form = res.data
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      })
    },
    toAdd () {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    AddClient (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addClient(this.form).then(() => {
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
    UpdClient (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          updClient(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.form = {
        clientId: undefined,
        clientSecret: undefined,
        authorizedGrantTypes: undefined,
        autoapprove: undefined,
        webServerRedirectUri: undefined,
        scope: undefined
      }
    }
  }
}
</script>
