import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BulmaTesting from '../views/BulmaTesting.vue'
import Form from '@/views/AddLand.vue'
import Simmulate from '@/views/Simmulate.vue'
import { store } from '@/store'
import AddCitizen from '@/views/AddCitizen.vue'
import Search from '@/views/Search.vue'
import NotFound from '@/views/NotFound.vue'
import DisplayPeople from '@/views/data_list/DisplayPeople.vue'
import TestFromValid from '@/views/TestFromValid.vue'
import Login from '@/views/Login.vue'

import { useUserStore } from '@/stores/useUserStore'
import AdminPage from '@/views/AdminPage.vue'

import roles from '@/role_config'
import TableDash from '@/views/dashboard/TableDash.vue'
import PersonDetail from '@/views/data_list/PersonDetail.vue'
import LandTitleFile from '@/views/uploadFile/LandTitleFile.vue'
import ShowAllFiles from '@/views/uploadFile/ShowAllFiles.vue'
import MainDash from '@/views/dashboard/MainDash.vue'
import AddHeir from '@/views/AddHeir.vue'
import HistoryLand from '@/views/HistoryLand.vue'
import TestAddCitizen from '@/views/TestAddCitizen.vue'
import ConnectRelation from '@/views/ConnectRelation.vue'
import TestRole from '@/views/TestRole.vue'
import CitizenEdit from '@/views/data_edit/CitizenEdit.vue'
import ManageDefaultData from '@/views/ManageDefaultData.vue'

// URL
import { url_citizen, url_land, URL_LAND, url_connect_relation, url_heir } from './url_list'
import axios from 'axios'

import CitizenDisplay from '@/views/data_list/CitizenDisplay.vue'
import ManageFileType from '@/components/manage_default_data/ManageFileType.vue'
import ManageStatus from '@/components/manage_default_data/ManageStatus.vue'
import ManageRelation from '@/components/manage_default_data/ManageRelation.vue'
import ManageRole from '@/components/manage_default_data/ManageRole.vue'
import ManageLandUsage from '@/components/manage_default_data/ManageLandUsage.vue'

// history: createWebHistory(import.meta.env.BASE_URL),
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/Test-People',
      name: 'Test-People',
      component: TestAddCitizen
    },
    {
      path: '/Test-Role',
      name: 'TestRole',
      component: TestRole
    },
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
      path: '/dashboard',
      name: 'dashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/BulmaTesting.vue')
      component: MainDash,
      meta: {
        title: 'Dashboard'
      }
    },
    {
      path: url_land,
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
      path: url_citizen,
      name: 'fillPeople',
      component: AddCitizen,
      meta: {
        // requiredRole: roles[3].role_id,
        title: 'Admin | add heir'
      }
    },
    {
      path: url_heir,
      name: 'fillHeir',
      component: AddHeir,
      meta: {
        // requiredRole: roles[3].role_id,
        title: 'Admin | add heir'
      }
    },
    {
      path: '/connect_relation',
      name: 'ConnectHeirRelation',
      component: ConnectRelation
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/history_land',
      name: 'HistoryLand',
      component: HistoryLand,
      meta: {
        requiredRole: roles[3].role_id,
        title: 'Admin | ประวัติการแก้ไขที่ดิน'
      }
    },
    {
      path: '/land_data',
      redirect: '/land_data/10/1',
      meta: {
        requiredRole: roles[3].role_id,
        title: 'Admin | '
      }
    },
    {
      path: '/citizen_data',
      redirect: '/citizen_data/10/1',
      meta: {
        requiredRole: roles[3].role_id,
        title: 'Admin | '
      }
    },
    // CitizenDisplay
    {
      path: '/citizen_data/:limit(10|20|50)/:page',
      name: 'CitizenDisplay',
      component: CitizenDisplay,
      props: true
    },
    {
      path: '/land_data/:limit(10|20|50)/:page',
      name: 'DisplayPeople',
      component: DisplayPeople,
      props: true
      // beforeEnter: (to, from, next) => {
      //   const validAmounts = ['10', '20', '50'] // เฉพาะค่าที่อนุญาต
      //   if (!validAmounts.includes(to.params.amount)) {
      //     next('/land_data') // ถ้าไม่ใช่ 10, 20, 50 ให้กลับไปที่ /land_data
      //   } else {
      //     next() // ผ่าน
      //   }
      // }
    },
    {
      path: '/complete_view/:id', // Child route for detail view
      name: 'PersonDetail',
      component: PersonDetail,
      meta: {
        requiredRole: roles[3].role_id,
        title: 'Admin | '
      }
    },
    {
      path: '/complete_view/edit/:id', // Edit details
      name: 'CitizenEdit',
      component: CitizenEdit, // Create this component
      meta: {
        requiredRole: roles[3].role_id,
        title: 'Admin | Edit'
      }
    },
    {
      path: '/land_data/upload_files/:id', // Child route for detail view
      name: 'LandTitle',
      component: LandTitleFile,
      meta: {
        requiredRole: roles[3].role_id,
        title: 'Admin | '
      }
    },
    {
      path: '/manage_default_Information', // Parent route
      name: 'ManageDefaultData', // You can keep this name if needed, but it's not necessary for child routing
      component: ManageDefaultData,
      meta: {
        requiredRole: roles[3].role_id,
        name: 'ManageDefaultData',
        title: 'Admin | '
      },
      children: [
        {
          path: '', // Default child route
          name: 'ManageDefaultDataDefault', // Name the default child route
          redirect: '/manage_default_Information/manage_status' // Redirect to default child route
        },
        {
          path: 'manage_status', // Child route for managing status
          name: 'ManageStatus',
          component: ManageStatus
        },
        {
          path: 'manage_file_type', // Child route for managing file types
          name: 'ManageFileType',
          component: ManageFileType
        },
        {
          path: 'manage_relation', // Child route for managing file types
          name: 'ManageRelation',
          component: ManageRelation
        },
        {
          path: 'manage_land_usage', // Child route for managing file types
          name: 'ManageLandUsage',
          component: ManageLandUsage
        }
      ]
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
      component: TableDash,
      meta: {
        requiredRole: roles[3].role_id,
        title: 'Admin | Home'
      }
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
        requiredRole: roles[3].role_id,
        title: 'Admin | Home'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
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
      window.scrollTo(0, 0)
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
        window.scrollTo(0, 0)
        return next()
      }
    }
    document.title = to.meta.title
  } else {
    document.title = 'default title' // default title
  }
  window.scrollTo(0, 0)
  next() // Call next() to proceed to the route
})

export default router
