<template>
  <el-color-picker v-model="themeVal" size="small" class="theme-picker" popper-class="theme-picker-dropdown" />
</template>

<script>
import theme from '@/mixins/theme'

export default {
  name: 'TopTheme',
  mixins: [theme()],
  data () {
    return {
      chalk: ''
    }
  }
}
</script>

<style>
.theme-picker .el-color-picker__trigger {
  vertical-align: middle;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
