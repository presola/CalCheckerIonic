// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.directives','app.services','chart.js'])

  .run(function($ionicPlatform, $cordovaSQLite) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      var db = null;

      if (window.cordova && window.SQLitePlugin) {
        console.log("here1")
        db = $cordovaSQLite.openDB({ name: "bmi.db", iosDatabaseLocation:'default'});
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS BMIDetails (id integer primary key, height double, weight double, bmi double, date text)");
      }
      else{
        console.log("here2")
        db = window.openDatabase("bmi.db", '1', 'bmi', 100 * 1024 * 1024); // browser
        db.transaction(function (tx) {
          tx.executeSql('CREATE TABLE IF NOT EXISTS BMIDetails (id integer primary key, height double, weight double, bmi double, date text)');
        });

      }
    });
  });
