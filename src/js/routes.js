
import HomePage from '../pages/home.f7.html';
import IngredientPage from '../pages/ingredient.f7.html';
import ProductsPage from '../pages/products.f7.html';
import SalesPage from '../pages/sales.f7.html';
import ExpensesPage from '../pages/expenses.f7.html';
import FormPage from '../pages/form.f7.html';
import SettingsPage from '../pages/settings.f7.html';
import ClientsPage from '../pages/clients.f7.html';
import SyncPage from '../pages/sync.f7.html';

import ReportsRoutePage from '../pages/reports.f7.html';
import RequestAndLoad from '../pages/request-and-load.f7.html';
import NotFoundPage from '../pages/404.f7.html';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/ingredient/',
    component: IngredientPage,
  },
  {
    path: '/products/',
    component: ProductsPage,
  },
  {
    path: '/sales/',
    component: SalesPage,
  },
  {
    path: '/expenses/',
    component: ExpensesPage,
  },
  {
    path: '/clients/',
    component: ClientsPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/sync/',
    component: SyncPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },

  {
    path: '/reports/',
    component: ReportsRoutePage,
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
    component: NotFoundPage,
  },
];

export default routes;