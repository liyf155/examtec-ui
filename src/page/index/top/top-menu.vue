<template>
  <div class="pull-auto top-menu">
    <el-menu :default-active="activeIndex" mode="horizontal">
      <template v-for="(item,index) in items">
        <el-menu-item :key="index" :index="item.parentId+''" @click.native="openMenu(item)">
          {{ item.label }}
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { resolveUrlPath } from '@/util/util'
import { mapGetters } from 'vuex'
export default {
  name: 'TopMenu',
  data () {
    return {
      activeIndex: '0',
      items: [
        {
          label: '首页',
          href: '/wel/index',
          parentId: 0
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['tagCurrent', 'menu'])
  },
  created () {},
  methods: {
    openMenu (item) {
      this.$store.dispatch('GetMenu', item.parentId).then(data => {
        let itemActive
        const childItemActive = 0
        if (item.href) {
          itemActive = item
        } else {
          if (this.menu[childItemActive].length === 0) {
            itemActive = this.menu[childItemActive]
          } else {
            itemActive = this.menu[childItemActive].children[childItemActive]
          }
        }
        this.$router.push({
          path: resolveUrlPath(itemActive.href, itemActive.label)
        })
      })
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
.top-menu {
  margin-top: -4px;
  box-sizing: border-box;
}
</style>
