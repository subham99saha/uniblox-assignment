import Home from './modules/Home'
import Admin from './modules/Admin'

const routes = [
    {
      path: '/',
      component: Home,
      exact: true,
    },
    {
      path: '/admin',
      component: Admin,
    }
  ];
  
  export default routes;
  