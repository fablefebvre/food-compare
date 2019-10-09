import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home'
import Categories from '@/views/Categories'
import BarCode from '@/views/BarCode'

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
