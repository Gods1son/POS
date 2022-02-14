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
    //var sym = app.data.settings == null ? "" : app.data.settings.currency;
    //sym = sym == undefined ? "" : sym;
    var sym = "";
    val = Number(val);
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
  
    name: 'Omni', // App name
    theme: 'auto', // Automatic theme detection
    view: {
      pushState: true,
      //pushStateRoot: document.location.pathname.split("index.html")[0],
      pushStateSeparator: "#" 
    },
    // App routes
    routes: routes,
    data() {
      return {
        openedPanel: true,
        isDesktop: false,
        apiUrl: "https://localhost:44383/api/", //"https://tryomni.co/api/", // 
        siteUrl: "https://tryomni.co/", //"https://localhost:44383/", //"https://flexmoni.com/",
        settings: null,
        fetchedSettings: false
      };
    },
    methods: {
      alert: function() {
        app.dialog.alert('Hello World');
      },
      resaveSettings:function(newData){
        //app.data.settings = newData;
        app.methods.getBusinessProfile();
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
      postDataAPI: async function(url = '', data = {}, includeToken = true){
        return new Promise((resolve, reject) => {
              url = app.data.apiUrl + url;
            var headers = {
              
              // 'Content-Type': 'application/x-www-form-urlencoded',
            };
            if(includeToken){
              var token = localStorage.getItem("FlexBusinessToken");
              headers.Authorization = 'Bearer ' + token;
            }
            $.ajax({
              url: url,
              headers: headers,
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(data),
              success: function (data) {
                resolve(data)
              },
              error: function (error) {
                if(error.status == 401){
                  localStorage.removeItem("FlexBusinessToken");
                  app.views.main.router.navigate('/login/');
                }
                reject(error);
              }
            });
        });
        
          
      },
      postFormDataAPI: async function(url = '', data = {}, includeToken = true){
        return new Promise((resolve, reject) => {
            url = app.data.apiUrl + url;
            var headers = {
              
              // 'Content-Type': 'application/x-www-form-urlencoded',
            };
            if(includeToken){
              var token = localStorage.getItem("FlexBusinessToken");
              headers.Authorization = 'Bearer ' + token;
            }
            $.ajax({
              url: url,
              type:"POST",
              contentType: false,
              processData: false,
              headers: headers,
              data: data,
              success: function (data) {
                resolve(data)
              },
              error: function (error) {
                if(error.status == 401){
                  localStorage.removeItem("FlexBusinessToken");
                  app.views.main.router.navigate('/login/');
                }
                reject(error);
              }
            });
        });
        
          
      },
      postData: async function (url = '', data = {}, includeToken = true) {
        url = app.data.apiUrl + url;
        
        var headers = {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        };
        if(includeToken){
          var token = localStorage.getItem("FlexBusinessToken");
          headers.Authorization = 'Bearer ' + token;
        }
        // Default options are marked with *
        await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          headers: headers, // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        }).then(response => {
          var ret_response = response.json();
          console.log(ret_response);
          return ret_response; // parses JSON response into native JavaScript objects
        });
      },
      getDataAPI: async function (url = '', includeToken = true) {

        return new Promise((resolve, reject) => {
          url = app.data.apiUrl + url;
          var headers = {
            
            // 'Content-Type': 'application/x-www-form-urlencoded',
          };
          if(includeToken){
            var token = localStorage.getItem("FlexBusinessToken");
            headers.Authorization = 'Bearer ' + token;
          }
          $.ajax({
            url: url,
            headers: headers,
            method: 'GET',
            contentType: 'application/json',
            data: {},
            success: function (data) {
              resolve(data)
            },
            error: function (error) {
              if(error.status == 401){
                localStorage.removeItem("FlexBusinessToken");
                app.views.main.router.navigate('/login/');
              }
              reject(error);
            }
          });
        });
        
      },
      signOutGlobal: function(){
        var token = localStorage.getItem("FlexBusinessToken");
        if(token != null){
          localStorage.removeItem("FlexBusinessToken");
        }
        console.log("Log out");
        app.views.main.router.navigate('/login/');
      },
      getBusinessProfile: async function() {
        $.when(app.methods.getDataAPI("business/GetBusinessProfile")).then(function( data, textStatus, jqXHR ) {
          if(data != null){
            app.data.settings = data;
            //set business name
            if(app.data.settings != null && app.data.settings.name != null){
              $(".businessNameLabel").text(app.data.settings.name);
            }
          }
        });
      },
      checkUserSubscription: function(){
        var sub = false;
        if(app.data.settings && app.data.settings.storeSubscribed){
          sub = true;
        }
        return sub;
      },
      refetchSettings:function(newData){
        app.data.settings = newData;
        if(app.data.settings != null && app.data.settings.name != null){
          $(".businessNameLabel").text(app.data.settings.name);
        }
      },
      showToast: function(text, position, icon = false){
        //var self = this;
        app.toast.create({
              icon: icon ? '<i class="f7-icons">checkmark_alt_circle</i>' : '',
              text: text,
              position: position,
              closeTimeout: 2000,
          }).open();
    },
    formatDate: function(date){
      if(date != null){
        return moment(date).format('MMM Do YYYY')
      }
      return "";
    },
    formatMoney:function(val){  
      //var self = this;           
      var sym = app.data.settings == null ? "" : app.data.settings.currency;
      sym = sym == undefined ? "" : sym;
      val = Number(val);
      if(val < 0){
        var rev = 0 - val;
        var val2 = val + rev + rev;
        val = val2;
        sym = "-" + sym;
      }
      val = Math.round((val + Number.EPSILON) * 100) / 100;
      //var ret = sym + val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      var ret = sym + val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      return ret;
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
        
      },
    },
    on: {
      init: function () {
        var self = this;
        //console.log('App initialized');
        //app.methods.generateClientID();
        
        var token = localStorage.getItem("FlexBusinessToken");

        if(token != null && app.data.settings == null){
          //console.log("get profile from home");
          
          //app.methods.getBusinessProfile();
          
          //console.log("fetched settings");
          //app.data.fetchedSettings = true;
        }
      },
      pageInit: function () {
        //var self = this;
        
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

        $('input[type=text], input[type=address], input[type=password], textarea').attr("autocomplete", "new-password");
        $('input[type=number]').attr("step", "any");

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
        if(name == "home" || name == "login" || name == "signup" || name == "resetpassword"){

          if(panel.opened){
            panel.toggle(false);
          }
        }else{
          //app.methods.sendAnalytics(name);
          if(!panel.opened){
            var width = $(window).width();
            if(width >= 1024 && !openedPanel){
              panel.toggle(false);
            }
          }
        }
        if(name != undefined && name != "home" && name != "login"){
          $(".quicklinks div.active").removeClass("active");
          $(".quicklinks div." + name).addClass("active");
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
    console.log("back button");
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
  /*window.addEventListener("popstate", function(event) {
    console.log("going back now");
    //event.preventDefault();
    //app.views.main.router.refreshPage();
  });*/

},200)



