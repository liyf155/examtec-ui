<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item label="考点名称：">
          <el-input
            v-model="listQuery.nodeName" style="width: 200px;" class="filter-item"
            placeholder="模糊查询" @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button
          v-if="mt_examNode_add" class="filter-item" style="margin-left: 10px;"
          type="primary"
          icon="el-icon-plus" @click="handleCreate"
        >
          添加
        </el-button>
      </el-form>
    </div>
    <el-table
      :key="tableKey" v-loading.body="listLoading" :data="list"
      element-loading-text="正在加载..." border fit
      highlight-current-row style="width: 99%"
    >
      <el-table-column align="center" label="所属省份">
        <template slot-scope="scope">
          <span>{{ scope.row.provinceName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属城市">
        <template slot-scope="scope">
          <span>{{ scope.row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点名称">
        <template slot-scope="scope">
          <span>{{ scope.row.nodeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="考点地址">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地理经度">
        <template slot-scope="scope">
          <span>{{ scope.row.lng }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地理纬度">
        <template slot-scope="scope">
          <span>{{ scope.row.lat }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="交通">
        <template slot-scope="scope">
          <span>{{ scope.row.traffic }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="mt_examNode_edit" size="small" type="success" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button v-if="mt_examNode_del" size="small" type="danger" @click="deleteExamNode(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        :current-page.sync="listQuery.current" :page-sizes="[10,20,30,50]"
        :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper"
        :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="所属省份名称" prop="provinceId">
              <el-select v-model="form.provinceId" placeholder="===请选择===" style="width: 210px" filterable clearable @change="initCities(form.provinceId)">
                <el-option v-for="p in provinceNameList" :key="p.areaCode" :label="p.name" :value="p.areaCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="所属城市名称" prop="cityId">
              <el-select v-model="form.cityId" placeholder="===请选择===" style="width: 210px" filterable clearable>
                <el-option v-for="c in cityNameList" :key="c.areaCode" :label="c.name" :value="c.areaCode" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="考点名称" prop="nodeName">
              <el-input v-model="form.nodeName" placeholder="请输入考点名称" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="考点地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入考点地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="负责人" prop="linkerName">
              <el-input v-model="form.linkerName" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="联系电话" prop="linkerPhone">
              <el-input v-model="form.linkerPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="地理经度" prop="lng">
              <el-input v-model="form.lng" placeholder="请输入地理经度" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="地理纬度" prop="lat">
              <el-input v-model="form.lat" placeholder="请输入地理纬度" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="交通信息" prop="traffic">
              <el-input v-model="form.traffic" type="textarea" :rows="2" placeholder="请输入交通信息" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">
          取 消
        </el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createExamNode('form')">
          确 定
        </el-button>
        <el-button v-else type="primary" @click="updateExamNode('form')">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listByPage, save, getById, update, removeById } from '@/api/basic/examNode'
import { getAdministrativeSelect } from '@/api/basic/administrative.js'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 水波纹
export default {
  name: 'ExamNode',
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
    return {
      form: {
        provinceId: undefined,
        provinceName: undefined,
        cityId: undefined,
        cityName: undefined,
        nodeName: undefined,
        address: undefined,
        linkerName: undefined,
        linkerPhone: undefined,
        roomCount: undefined,
        seatCount: undefined,
        lng: undefined,
        lat: undefined,
        traffic: undefined
      },
      rules: {
        nodeName: [
          { required: true, message: '请输入考点名称', trigger: 'blur' }
        ],
        provinceId: [
          { required: true, message: '请选择考点所属省份', trigger: 'blur' }
        ],
        // linkerPhone: [
        //   { required: true, validator: checkLinkerPhone, trigger: 'blur' }
        // ],
        cityId: [
          { required: true, message: '请选择考点所属城市', trigger: 'blur' }
        ]
        // seatCount: [
        //   { required: true, message: '请输入座位数', trigger: 'blur' }
        // ]
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
      mt_examNode_add: false,
      mt_examNode_del: false,
      mt_examNode_edit: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      provinceNameList: [],
      cityNameList: []
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
  },
  created () {
    this.getList()
    // this.getAdministrativeList()
    this.mt_examNode_add = this.permissions['mt_examNode_add']
    this.mt_examNode_edit = this.permissions['mt_examNode_edit']
    this.mt_examNode_del = this.permissions['mt_examNode_del']
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
      this.initProvinces()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      getById(row.id).then(response => {
        this.initProvinces()
        this.initCities(row.provinceId)
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    deleteExamNode (row) {
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
    createExamNode (formName) {
      const set = this.$refs
      this.form.provinceName = this.getProvinceName()
      this.form.cityName = this.getCityName()
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
    updateExamNode (formName) {
      const set = this.$refs
      this.form.provinceName = this.getProvinceName()
      this.form.cityName = this.getCityName()
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
        provinceId: undefined,
        provinceName: undefined,
        cityId: undefined,
        cityName: undefined,
        nodeName: undefined,
        address: undefined,
        linkerName: undefined,
        linkerPhone: undefined,
        roomCount: undefined,
        seatCount: undefined,
        lng: undefined,
        lat: undefined,
        traffic: undefined
      }
    },
    initProvinces () {
      getAdministrativeSelect(0).then(response => {
        this.provinceNameList = response.data
      })
    },
    initCities (provinceId) {
      this.form.cityId = ''
      getAdministrativeSelect(provinceId).then(response => {
        this.cityNameList = response.data
      })
    },
    getProvinceName () {
      let provinceName = ''
      this.provinceNameList.find((item) => {
        if (item.areaCode === this.form.provinceId) {
          provinceName = item.name
        }
      })
      return provinceName
    },
    getCityName () {
      let cityName = ''
      this.cityNameList.find((item) => {
        if (item.areaCode === this.form.cityId) {
          cityName = item.name
        }
      })
      return cityName
    }
  }
}
</script>
