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
//import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import pouchFind from 'pouchdb-find';
//import pouchAuth from 'pouchdb-authentication';

//PouchDB.plugin(cordovaSqlitePlugin);
PouchDB.plugin(pouchFind);
//PouchDB.plugin(pouchAuth);
window.PouchDB = PouchDB;

window.List = List;

// Import main app component
import App from '../app.f7.html';
//import App from '../index.html';
//import Dexie from 'dexie';
//window.Dexie = Dexie;
import Dom7 from 'dom7';
window.$$ = Dom7;
//import * as moment from 'moment';
import jQuery from 'jquery';
window.jQuery = jQuery;
window.$ = jQuery;


Template7.registerHelper("money", function(val){
    var sym = localStorage.getItem("currency", val);
    if(sym == undefined || sym == "undefined" || sym == null || sym == "null"){
      sym = "";
    }
    //sym = sym == undefined ? "" : sym;
    if(val < 0){
      var rev = 0 - val;
      var val2 = val + rev + rev;
      val = val2;
      sym = "-" + sym;
    }
    val = Math.round((val + Number.EPSILON) * 100) / 100;
    var ret = sym + val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return ret;
})

Template7.registerHelper("convertDate", function(val){
    var myDate = new Date(val);
    return myDate.toLocaleString();
})
var openedPanel = false, mogulsheetdb = null, isDesktop = false;
setTimeout(function(){

  var app = new Framework7({
    root: '#app', // App root element
    component: App, // App main component
  
    name: 'Mogul Sheet', // App name
    theme: 'auto', // Automatic theme detection
    view: {
      pushState: true,
      //pushStateRoot: document.location.pathname.split("index.html")[0]
    },
    // App routes
    routes: routes,
    data() {
      return {
        openedPanel: true,
        isDesktop: false
      };
    },
    methods: {
      alert: function() {
        app.dialog.alert('Hello World');
      },
      consoling: function(){
        console.log("master page");
      },
      isDesktop: function(){
        var width = $(window).width();
        if(width >= 1024){
            return true;
        }else{
          return false;
        }
      },
      generateClientID: function(){
        var navigator_info = window.navigator;
        var screen_info = window.screen;
        var uid = navigator_info.mimeTypes.length;
        uid += navigator_info.userAgent.replace(/\D+/g, '');
        uid += navigator_info.plugins.length;
        uid += screen_info.height || '';
        uid += screen_info.width || '';
        uid += screen_info.pixelDepth || '';
        uid = uid.substr(0,25);
        return uid;
        //console.log("uniqueid : ", uid);
      },
      sendAnalytics: function(page){
        try{
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
            'event': 'Pageview',
            'pagePath': window.location.href,
            'pageTitle': page, //some arbitrary name for the page/state
            'userId' : app.methods.generateClientID()
            });
            //console.log(window.dataLayer);
          }catch(err){
            
          }
      },
      startPouch: function(){
        //var self = this;
        //db = null;
        try{//id,name,unit_size,unit,cost_per_unit,status,created_date
          mogulsheetdb = new PouchDB('mogulsheet.db', {auto_compaction: true});
          var mogulsheetIndex = localStorage.getItem("mogulsheetIndex");

        if(mogulsheetIndex == undefined){
          mogulsheetdb.createIndex({
            index: {
              fields: ['_id','ingredientID', 'status'],
              name: 'ingredients',
            }
          });

          mogulsheetdb.createIndex({
            index: {
              fields: ['_id','clientID', 'status'],
              name: 'clients',
            }
          });

          mogulsheetdb.createIndex({
            index: {
              fields: ['_id','productID', 'status'],
              name: 'products',
            }
          });

          mogulsheetdb.createIndex({
            index: {
              fields: ['_id','expenseID', 'status'],
              name: 'expenses',
            }
          });

          mogulsheetdb.createIndex({
            index: {
              fields: ['_id', 'settingID'],
              name: 'settings',
            }
          });

          mogulsheetdb.createIndex({
            index: {
              fields: ['_id','restockID'],
              name: 'restock',
            }
          });

          mogulsheetdb.createIndex({
            index: {
              fields: ['_id','prodIngsID', 'productID', 'status'],
              name: 'prodIngs',
            }
          });

          mogulsheetdb.createIndex({
            index: {
              fields: ['_id','prodOthersID', 'productID', 'status'],
              name: 'prodOthers',
            }
          });

          mogulsheetdb.createIndex({
            index: {
              fields: ['_id','saleID', 'parentID', 'status'],
              name: 'sales',
            }
          });

          mogulsheetdb.createIndex({
            index: {
              fields: ['_id','saleID', 'parentID', 'status', 'isEstimate', 'created_date'],
              name: 'salesEstimate',
            }
          });

          mogulsheetdb.createIndex({
            index: {
              fields: ['_id', 'parentID', 'status', 'productID_saleID'],
              name: 'productSales',
            }
          });
          localStorage.setItem("mogulsheetIndex", 1);
        }
          return mogulsheetdb;

            //self.syncDB();
            //self.getData();
        }catch(err){
          
          }
      },
    },
    on: {
      init: function () {
        var self = this;
        //console.log('App initialized');
        app.methods.generateClientID();
      },
      pageInit: function () {
        //var self = this;
        app.methods.startPouch();
        //app.methods.alert();
        //self.$app.alert();
      },
      pageAfterIn: function (event, page) {
        var self = this;
        $(".navbar .right .panel-toggle").on("click", function(){
          var panel = app.panel.get('.panel-left');
          if(panel.opened){
            openedPanel = false;
          }else{
            openedPanel = true;
          }
        })
      },
      pageBeforeIn: function (event, page) {
        // do something after page gets into the view
        var self = this;
        var width = $(window).width();
        if(width >= 1024){
            isDesktop = true;
        }else{
          isDesktop = false;
        }

        //console.log(isDesktop);
        var page = event.el;
        var name = $$(page).data("name");
        var panel = app.panel.get('.panel-left');
        if(name == "home"){

          if(panel.opened){
            panel.toggle(false);
          }
        }else{
          app.methods.sendAnalytics(name);
          if(!panel.opened){
            var width = $(window).width();
            if(width >= 1024 && !openedPanel){
              panel.toggle(false);
            }
          }
        }
      }
    }
  });

  //var mainView = app.views.create('.view-main');

  var opened = 0;
  function exitApp(){
    if (opened > 0) {
      return false;
    } else {
      app.dialog.confirm('Are you sure you want to exit?', 'Exit App', 
        function () {
        navigator.app.exitApp();
        },
        function () {
        opened = 0;  
        return false;
        }
      );
      opened = 1;
    }
  }
  
      
  function onBackKeyDown() {
    // Handle the back button
    if(app.views.main.history.length == 1){
      exitApp();
      e.preventDefault();
    } else if($(".modal-in").length > 0){
      app.dialog.close(true);
    }
    else {
      
      app.views.main.router.back();
      return false;
    }
  }
  
  document.addEventListener("backbutton", onBackKeyDown, false);
  window.addEventListener("beforeunload", function(event) {
    event.returnValue = "Are you sure you want to leave?";
  });

},200)



