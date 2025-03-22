import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Form from '@/views/AddLand.vue'
import { store } from '@/store'
import AddCitizen from '@/views/AddCitizen.vue'
import Search from '@/views/Search.vue'
import NotFound from '@/views/NotFound.vue'
import DisplayPeople from '@/views/data_list/DisplayPeople.vue'
import Login from '@/views/Login.vue'

import { useUserStore } from '@/stores/useUserStore'
import AdminPage from '@/views/AdminPage.vue'

import roles from '@/role_config'
import TableDash from '@/views/dashboard/TableDash.vue'
import PersonDetail from '@/views/data_list/PersonDetail.vue'
import CitizenDetail from '@/views/data_list/CitizenDetail.vue'
import HeirDetail from '@/views/data_list/HeirDetail.vue'
import LandLiveDocument from '@/views/uploadFile/LandLiveDocument.vue'
import MainDash from '@/views/dashboard/MainDash.vue'
import AddHeir from '@/views/AddHeir.vue'
import HistoryLand from '@/views/HistoryLand.vue'
import ConnectRelation from '@/views/ConnectRelation.vue'
import CitizenEdit from '@/views/data_edit/CitizenEdit.vue'
import ManageDefaultData from '@/views/ManageDefaultData.vue'
import HeirDisplay from '@/views/data_list/HeirDisplay.vue'
import LandFile from '@/views/uploadFile/LandFile.vue'
import CitizenFiles from '@/views/uploadFile/CitizenFiles.vue'
import CitizenDash from '@/views/dashboard/CitizenDash.vue'

// URL
import { url_citizen, url_land, url_heir } from './url_list'

import CitizenDisplay from '@/views/data_list/CitizenDisplay.vue'

// Handle Roles
import ManageLandUsage from '@/components/manage_default_data/ManageLandUsage.vue'
import ManageStatus from '@/components/manage_default_data/ManageStatus.vue'
import ManageRelation from '@/components/manage_default_data/ManageRelation.vue'
import ManageRole from '@/components/manage_default_data/ManageRole.vue'

import LandEdit from '@/views/data_edit/LandEdit.vue'
import HeirEdit from '@/views/data_edit/HeirEdit.vue'
import HistoryCitizen from '@/views/HistoryCitizen.vue'

const officer = roles[3]
const Land_reform_officer = roles[1]
const admin = roles[0]

