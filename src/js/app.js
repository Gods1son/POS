import $$ from 'dom7';
import Framework7, { Template7 } from 'framework7/framework7.esm.bundle.js';
//import localforage from "localforage";

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';
import 'framework7-icons/css/framework7-icons.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';
import 'datatables.net-dt/css/jquery.dataTables.css';


// Import Routes
import routes from './routes.js';

// Import main app component
import App from '../app.f7.html';
//import App from '../index.html';

import Dom7 from 'dom7';

import jQuery from 'jquery';
window.jQuery = jQuery;
window.$ = jQuery;

Template7.registerHelper("money", function(val){
    return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
})

Template7.registerHelper("convertDate", function(val){
    var myDate = new Date(val);
    return myDate.toLocaleString();
})

var app = new Framework7({
  root: '#app', // App root element
  component: App, // App main component

  name: 'BizExpenseManager', // App name
  theme: 'auto', // Automatic theme detection
  // App routes
  routes: routes,
  methods: {
    alert: function() {
      app.dialog.alert('Hello World');
    }
  },
  on: {
    init: function () {
      console.log('App initialized');
    },
    pageInit: function () {
      //app.methods.storage2();
      //this.$app.storage2();
    }
  }
});

