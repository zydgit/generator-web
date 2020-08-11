<template>
  <Drawer :visible.sync="drawer" :title="remark + '代码生成配置'" :size="86" @opened="pageInit">
    <div class="app-container">
      <el-row :gutter="15">
        <el-col style="margin-bottom: 10px">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span class="role-span">{{ remark }}字段配置：{{ tableName }}</span>
              <el-button
                :loading="genLoading"
                icon="el-icon-s-promotion"
                size="mini"
                style="float: right; padding: 6px 9px;"
                type="xy-primary"
                @click="toGen"
              >保存&生成
              </el-button>
              <el-button
                :loading="columnLoading"
                icon="el-icon-check"
                size="mini"
                style="float: right; padding: 6px 9px;margin-right: 9px"
                type="xy-primary"
                @click="saveColumnConfig"
              >保存
              </el-button>
              <el-tooltip class="item" effect="dark" content="数据库中表字段变动时使用该功能" placement="top-start">
                <el-button
                  :loading="syncLoading"
                  icon="el-icon-refresh"
                  size="mini"
                  style="float: right; padding: 6px 9px;"
                  type="info"
                  @click="sync"
                >同步
                </el-button>
              </el-tooltip>
            </div>
            <el-form label-position="left" size="small" label-width="130px">
              <el-table
                v-loading="loading"
                :data="data"
                :max-height="tableHeight"
                size="mini"
                style="width: 100%;margin-bottom: 15px">
                <el-table-column :show-overflow-tooltip="true" prop="columnName" label="字段名称"/>
                <el-table-column :show-overflow-tooltip="true" prop="columnType" label="字段类型"/>
                <el-table-column :show-overflow-tooltip="true" prop="remark" label="字段描述">
                  <template slot-scope="scope">
                    <el-input v-model="data[scope.$index].remark" size="mini" class="edit-input"/>
                  </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" label="必填" width="70px">
                  <template slot-scope="scope">
                    <el-checkbox v-model="data[scope.$index].notNull"/>
                  </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" label="列表" width="70px">
                  <template slot-scope="scope">
                    <el-checkbox v-model="data[scope.$index].listShow"/>
                  </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" label="表单" width="70px">
                  <template slot-scope="scope">
                    <el-checkbox v-model="data[scope.$index].formShow"/>
                  </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="表单类型">
                  <template slot-scope="scope">
                    <el-select
                      v-model="data[scope.$index].formType"
                      filterable
                      class="edit-input"
                      clearable
                      size="mini"
                      placeholder="请选择">
                      <el-option
                        label="文本框"
                        value="Input"
                      />
                      <el-option
                        label="文本域"
                        value="Textarea"
                      />
<!--                      <el-option-->
<!--                        label="单选框"-->
<!--                        value="Radio"-->
<!--                      />-->
                      <el-option
                        label="下拉框"
                        value="Select"
                      />
                      <el-option
                        label="日期框"
                        value="Date"
                      />
<!--                      <el-option-->
<!--                        label="Lov框"-->
<!--                        value="Lov"-->
<!--                      />-->
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="查询方式">
                  <template slot-scope="scope">
                    <el-select
                      v-model="data[scope.$index].queryType"
                      filterable
                      class="edit-input"
                      clearable
                      size="mini"
                      placeholder="请选择">
                      <el-option
                        label="="
                        value="="
                      />
                      <el-option
                        label="!="
                        value="!="
                      />
                      <el-option
                        label=">="
                        value=">="
                      />
                      <el-option
                        label="<="
                        value="<="
                      />
                      <el-option
                        label="Like"
                        value="Like"
                      />
                      <el-option
                        label="NotNull"
                        value="NotNull"
                      />
                      <el-option
                        label="BetWeen"
                        value="BetWeen"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="日期注解">
                  <template slot-scope="scope">
                    <el-select
                      v-model="data[scope.$index].dateAnnotation"
                      filterable
                      class="edit-input"
                      clearable
                      size="mini"
                      placeholder="请选择">
                      <el-option
                        label="自动创建时间"
                        value="CreationTimestamp"
                      />
                      <el-option
                        label="自动更新时间"
                        value="UpdateTimestamp"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="关联字典">
                  <template slot-scope="scope">
                    <el-input :disabled="data[scope.$index].formType !== 'Select'" v-model="data[scope.$index].dictName" size="mini" class="edit-input"/>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-card>
        </el-col>
        <el-col>
          <el-card v-loading="loading" class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span class="role-span">生成配置</span>
              <el-button
                :loading="configLoading"
                icon="el-icon-check"
                size="mini"
                style="float: right; padding: 6px 9px"
                type="xy-primary"
                @click="doSubmit"
              >保存
              </el-button>
            </div>
            <el-form ref="form" :model="form" :rules="rule" label-position="left" size="small" label-width="130px">
              <el-form-item label="作者名称" prop="author">
                <el-input v-model="form.author" style="width: 40%"/>
                <span style="color: #C0C0C0;margin-left: 10px;">类上面的作者名称</span>
              </el-form-item>
