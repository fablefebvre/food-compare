import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Categories from '@/components/categories'
import BarCode from '@/components/bar-code'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: Home
    },
    {
      path: '/barcode',
      name: 'BarCode',
      component: BarCode
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories
    }
  ]
})
