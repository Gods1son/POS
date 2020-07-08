import $$ from 'dom7';
import Framework7, { Template7 } from 'framework7/framework7.esm.bundle.js';
//import localforage from "localforage";

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';
import 'framework7-icons/css/framework7-icons.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';
//import 'datatables.net-dt/css/jquery.dataTables.css';


// Import Routes
import routes from './routes.js';

import List from 'list.js';
import PouchDB from 'pouchdb';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import pouchFind from 'pouchdb-find';
import pouchAuth from 'pouchdb-authentication';

PouchDB.plugin(cordovaSqlitePlugin);
PouchDB.plugin(pouchFind);
PouchDB.plugin(pouchAuth);
window.PouchDB = PouchDB;
window.List = List;

// Import main app component
import App from '../app.f7.html';
//import App from '../index.html';
//import Dexie from 'dexie';
//window.Dexie = Dexie;
import Dom7 from 'dom7';
window.$$ = Dom7;
import * as moment from 'moment';
import jQuery from 'jquery';
window.jQuery = jQuery;
window.$ = jQuery;

Template7.registerHelper("money", function(val){
    var sym = localStorage.getItem("currency", val);
    sym = sym == undefined ? "" : sym;
    if(val < 0){
      var rev = 0 - val;
      var val2 = val + rev + rev;
      val = val2;
      sym = "-" + sym;
    }
    var ret = sym + val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return ret;
})

Template7.registerHelper("convertDate", function(val){
    var myDate = new Date(val);
    return myDate.toLocaleString();
})

setTimeout(function(){

  var app = new Framework7({
    root: '#app', // App root element
    component: App, // App main component
  
    name: 'BizExpenseManager', // App name
    theme: 'auto', // Automatic theme detection
    /*view: {
      pushState: true,
      pushStateRoot: document.location.pathname.split("index.html")[0]
    },*/
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

  var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
  $$(document).on('deviceready', function() {
    document.addEventListener("backbutton", function(e){
      e.preventDefault();
      mainView.router.back();
      //navigator.app.backHistory();
      
    }, false);
  });

},3000)