<!--              <el-form-item label="代码生成" prop="section">-->
<!--                <el-radio-group-->
<!--                  v-model="form.section"-->
<!--                  style="width: 40%; display: inline-block"-->
<!--                  @change="$refs['form'].clearValidate()">-->
<!--                  <el-radio-button label="FRONT">前端</el-radio-button>-->
<!--                  <el-radio-button label="ADMIN">后端</el-radio-button>-->
<!--                  <el-radio-button label="BOTH">Both</el-radio-button>-->
<!--                </el-radio-group>-->
<!--                <span style="color: #C0C0C0;margin-left: 10px;">生成前后端代码</span>-->
<!--              </el-form-item>-->
              <el-form-item label="模块名称" prop="moduleName">
                <el-input v-model="form.moduleName" :disabled="!genAdmin" style="width: 40%"/>
                <span style="color: #C0C0C0;margin-left: 10px;">模块的名称，请选择项目中已存在的模块</span>
              </el-form-item>
              <el-form-item label="至于包下" prop="pack">
                <el-input v-model="form.pack" :disabled="!genAdmin" style="width: 40%"/>
                <span style="color: #C0C0C0;margin-left: 10px;">项目包的名称，生成的代码放到哪个包里面</span>
              </el-form-item>
<!--              <el-form-item label="接口类型" prop="apiType">-->
<!--                <el-checkbox-group :disabled="!genAdmin" v-model="apiType" style="width: 40%; display: inline-block">-->
<!--                  <el-checkbox-button v-for="(item, index) in apiTypes" :label="item.type" :key="index">{{ item.name-->
<!--                  }}-->
<!--                  </el-checkbox-button>-->
<!--                </el-checkbox-group>-->
<!--                <span style="color: #C0C0C0;margin-left: 10px;">生成的接口的类型</span>-->
<!--              </el-form-item>-->
              <el-form-item label="功能名称" prop="apiAlias">
                <el-input v-model="form.apiAlias" style="width: 40%"/>
                <span style="color: #C0C0C0;margin-left: 10px;">功能的名称，用于控制器与接口文档中</span>
              </el-form-item>
              <el-form-item label="前端模板" prop="cover">
                <el-select
                  v-model="form.frontTemplate"
                  :disabled="!genFront"
                  style="width: 40%"
                  filterable
                  placeholder="请选择">
                  <el-option label="默认" value="DEFAULT"/>
<!--                  <el-option label="右弹框" value="DRAWER"/>-->
                </el-select>
                <span style="color: #C0C0C0;margin-left: 10px;">请选择前端生成模板</span>
              </el-form-item>
              <el-form-item label="前端路径" prop="path">
                <el-input v-model="form.path" :disabled="!genFront" style="width: 40%"/>
                <span style="color: #C0C0C0;margin-left: 10px;">webapp/WEB-INF/view文件夹下的相对目录，不存在即创建</span>
              </el-form-item>
<!--              <el-form-item label="接口目录">-->
<!--                <el-input v-model="form.apiModule" style="width: 40%" />-->
<!--                <span style="color: #C0C0C0;margin-left: 10px;">Api存放模块，为空则自动生成在src/api/下</span>-->
<!--              </el-form-item>-->
              <el-form-item label="去表前缀" prop="prefix">
                <el-input v-model="form.prefix" placeholder="默认不去除表前缀" style="width: 40%"/>
                <span style="color: #C0C0C0;margin-left: 10px;">默认不去除表前缀，可自定义</span>
              </el-form-item>

              <el-form-item label="是否覆盖" prop="cover">
                <el-radio-group v-model="form.cover" size="mini" style="width: 40%">
                  <el-radio-button label="true">是</el-radio-button>
                  <el-radio-button label="false">否</el-radio-button>
                </el-radio-group>
                <span style="color: #C0C0C0;margin-left: 10px;">谨防误操作，请慎重选择</span>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </Drawer>
</template>

<script>
import crud from '@/mixins/crud'
import { update, get } from '@/api/generator/genConfig'
import { save, sync, generator } from '@/api/generator/generator'

