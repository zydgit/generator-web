<template>
  <div class="upload-wrapper">
    <div v-if="showTitle">
      <div :style="titleStyle" class="upload-title-overflow-hidden">

        <!--  名称插槽-->
        <slot name="upload-title">
          附件
        </slot>

      </div>
    </div>
    <el-upload
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :on-success="handleSuccess"
      :on-error="handleError"
      :headers="headers"
      :data="sourceParams"
      :auto-upload="true"
      :file-list="fileList"
      :multiple="multiple"
      :disabled="disable"
      :show-file-list="showFileList"
      :action="sysFileUploadApi">

      <div v-if="isShowButton" slot="trigger" style="display: inline-block">

        <!--  按钮插槽-->

        <el-tooltip class="item" effect="dark" content="附件上传" placement="top">

          <slot name="upload-button">
            <span class="upload-button-wrapper">
              <i class="el-icon-upload icon-upload"/>
            </span>
          </slot>

        </el-tooltip>

      </div>

      <div slot="tip" class="el-upload__tip">

        <!--  提示插槽-->
        <slot name="tip"/>

      </div>
    </el-upload>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { getFileListBySkAndSt, removeByFileId } from '@/api/system/attachCategory'
import { download } from '@/api/system/data'
import { downloadFile } from '@/utils'

export default {
  props: {
    // 是否可选中多个文件
    multiple: {
      type: Boolean,
      default: true
    },
    // 是否禁用
    disable: {
      type: Boolean,
      default: false
    },
    // 是否显示标题
    showTitle: {
      type: Boolean,
      default: true
    },
    // 是否显示文件列表
    showFileList: {
      type: Boolean,
      default: true
    },
    // sourceKey， sourceType 参数
    sourceParams: {
      type: Object,
      required: true
    },
    titleStyle: {
      type: String,
      default: ''
    },
    isShowButton: {
      type: Boolean,
      default: true
    },
    customUrl: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  computed: {
    ...mapGetters([
      'sysFileUploadApi'
    ]),
    'headers': () => {
      return {
        'Authorization': 'Bearer ' + getToken()
      }
    },
    action() {
      return this.customUrl || this.sysFileUploadApi
    }
  },
  created() {
    this.$emit('initData')
  },
  methods: {
    reset() {
      this.fileList = []
    },
    initData() {
      getFileListBySkAndSt(this.sourceParams).then(res => {
        const fileList = []
        res.content.forEach(item => {
          const obj = {}
          obj.name = item.fileName
          obj.fileId = item.fileId
          fileList.push(obj)
        })
        this.fileList = fileList
      })
    },
    handleRemove(file) {
      const fileId = file.fileId || file.response[0].fileId
      removeByFileId(fileId).then(res => {
        this.fileList = this.fileList.filter(item => item.uid !== file.uid)
        this.$message({
          type: 'success',
          message: '删除成功'
        })

        this.$emit('removeSuccess')
      }).catch(() => {
        this.fileList.push(file)
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      })
    },
    handlePreview(file) {
      const fileId = file.fileId || file.response[0].fileId
      download('api/attachment/file/download', { fileId }).then(res => {
        downloadFile(res, file.name)
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '下载失败'
        })
      })
    },
    handleSuccess(res, file, fileList) {
      this.fileList = fileList
      this.$message({
        type: 'success',
        message: '上传成功'
      })
      this.$emit('uploadSuccess')
    },
    handleError(err) {
      try {
        const message = JSON.parse(err.message)
        this.$message({
          type: 'error',
          message: message.message
        })
      } catch (e) {
        this.$message({
          type: 'error',
          message: '上传失败'
        })
      }
    }
  }
}

</script>

<style lang="scss">

  /** 默认样式修改  */

  upload-wrapper * {
    outline: none !important;
    user-select: none;
  }

  .upload-wrapper {
    .el-upload {
      position: absolute;
      right: 0;
      top: 0;
    }

    .el-upload-list {
      display: flex;
      flex-wrap: wrap;
      margin-top: -4px;
    }

    .el-upload-list__item {
      width: unset !important;
      margin-top: 10px !important;
      margin-right: 10px;
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.04);
    }

    .el-upload-list__item:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    .el-upload-list__item .el-icon-close {
      top: 50%;
      transform: translateY(-50%);
    }

    .el-upload-list__item-name {
      margin-right: 35px;
    }

    .el-icon-close-tip {
      display: none !important;
    }
  }
</style>

<style lang="scss" scoped>
  .upload-wrapper {
    width: 100%;
    position: relative;
    min-width: 100px;
  }

  /*.upload-top {*/
  /*  display: flex;*/
  /*  flex-wrap: nowrap;*/
  /*  justify-content: flex-end;*/
  /*  align-items: center;*/
  /*}*/

  .upload-button-wrapper {
    padding: 3px 5px;
    position: relative;
    display: inline-block;
    border-radius: 0.02rem;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    border: none;
    cursor: pointer;
    user-select: none;
    text-decoration: none;
    border-radius: 2px
  }

  .upload-button-wrapper
  span {
    color: #1890ff;
  }

  .upload-button-wrapper:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  .upload-button-wrapper span {
    font-size: 1.1em;
  }

  .icon-upload {
    font-size: 20px;
  }

</style>
