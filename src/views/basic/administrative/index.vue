<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="名称：">
          <el-input
            v-model="listQuery.name" style="width: 200px;" class="filter-item"
            placeholder="模糊查询" @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button
          v-if="mt_administrative_add" class="filter-item" style="margin-left: 10px;"
          type="primary" icon="el-icon-plus" @click="handleCreate"
        >
          添加
        </el-button>
      </el-form>
    </div>
    <el-row>
      <el-col :span="3">
        <el-tree
          class="filter-tree"
          node-key="parentCode"
          highlight-current
          :data="administrativeTree"
          :props="defaultProps"
          :default-expanded-keys="aExpandedKeys"
          :filter-node-method="filterNode"
          @node-click="getAdministrativeById"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
        />
      </el-col>
      <el-col :span="20">
        <el-table
          :key="tableKey" v-loading.body="listLoading" :data="list"
          element-loading-text="正在加载..." border fit
          highlight-current-row style="width: 99%;margin-left:3%"
        >
          <el-table-column align="center" label="行政编码">
            <template slot-scope="scope">
              <span>{{ scope.row.areaCode }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="行政等级">
            <template slot-scope="scope">
              <span>{{ scope.row.level }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="邮政编码">
            <template slot-scope="scope">
              <span>{{ scope.row.zipCode }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="区号">
            <template slot-scope="scope">
              <span>{{ scope.row.cityCode }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="名称">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="简称">
            <template slot-scope="scope">
              <span>{{ scope.row.shortName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="组合名">
            <template slot-scope="scope">
              <span>{{ scope.row.mergerName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="拼音">
            <template slot-scope="scope">
              <span>{{ scope.row.pinyin }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="经度">
            <template slot-scope="scope">
              <span>{{ scope.row.lng }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="纬度">
            <template slot-scope="scope">
              <span>{{ scope.row.lat }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                v-if="mt_administrative_edit" size="small" type="success"
                @click="handleUpdate(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                v-if="mt_administrative_del" size="small" type="danger"
                @click="deleteAdministrative(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container" style="margin-left:3%">
          <el-pagination
            :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]"
            :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper"
            :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="父级行政代码" prop="parentCode">
          <el-input v-model="form.parentCode" placeholder="请输入父级行政代码" />
        </el-form-item>
        <el-form-item label="行政等级" prop="level">
          <el-input v-model="form.level" placeholder="请输入行政等级" />
        </el-form-item>
        <el-form-item label="邮政编码" prop="zipCode">
          <el-input v-model="form.zipCode" placeholder="请输入邮政编码" />
        </el-form-item>
        <el-form-item label="区号" prop="cityCode">
          <el-input v-model="form.cityCode" placeholder="请输入区号" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="简称" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入简称" />
        </el-form-item>
        <el-form-item label="组合名" prop="mergerName">
          <el-input v-model="form.mergerName" placeholder="请输入组合名" />
        </el-form-item>
        <el-form-item label="拼音" prop="pinyin">
          <el-input v-model="form.pinyin" placeholder="请输入拼音" />
        </el-form-item>
        <el-form-item label="经度" prop="lng">
          <el-input v-model="form.lng" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" prop="lat">
          <el-input v-model="form.lat" placeholder="请输入纬度" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">
          取 消
        </el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createAdministrative('form')">
          确 定
        </el-button>
        <el-button v-else type="primary" @click="updateAdministrative('form')">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listByPage, save, getById, update, removeById, getAdministrativeTree
} from '@/api/basic/administrative.js'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'Administrative',
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
        parentCode: undefined,
        level: undefined,
        zipCode: undefined,
        cityCode: undefined,
        name: undefined,
        shortName: undefined,
        mergerName: undefined,
        pinyin: undefined,
        lng: undefined,
        lat: undefined
      },
      rules: {},
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        name: undefined,
        parentCode: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      mt_administrative_add: false,
      mt_administrative_del: false,
      mt_administrative_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      administrativeTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      aExpandedKeys: [],
      oExpandedKey: {}
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
  },
  created () {
    this.getList()
    this.getAdministrativeTree()
    this.mt_administrative_add = this.permissions['mt_administrative_add']
    this.mt_administrative_edit = this.permissions['mt_administrative_edit']
    this.mt_administrative_del = this.permissions['mt_administrative_del']
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
      getById(row.areaCode).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteAdministrative (row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeById(row.areaCode).then(() => {
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
    createAdministrative (formName) {
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
    updateAdministrative (formName) {
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
        parentCode: undefined,
        level: undefined,
        zipCode: undefined,
        cityCode: undefined,
        name: undefined,
        shortName: undefined,
        mergerName: undefined,
        pinyin: undefined,
        lng: undefined,
        lat: undefined
      }
    },
    getAdministrativeTree () {
      getAdministrativeTree().then(response => {
        this.administrativeTree = response.data
      })
    },
    getAdministrativeById (data) {
      this.listQuery.parentCode = data.id
      this.listLoading = true
      listByPage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    filterNode (value, data) {
      if (!value) {
        return true
      }
      return data.label.indexOf(value) !== -1
    },
    setExpandedKeys () {
      const oTemp = this.oExpandedKey
      this.aExpandedKeys = []
      for (const sKey in oTemp) {
        if (oTemp[sKey]) {
          this.aExpandedKeys.push(parseInt(sKey))
        }
      }
    },
    nodeExpand (data) {
      const aChildren = data.children
      if (aChildren.length > 0) {
        this.oExpandedKey[data.id] = true
        this.oTreeNodeChildren[data.id] = aChildren
      }
      this.setExpandedKeys()
    },
    nodeCollapse (data) {
      this.oExpandedKey[data.id] = false
      // 如果有子节点
      this.treeRecursion(this.oTreesNodeChildren[data.id], (oNode) => {
        this.oExpandedKey[oNode.id] = false
      })
      this.setExpandedKeys()
    }
  }
}
</script>