export default {
  name: 'GeneratorConfig',
  components: {},
  mixins: [crud],
  data() {
    return {
      drawer: false,
      remark: '',
      lovs: [],
      activeName: 'first',
      tableName: '',
      tableHeight: 550,
      columnLoading: false,
      configLoading: false,
      dicts: [],
      syncLoading: false,
      genLoading: false,
      form: {
        id: null,
        tableName: '',
        section: 'BOTH',
        pack: '',
        path: '',
        moduleName: '',
        cover: 'false',
        apiPath: '',
        prefix: '',
        apiModule: '',
        apiAlias: null,
        apiType: ''
      },
      rulesBOTH: {
        author: [
          { required: true, message: '作者不能为空', trigger: ['blur', 'change'] }
        ],
        pack: [
          { required: true, message: '包路径不能为空', trigger: ['blur', 'change'] }
        ],
        moduleName: [
          { required: true, message: '包路径不能为空', trigger: ['blur', 'change'] }
        ],
        path: [
          { required: true, message: '前端路径不能为空', trigger: ['blur', 'change'] }
        ],
        apiAlias: [
          { required: true, message: '接口名称不能为空', trigger: ['blur', 'change'] }
        ]
      },
      rulesFRONT: {
        apiAlias: [
          { required: true, message: '接口名称不能为空', trigger: ['blur', 'change'] }
        ],
        author: [
          { required: true, message: '作者不能为空', trigger: ['blur', 'change'] }
        ],
        path: [
          { required: true, message: '前端路径不能为空', trigger: ['blur', 'change'] }
        ]
      },
      rulesADMIN: {
        author: [
          { required: true, message: '作者不能为空', trigger: ['blur', 'change'] }
        ],
        pack: [
          { required: true, message: '包路径不能为空', trigger: ['blur', 'change'] }
        ],
        moduleName: [
          { required: true, message: '包路径不能为空', trigger: ['blur', 'change'] }
        ],
        apiAlias: [
          { required: true, message: '接口名称不能为空', trigger: ['blur', 'change'] }
        ]
      },
      apiTypes: [
        { name: '增', type: 'ADD' },
        { name: '删', type: 'DEL' },
        { name: '改', type: 'PUT' },
        { name: '查', type: 'GET' },
        { name: 'EXCEL', type: 'EXCEL' }
      ]
    }
  },
  computed: {
    genFront() {
      return this.form.section === 'BOTH' || this.form.section === 'FRONT'
    },
    genAdmin() {
      return this.form.section === 'BOTH' || this.form.section === 'ADMIN'
    },
    rule() {
      return this['rules' + this.form.section]
    },
    apiType: {
      get() {
        const type = this.form.apiType
        if (type && type.length > 0) {
          return type.split(',')
        }
        return []
      },
      set(val) {
        this.form.apiType = val.join(',')
      }
    }
  },
  created() {
    this.tableHeight = document.documentElement.clientHeight - 385
  },
  methods: {
    initData(data) {
      this.paramsData = { ...data }
    },
    pageInit() {
      const data = this.paramsData
      this.tableName = data.tableName
      this.remark = data.remark
      this.$nextTick(() => {
        this.init()
        get(this.tableName).then(data => {
          this.form = data
          this.form.cover = this.form.cover.toString()
        })
      })
    },
    beforeInit() {
      this.url = 'api/generator/columns'
      const tableName = this.tableName
      this.params = { tableName }
      return true
    },
    saveColumnConfig() {
      this.columnLoading = true
      save(this.data).then(res => {
        this.Notify('保存成功', 'success')
        this.columnLoading = false
      }).catch(err => {
        this.columnLoading = false
      })
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.configLoading = true
          update(this.form).then(res => {
            this.Notify('保存成功', 'success')
            this.form = res
            this.form.cover = this.form.cover.toString()
            this.configLoading = false
          }).catch(err => {
            this.configLoading = false
          })
        }
      })
    },
    sync() {
      this.syncLoading = true
      sync([this.tableName]).then(() => {
        this.init()
        this.Notify('同步成功', 'success')
        this.syncLoading = false
      }).then(() => {
        this.syncLoading = false
      })
    },
    toGen() {
      this.genLoading = true
      save(this.data).then(res => {
        this.Notify('保存成功', 'success')
        // 生成代码
        generator(this.tableName, 0).then(data => {
          this.genLoading = false
          this.Notify('生成成功', 'success')
        }).catch(err => {
          this.genLoading = false
        })
      }).catch(err => {
        this.genLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .edit-input {
    .el-input__inner {
      border: 1px solid #e5e6e7;
    }
  }
</style>

<style scoped>
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