// history: createWebHistory(import.meta.env.BASE_URL),
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'หน้าหลัก'
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: MainDash,
      meta: {
        title: 'Dashboard'
      }
    },
    {
      path: url_land,
      name: 'filldata',
      component: Form,
      meta: {
        requiredRole: officer.role_id,
        title: 'เพิ่มข้อมูลที่ดิน'
      }
    },
    {
      path: url_citizen,
      name: 'fillPeople',
      component: AddCitizen,
      meta: {
        requiredRole: officer.role_id,
        title: 'เพิ่มข้อมูลราษฎร'
      }
    },
    {
      path: url_heir,
      name: 'fillHeir',
      component: AddHeir,
      meta: {
        requiredRole: officer.role_id,
        title: 'เพิ่มทายาท'
      }
    },
    {
      path: '/connect_relation',
      name: 'ConnectHeirRelation',
      component: ConnectRelation,
      meta: {
        requiredRole: officer.role_id,
        title: 'เชื่อมต่อความสัมพันธ์'
      },
      beforeEnter(to, from, next) {
        // ตรวจสอบ query parameters
        const { firstName, lastName } = to.query

        if (!firstName || !lastName) {
          // ถ้าไม่มี firstName หรือ lastName ให้ redirect ไปที่หน้าอื่น
          next({ path: '/error', query: { message: 'firstName and lastName are required' } })
        } else {
          // ถ้ามี query parameters ที่ถูกต้อง ให้ไปหน้าต่อไป
          next()
        }
      }
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/history_citizen',
      redirect: '/history_citizen/50/1'
    },
    {
      path: '/history_citizen/:limit(50)/:page',
      name: 'HistoryCitizen',
      component: HistoryCitizen,
      props: true,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'รายละเอียดราษฎรทั้งหมด'
      }
    },
    {
      path: '/land_data',
      redirect: '/land_data/10/1'
    },
    {
      path: '/citizen_data',
      redirect: '/citizen_data/10/1'
    },
    {
      path: '/citizen_data/:limit(10|20|50)/:page',
      name: 'CitizenDisplay',
      component: CitizenDisplay,
      props: true,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'รายละเอียดราษฎรทั้งหมด'
      }
    },
    {
      path: '/land_data/:limit(10|20|50)/:page',
      name: 'DisplayPeople',
      component: DisplayPeople,
      props: true,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'รายละเอียดข้อมูลที่ดินทั้งหมด'
      }
    },
    {
      path: '/history_land',
      name: 'HistoryLand',
      component: HistoryLand,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'Admin | ประวัติการแก้ไขที่ดิน'
      }
    },
    {
      path: '/history_land',
      redirect: '/history_land/50/1'
    },
    {
      path: '/history_land/:limit(50)/:page',
      name: 'HistoryLand',
      component: HistoryLand,
      props: true,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'ประวัติการแก้ไขข้อมูลที่ดิน'
      }
    },
    {
      path: '/heir_data',
      redirect: '/heir_data/50/1',
      component: HeirDisplay
    },
    {
      path: '/heir_data/:limit(50)/:page',
      name: 'HeirDisplay',
      component: HeirDisplay,
      props: true,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'รายละเอียดทายาททั้งหมด'
      }
    },
    {
      path: '/complete_view/:id', // Child route for detail view
      name: 'PersonDetail',
      component: PersonDetail,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'รายละเอียด'
      }
    },
    {
      path: '/heir_view/:id', // Child route for detail view
      name: 'HeirDetail',
      component: HeirDetail,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'รายละเอียดทายาท'
      }
    },
    {
      path: '/citizen_view/:id', // Child route for detail view
      name: 'CitizenDetail',
      component: CitizenDetail,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'รายละเอียดราษฎร'
      }
    },
    {
      path: '/land_view/:id', // Child route for detail view
      name: 'LandEdit',
      component: LandEdit,
      meta: {
        requiredRole: officer.role_id,
        title: 'แก้ไขที่ดิน'
      }
    },
    {
      path: '/complete_view/edit/:id', // Edit details
      name: 'CitizenEdit',
      component: CitizenEdit, // Create this component
      meta: {
        requiredRole: officer.role_id,
        title: 'แก้ไขที่ดิน'
      }
    },
    {
      path: '/heir/edit/:id', // Edit details
      name: 'HeirEdit',
      component: HeirEdit, // Create this component
      meta: {
        requiredRole: officer.role_id,
        title: 'แก้ไขทายาท'
      }
    },
    {
      path: '/land_data/upload_live_files/:id', // Child route for detail view
      name: 'LandLiveDocument',
      component: LandLiveDocument,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'หน้าไฟล์ภาพที่อยู่อาศัย'
      }
    },
    {
      path: '/land_data/upload_files/:id', // Child route for detail view
      name: 'LandFile',
      component: LandFile,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'หน้าไฟล์ที่ดิน'
      }
    },
    {
      path: '/citizen/files/:id', // Child route for detail view
      name: 'CitizenFiles',
      component: CitizenFiles,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'ไฟล์ราษฎร'
      }
    },
    {
      path: '/manage_default_Information', // Parent route
      name: 'ManageDefaultData', // You can keep this name if needed, but it's not necessary for child routing
      component: ManageDefaultData,
      meta: {
        requiredRole: officer.role_id,
        name: 'ManageDefaultData',
        title: 'จัดการสถานะที่ดิน | ข้อมูลพื้นฐาน'
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
          path: 'manage_land_usages', // Child route for managing file types
          name: 'ManageLandUsage',
          component: ManageLandUsage,
          meta: {
            title: 'จัดการการใช้ประโยชน์ที่ดิน | ข้อมูลพื้นฐาน'
          }
        },
        {
          path: 'manage_relation', // Child route for managing file types
          name: 'ManageRelation',
          component: ManageRelation,
          meta: {
            title: 'จัดการความสัมพันธ์ | ข้อมูลพื้นฐาน'
          }
        }
      ]
    },
    {
      path: '/manage_role',
      name: 'ManageRole',
      component: ManageRole,
      meta: {
        requiredRole: roles[0].role_id,
        name: 'ManageDefaultData',
        title: 'ข้อมูลพื้นฐาน | จัดการสิทธิ์ของผู้ใช้'
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
      path: '/table_dashboard',
      name: 'TableDashboard',
      component: TableDash,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'สรุปผลการจัดสรรที่ดิน'
      }
    },
    {
      path: '/citizen_dashboard',
      name: 'CitizenDash',
      component: CitizenDash,
      meta: {
        requiredRole: [officer.role_id, Land_reform_officer.role_id],
        title: 'สรุปผลราษฎรในพื้นที่'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/user_report',
      name: 'AdminPage',
      component: AdminPage,
      meta: {
        requiredRole: admin.role_id,
        title: 'จัดการบัญชีผู้ใช้'
      }
    },
    // not found pages
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

// HomeView
// Guard router
router.beforeEach(async (to, from, next) => {
  store.status_path_change = true // ตั้งค่า status_path_change เป็น true
  const userStore = useUserStore()
  // ฟังก์ชันตรวจสอบคุกกี้
  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  // ตรวจสอบคุกกี้ `token`
  const token = getCookie('token')
  console.log('token:', token)
  console.log('router guard is working')

  if (!token) {
    console.log('Notoken:', token)
    userStore.setUserRole(null)
  }else{
    await userStore.fetchUserRole()
  }

  // ตรวจสอบสิทธิ์การเข้าถึง
  if (to.meta.requiredRole) {
    await userStore.fetchUserRole()
    if (!Array.isArray(to.meta.requiredRole)) {
      to.meta.requiredRole = [to.meta.requiredRole] // แปลงเป็น array
    }

    if (!to.meta.requiredRole.includes(userStore.userRole)) {
      console.log('Access Denied:', userStore.userRole)
      store.status_path_change = false // ตั้งค่า status_path_change เป็น false
      return next({ name: 'NotFound' }) // ไปหน้า 404
    }
  }

  // ตั้งค่า title
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'default title'
  }

  // เลื่อนหน้าเว็บไปด้านบน
  window.scrollTo(0, 0)

  store.status_path_change = false // ตั้งค่า status_path_change เป็น false
  next()
})

export default router
