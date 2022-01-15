
import HomePage from '../pages/home.f7.html';
import IngredientPage from '../pages/ingredient.f7.html';
import ProductsPage from '../pages/products.f7.html';
import SalesPage from '../pages/sales.f7.html';
import ExpensesPage from '../pages/expenses.f7.html';
import FormPage from '../pages/form.f7.html';
import SettingsPage from '../pages/settings.f7.html';
import ClientsPage from '../pages/customers.f7.html';
//import SyncPage from '../pages/sync.f7.html';
import LoginPage from '../pages/login.f7.html';
import SignupPage from '../pages/signup.f7.html';
import ResetPasswordPage from '../pages/resetpassword.f7.html';
import OrderPage from '../pages/orders.f7.html';

import ReportsRoutePage from '../pages/reports.f7.html';
import RequestAndLoad from '../pages/request-and-load.f7.html';
import NotFoundPage from '../pages/404.f7.html';


async function checkAuth(to, from, resolve, reject) {
  var router = this;
  /*var a = false;
  if(a){
    resolve();
  }else{
    reject();
    router.navigate('/login/');
    return;
  }*/
  var token = localStorage.getItem("FlexBusinessToken");
  
  
  if(token == null){
    console.log("not authenticated");
    reject();
    router.navigate('/login/');
    return;
  }else{
    resolve();
  }

  /*router.app.preloader.show();
  var obj = {};
  $.when(router.app.methods.getDataAPI("user/GetHeartbeat", true)).then(function( data, textStatus, jqXHR ) {
    router.app.preloader.hide();
      console.log("heartbeat data  ", data); // JSON data parsed by `data.json()` call
      
      resolve();
  }).catch((err) => {
      console.error('Error:', error);
      router.app.preloader.hide();
      reject();
      router.navigate('/login/');
      return;
  });*/

  /*await fetch(router.app.data.apiUrl + 'user/Heartbeat', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
      }
    }
  ).then(response => response.json())
  .then(response => {
    router.app.preloader.hide();
    resolve();
  })
  .catch((error) => {
    console.error('Error:', error);
    router.app.preloader.hide();
    reject();
    router.navigate('/login/');
    return;
  });
  /*await Auth.currentAuthenticatedUser({
    bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      //console.log(user);
      //console.log("got data");
      resolve();
    })
    .catch(err => {
      //console.log(err);
      reject();
    router.navigate('/login/');
    return;
    });*/
}

function checkAuthLogin(to, from, resolve, reject) {
  var router = this;
  var token = localStorage.getItem("FlexBusinessToken");
  
  if(token != null){
    reject();
    router.navigate('/products/');
    return;
  }else{
    resolve();
  }
}

var routes = [
  {
    path: '/',
    component: ProductsPage,
    beforeEnter: checkAuth,
  },
  {
    path: '/home/',
    component: HomePage,
    beforeEnter: checkAuth,
  },
  {
    path: '/ingredient/',
    component: IngredientPage,
    beforeEnter: checkAuth,
  },
  {
    path: '/products/',
    component: ProductsPage,
    beforeEnter: checkAuth,
  },
  {
    path: '/sales/',
    component: SalesPage,
    beforeEnter: checkAuth,
  },
  {
    path: '/expenses/',
    component: ExpensesPage,
    beforeEnter: checkAuth,
  },
  {
    path: '/customers/',
    component: ClientsPage,
    beforeEnter: checkAuth,
  },
  {
    path: '/form/',
    component: FormPage,
    beforeEnter: checkAuth,
  },
  /*{
    path: '/sync/',
    component: SyncPage,
    beforeEnter: checkAuth,
  },*/
  {
    path: '/login/',
    component: LoginPage,
    beforeEnter: checkAuthLogin,
  },
  {
    path: '/signup',
    component: SignupPage,
    beforeEnter: checkAuthLogin,
  },
  {
    path: '/resetpassword',
    component: ResetPasswordPage,
    beforeEnter: checkAuthLogin,
  },
  {
    path: '/settings/',
    component: SettingsPage,
    beforeEnter: checkAuth,
  },

  {
    path: '/reports/',
    component: ReportsRoutePage,
    beforeEnter: checkAuth,
  },
  {
    path: '/orders/',
    component: OrderPage,
    beforeEnter: checkAuth,
  },
  {
    name: 'Landing Page',
    path: '/LandingPage/',
    url: 'Landing/default.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: HomePage,
  },
];

export default routes;