<template>
  <div :style="{'height': height}" class="my-mission-card">
    <card-title :title-style="titleStyle" :title-name="number"/>
    <el-row class="card-content">
      <slot>
        <el-col :span="12" class="card-content-img-wrapper">
          <div class="icon-wrapper">
            <img src="@/assets/chartIcon/myMissionIcon1.png">
          </div>
        </el-col>
        <el-col :span="12" class="card-content-amount-wrapper">
          <div class="amount-wrapper">
            <h1>{{ titleName }}</h1>
            <div class="arrange-imm" @click="toLink">{{ linkName }}</div>
          </div>
        </el-col>
      </slot>
    </el-row>
  </div>
</template>
<script>
import CardTitle from './CardTitle.vue'

export default {
  components: {
    CardTitle
  },
  props: {
    titleStyle: {
      type: Object,
      required: false,
      default: null
    },
    height: {
      type: String,
      default: '100px'
    },
    titleName: {
      type: String,
      required: true
    },
    linkName: {
      type: String,
      required: false,
      default: '查看更多'
    },
    number: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {}
  },
  mounted() {

  },
  methods: {
    toLink() {
      this.$emit('link')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  $box-shadow: 0 7px 4px 0 #e5e5ea;
  .my-mission-card {
    background-color: #fff;
    overflow: hidden;
    position: relative;
    border-right: 1px solid #eee;

    .card-content {
      width: 100%;
      background: #fff;
      padding: 15px;

      .card-content-img-wrapper {
        height: 100%;
        display: flex;
        align-items: center;

        .icon-wrapper {
          width: 100px;
          margin: 0 auto;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }

      .card-content-amount-wrapper {
        height: 100%;
        display: flex;
        align-items: center;

        .amount-wrapper {
          margin: auto;
          text-align: right;

          h1 {
            color: #5B8FF9;
            font-size: 32px;
            margin: 0 1px 10px 0;
          }

          .amount-title {
            display: table-footer-group;
            color: #9B9B9B;
            font-size: 15px;
          }

          .arrange-imm {
            border: 1px solid #D9E7FF;
            border-radius: 8px;
            color: #2a5fcf;
            padding: 10px;
            cursor: pointer;
            font-size: 15px;

            &:hover {
              border: 1px solid #2a5fcf;
            }
          }
        }
      }
    }
  }
</style>
