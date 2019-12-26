<template>
  <div class="menu-wrapper">
    <template v-for="(item,index) in menu">
      <el-menu-item v-if="item.children.length===0 " :key="item.label" :index="filterPath(item.path,index)" @click="open(item)">
        <i :class="item.icon" />
        <!-- <svg-icon icon-class="item.icon" /> -->
        <span slot="title">{{ item.label }}</span>
      </el-menu-item>
      <el-submenu v-else :key="item.label" :index="filterPath(item.label,index)">
        <template slot="title">
          <i :class="item.icon" />
          <!-- <svg-icon :icon-class="item.icon" /> -->
          <span slot="title" :class="{'el-menu--display':isCollapse}">{{ item.label }}</span>
        </template>
        <template v-for="(child,cindex) in item.children">
          <el-menu-item v-if="child.children.length==0" :key="cindex" :index="filterPath(child.path,cindex)" @click="open(child)">
            <i :class="child.icon" />
            <!-- <svg-icon :icon-class="child.icon" /> -->
            <span slot="title">{{ child.label }}</span>
          </el-menu-item>
          <sidebar-item v-else :key="cindex" :menu="[child]" :is-collapse="isCollapse" />
        </template>
      </el-submenu>
    </template>
  </div>
</template>
<script>
import { resolveUrlPath } from '@/util/util'
export default {
  name: 'SidebarItem',
  props: {
    menu: {
      type: Array,
      default: () => []
    },
    isCollapse: {
      type: Boolean
    }
  },
  data () {
    return {}
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    filterPath (path, index) {
      return path == null ? index + '' : path
    },
    open (item) {
      this.$router.push({
        path: resolveUrlPath(item.path, item.label),
        query: item.query
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

