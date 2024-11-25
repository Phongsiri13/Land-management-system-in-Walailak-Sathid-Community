import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BulmaTesting from '../views/BulmaTesting.vue'
import Form from '@/views/Form.vue'
import Simmulate from '@/views/Simmulate.vue'
import { store } from '@/store'
import AddPeople from '@/views/AddPeople.vue'
import Search from '@/views/Search.vue'
import NotFound from '@/views/NotFound.vue'
import DisplayPeople from '@/views/DisplayPeople.vue'
import TestFromValid from '@/views/TestFromValid.vue'
import Login from '@/views/Login.vue'

import { useUserStore } from '@/stores/useUserStore'
import AdminPage from '@/views/AdminPage.vue'

import roles from '@/role_config'
import TableDash from '@/views/dashboard/TableDash.vue'
import PersonDetail from '@/views/data_list/PersonDetail.vue'
import LandTitleFile from '@/views/uploadFile/LandTitleFile.vue'
import ShowAllFiles from '@/views/uploadFile/ShowAllFiles.vue'

// history: createWebHistory(import.meta.env.BASE_URL),
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/test/bulma',
      name: 'bulmatest',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/BulmaTesting.vue')
      component: BulmaTesting
    },
    {
      path: '/create_land',
      name: 'filldata',
      component: Form
    },
    {
      path: '/show_files',
      name: 'showfileAall',
      component: ShowAllFiles
    },
    {
      path: '/upload_files',
      name: 'simmulateFilldata',
      component: Simmulate
    },
    {
      path: '/create_people',
      name: 'fillPeople',
      component: AddPeople
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/people_data',
      name: 'DisplayPeople',
      component: DisplayPeople,
      children: [
        // {
        //   path: 'detail/:id', // Child route for detail view
        //   name: 'PersonDetail',
        //   component: PersonDetail
        // },
        // {
        //   path: 'edit/:id', // Child route for edit view
        //   name: 'PeopleEdit',
        //   component: DisplayPeople
        // }
      ],
      meta: {
        requiredRole: roles[2].role_id,
        title: 'Admin | create-people'
      }
    },
    {
      path: '/people_data/detail/:id', // Child route for detail view
      name: 'PersonDetail',
      component: PersonDetail,
      meta: {
        requiredRole: roles[2].role_id,
        title: 'Admin | '
      }
    },
    {
      path: '/people_data/upload_files/:id', // Child route for detail view
      name: 'LandTitle',
      component: LandTitleFile,
      meta: {
        requiredRole: roles[2].role_id,
        title: 'Admin | '
      }
    },
    {
      path: '/uq',
      name: 'UserSearch',
      component: HomeView,
      meta: {
        title: 'User | Search'
      }
    },
    {
      path: '/test_valid',
      name: 'Valid',
      component: TestFromValid
    },
    {
      path: '/table_dashboard',
      name: 'TableDashboard',
      component: TableDash
    },
    {
      path: '/login',
      name: 'Login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/BulmaTesting.vue')
      component: Login
    },
    {
      path: '/admin',
      name: 'AdminPage',
      component: AdminPage,
      meta: {
        requiredRole: roles[2].role_id,
        title: 'Admin | Home'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
})
let t1 = 0
// Global before route guard
router.beforeEach(async (to, from, next) => {
  store.status_path_change = true
  const userStore = useUserStore()
  console.log('router guard is working')

  t1++
  // To check there are role or not?
  if (to.meta.requiredRole) {
    // Await the result of fetching the user's role
    await userStore.fetchUserRole()
    // ตรวจสอบ role ของผู้ใช้ก่อนเข้าถึงแต่ละหน้า
    if (to.meta.requiredRole && to.meta.requiredRole !== userStore.userRole) {
      // alert('Access Denied')
      store.status_path_change = false
      const pathWithoutSlash = to.path.substring(1) // remove / symbol
      window.scrollTo(0, 0);
      return next({ name: 'NotFound', params: { pathMatch: pathWithoutSlash } }) // หาก role ไม่ตรง ให้ไปที่หน้า 404
    }
  } else {
    if (t1 == 1) {
      await userStore.fetchUserRole()
    }
  }
  console.log('t1:', t1)

  store.status_path_change = false
  if (to.meta.title) {
    // Check if the route has a dynamic :id in its path
    if (to.params.id) {
      // Check if the route name contains 'detail', which typically indicates a page with an ID
      if ((to.name && to.name.includes('Detail')) || (to.name && to.name.includes('LandTitle'))) {
        // Dynamically change the title using the :id parameter
        document.title = `Admin | ${to.params.id}`
        window.scrollTo(0, 0);
        return next()
      }
    }
    document.title = to.meta.title
  } else {
    document.title = 'default title' // default title
  }
  window.scrollTo(0, 0);
  next() // Call next() to proceed to the route
})

export default router
