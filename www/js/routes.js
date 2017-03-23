angular.module('app.routes', [])

  .config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider





      .state('calChecker', {
        url: '/side-menu22',
        abstract:true,
        templateUrl: 'templates/calChecker.html'
      })



      .state('calChecker.search', {
        url: '/search',
        views: {
          'side-menu22': {
            templateUrl: 'templates/search.html'
          }
        }
      })


      .state('calChecker.selectedRecipe', {
        url: '/selrecipe',
        views: {
          'side-menu22': {
            templateUrl: 'templates/selectedRecipe.html'
          }
        }
      })





      .state('calChecker.bMI', {
        url: '/bmi',
        views: {
          'side-menu22': {
            templateUrl: 'templates/bMI.html'
          }
        }
      })





      .state('calChecker.results', {
        url: '/results1',
        views: {
          'side-menu22': {
            templateUrl: 'templates/results.html'
          }
        }
      })





      .state('calChecker.results2', {
        url: '/results2',
        views: {
          'side-menu22': {
            templateUrl: 'templates/results2.html'
          }
        }
      })

      .state('calChecker.bMIResult', {
        url: '/bmiselect',
        views: {
          'side-menu22': {
            templateUrl: 'templates/bMIResult.html'
          }
        }
      })


    ;

    // if none of the above states are matched, use this as the fallback

    $urlRouterProvider.otherwise('/side-menu22/search');




  });
