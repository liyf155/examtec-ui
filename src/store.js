import Vue from 'vue'
import Vuex from 'vuex'
import user from './store/modules/user'
import common from './store/modules/common'
import tags from './store/modules/tags'
import errLog from './store/modules/errLog'
import getters from './store/getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    common,
    errLog,
    tags
  },
  getters
})

export default store
