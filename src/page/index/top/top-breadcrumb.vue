<template>
  <el-breadcrumb separator="/" class="tags-breadcrumb-list">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <!-- <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a> -->
        <a v-else @click.prevent="">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
<script>
import { mapGetters } from 'vuex'
// import pathToRegexp from 'path-to-regexp'
export default {
  name: 'Breadcrumb',
  data () {
    return {
      levelList: []
    }
  },
  computed: {
    ...mapGetters(['tagCurrent'])
  },
  watch: {
    $route (route) {
      this.getBreadcrumb()
    }
  },
  created () {
    this.getBreadcrumb()
  },
  mounted () {},
  methods: {
    getBreadcrumb () {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]
      if (!this.isDashboard(first)) {
        matched = [{ path: '/wel', meta: { title: '主页' }}].concat(matched)
      }
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard (route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === '主页'.toLocaleLowerCase()
    }
    // pathCompile (path) {
    //   // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
    //   const { params } = this.$route
    //   var toPath = pathToRegexp.compile(path)
    //   return toPath(params)
    // },
    // handleLink (item) {
    //   const { redirect, path } = item
    //   if (redirect) {
    //     this.$router.push(redirect)
    //     return
    //   }
    //   this.$router.push(this.pathCompile(path))
    // }
  }
}
</script>
<style lang="scss" scoped>

</style>

