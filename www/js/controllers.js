angular.module('app.controllers', [])

  .filter('titleCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
  })
  .controller('searchCtrl', ['$scope', '$window','$http', '$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $window, $http, $state) {
      $scope.getFood = function () {
        if($scope.getText == undefined || $scope.getText == ""){
          $scope.error = "* Field is required";
        }
        else{
          var body = {
            search: $scope.getText
          };
          $http.post("http://192.168.0.2:4551/food", body)
            .then(function (response) {
              result = response.data
              if (result.total_results < 1){
                $scope.error = "* We currently do not have that food information, please check back or search for another food.";
              }
              else {
                food = [].concat(result.food)
                $window.localStorage['food'] = JSON.stringify(food)
                $window.localStorage['food_name'] = $scope.getText
                $state.go('calChecker.results')
              }

            });
        }
      }

    }])

  .controller('resultsCtrl', ['$scope', '$window', '$http','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $window, $http, $state) {
      var food_name = $window.localStorage['food_name']
      var food_results = JSON.parse($window.localStorage['food'])
      $scope.searchName = food_name
      $scope.items = food_results
      $scope.getSelFood = function (value) {
        sel_food = food_results[value]
        $window.localStorage['selected_food'] = JSON.stringify(sel_food)
        $state.go('calChecker.results2')
      }
      $scope.clearSearch = function() {
        $scope.search = '';
      };
    }])

  .controller('results2Ctrl', ['$scope', '$http', '$window', '$state', '$ionicLoading','$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller

    function ($scope, $http, $window, $state,$ionicLoading, $timeout) {
      var food_results = JSON.parse($window.localStorage['selected_food']);
      var food_name = $window.localStorage['food_name'];
      $scope.getName = food_results.food_name;
      var f_result = food_results.food_description;
      var serving = f_result.split('-')[0];
      $scope.gram = serving;
      var calories = f_result.split('-')[1].split('|')[0].split(':')[1];
      $scope.cal = calories;
      var body = {
        search: food_name
      };
      $http.post("http://192.168.0.2:4551/recipes", body)
        .then(function (response) {
          $ionicLoading.show();
          var result = response.data;
          var recipe = [].concat(result.recipe);
          $window.localStorage['recipe'] = JSON.stringify(recipe);
          recipe_items = JSON.parse($window.localStorage['recipe']);
          $scope.items = recipe_items;
          $timeout(function() {

            $ionicLoading.hide();
          }, 1000);
        });
      $scope.getSelRecipe = function (value) {
        $window.localStorage['selected_recipe'] = JSON.stringify(recipe_items[value])
        $state.go('calChecker.selectedRecipe')
      }
      $scope.clearSearch = function() {
        $scope.search = '';
      };
    }])

  .controller('selectedRecipeCtrl', ['$scope', '$http', '$window', '$state', '$ionicLoading','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $http, $window, $state,$ionicLoading, $timeout) {
      var selected_recipe = JSON.parse(window.localStorage['selected_recipe']);
      var recipe_id = selected_recipe.recipe_id;
      var recipe_name = selected_recipe.recipe_name;
      var recipe_des = selected_recipe.recipe_description;
      var recipe_image = selected_recipe.recipe_image;
      $scope.getName = recipe_name;
      $scope.image = recipe_image;
      $scope.getDescription = recipe_des;
      var body = {
        search: recipe_id
      };
      $http.post("http://192.168.0.2:4551/recipe", body)
        .then(function (response) {
          $ionicLoading.show();
          var result = response.data;
          $window.localStorage['recipe_result'] = JSON.stringify(result);
          var recipe_result = JSON.parse($window.localStorage['recipe_result']);
          var time = recipe_result.cooking_time_min;
          var servings = recipe_result.serving_sizes.serving;
          $scope.time = time;
          $scope.cal = servings.calories;
          $scope.servings = recipe_result.number_of_servings;
          $scope.size = servings.serving_size;
          var ingredients = [].concat(recipe_result.ingredients.ingredient);
          var directions = [].concat(recipe_result.directions.direction);
          $scope.ingredients = ingredients;
          $scope.directions = directions;
          $timeout(function() {

            $ionicLoading.hide();
          }, 1000);
        });
    }])

  .controller('bMICtrl', ['$scope', '$ionicModal', '$window', '$cordovaSQLite','$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $ionicModal, $window, $cordovaSQLite, $state) {



      $ionicModal.fromTemplateUrl('modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $ionicModal.fromTemplateUrl('delete.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.deletemodal = modal;
      });

      $scope.openDelete = function() {
        if ($scope.items != undefined ) {
          $scope.deletemodal.show();
        }
      };

      $scope.openModal = function() {
        $scope.modal.show();
      };

      $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.deletemodal.hide();
      };

      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });

      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });

      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });

      $ionicModal.fromTemplateUrl('heightmodal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.heightmodal = modal;
        if ($window.localStorage['userheight'] === undefined || $window.localStorage['userheight'] === null || $window.localStorage['userheight'] === "") {
          $scope.heightmodal.show();
        }
      });


      $scope.openHeightModal = function() {
        $scope.heightmodal.show();
      };

      $scope.closeHeightModal = function() {
        $scope.heightmodal.hide();
      };

      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.heightmodal.remove();
      });

      // Execute action on hide modal
      $scope.$on('heightmodal.hidden', function() {
        // Execute action
      });

      // Execute action on remove modal
      $scope.$on('heightmodal.removed', function() {
        // Execute action
      });

      $scope.insertHeight = function(data){
        if (data == null || data == undefined){
          $scope.error = "* Field is required *"
        }
        else{
          $window.localStorage['userheight'] = data.height;
          $scope.heightmodal.hide();
        }
      };

      $scope.deleteOne = function (item) {
        var lists = $scope.items
        var index = lists.indexOf(item);
        delete  lists[index];
        var query = "DELETE FROM BMIDetails where id="+item.id;
        if (window.cordova) {
          var db = $cordovaSQLite.openDB({ name: "bmi.db", iosDatabaseLocation:'default'});
          $cordovaSQLite.execute(db, query).then(function (res) {
            var bmilist = [];
            var datelist = [];
            var dict = []; // create an empty array
            for (item in lists){
              bmilist.push(lists[item].bmi);
              datelist.push(lists[item].date);
              dict.push({
                id:   lists[item].id,
                bmi:   lists[item].bmi,
                date: lists[item].date,
                height: lists[item].height,
                weight: lists[item].weight
              });
            }
            if (lists.length < 1){
              $scope.items = null;
            }
            else {
              $scope.items = lists;
            }
            $scope.drawCanvas(bmilist,datelist);
            $window.localStorage['bmiData'] = JSON.stringify(lists);
            $window.location.reload();
          }, function (err) {
            console.error(err);
          });
        }
        else {
          var db = window.openDatabase("bmi.db", '1', 'bmi', 20 * 1024 * 1024); // browser
          db.transaction(function (tx) {
            tx.executeSql(query, [],
              function (tx, result) {
                var bmilist = [];
                var datelist = [];
                var dict = []; // create an empty array
                for (item in lists){
                  bmilist.push(lists[item].bmi);
                  datelist.push(lists[item].date);
                  dict.push({
                    id:   lists[item].id,
                    bmi:   lists[item].bmi,
                    date: lists[item].date,
                    height: lists[item].height,
                    weight: lists[item].weight
                  });
                }
                if (lists.length < 1){
                  $scope.items = null;
                }
                else {
                  $scope.items = lists;
                }
                $scope.drawCanvas(bmilist,datelist);
                $window.localStorage['bmiData'] = JSON.stringify(lists);
                $window.location.reload();
              },
              function (error) {
                console.error(error);
              });
          });

        }

      };
      var val = false;
      $scope.deleteAllBMI = function() {

          var query = "DELETE FROM BMIDetails";
          if (window.cordova) {
            var db = $cordovaSQLite.openDB({ name: "bmi.db", iosDatabaseLocation:'default'});
            $cordovaSQLite.execute(db, query).then(function (res) {
              $scope.drawCanvas([],[]);
              $scope.drawCanvasText();
              $scope.items = [];
              $window.localStorage['bmiData'] = JSON.stringify([]);
              $scope.closeModal();
              $window.location.reload();
            }, function (err) {
              console.error(err);
            });
          }
          else {
            var db = window.openDatabase("bmi.db", '1', 'bmi', 20 * 1024 * 1024); // browser
            db.transaction(function (tx) {
              tx.executeSql(query, [],
                function (tx, result) {
                  $scope.drawCanvas([],[]);
                  $scope.drawCanvasText();
                  $scope.items = [];
                  $window.localStorage['bmiData'] = JSON.stringify([]);
                  $scope.closeModal();
                  $window.location.reload();
                },
                function (error) {
                  console.error(error);
                });
            });

          }

      };
      $scope.selectBMI = function() {
        var query = "SELECT * FROM BMIDetails";
        if (window.cordova) {
          var db = $cordovaSQLite.openDB({ name: "bmi.db", iosDatabaseLocation:'default'});
          $cordovaSQLite.execute(db, query).then(function (res) {
            if (res.rows.length > 0) {
              var bmilist = [];
              var datelist = [];
              var dict = []; // create an empty array
              for (i = 0; i < res.rows.length; i++){
                bmilist.push(res.rows.item(i).bmi);
                datelist.push(res.rows.item(i).date);
                dict.push({
                  id:   res.rows.item(i).id,
                  bmi:   res.rows.item(i).bmi,
                  date: res.rows.item(i).date,
                  height: res.rows.item(i).height,
                  weight: res.rows.item(i).weight
                });
              }
              $scope.items = dict;
              $scope.drawCanvas(bmilist,datelist)
            } else {
              $scope.drawCanvasText()
            }
          }, function (err) {
            console.error(err);
          });
        }
        else{
          var db = window.openDatabase("bmi.db", '1', 'bmi', 20 * 1024 * 1024); // browser
          db.transaction(function (tx) {
            tx.executeSql(query, [],
              function(tx, result) {
                if (result.rows.length > 0) {
                  var bmilist = [];
                  var datelist = [];
                  var dict = []; // create an empty array
                  for (i = 0; i < result.rows.length; i++){
                    bmilist.push(result.rows.item(i).bmi);
                    datelist.push(result.rows.item(i).date);
                    dict.push({
                      id:   result.rows.item(i).id,
                      bmi:   result.rows.item(i).bmi,
                      date: result.rows.item(i).date,
                      height: result.rows.item(i).height,
                      weight: result.rows.item(i).weight
                    });
                  }
                  $scope.items = dict;
                  $window.localStorage['bmiData'] = JSON.stringify(dict);
                  $scope.drawCanvas(bmilist,datelist)
                } else {
                  $scope.drawCanvasText()
                }
              },
              function(error){
                console.error(error);
              });
          });

        }
      };

      $scope.drawCanvasText = function () {
        var line = document.getElementById("line");
        var valueP = document.createElement("p");
        var textValue = document.createTextNode("No BMI data yet, click on the plus sign to add !!");
        valueP.appendChild(textValue);
        line.setAttribute("style", "padding-top: 100px;");
        line.appendChild(valueP);
      };


      $scope.drawCanvas = function (bmi, date) {
        var line = document.getElementById("line");
        line.setAttribute("style", "padding-top: 0px;");
        new_bmi = ['BMI'];
        new_bmi.push.apply(new_bmi, bmi);
        new_date = ['x'];
        new_date.push.apply(new_date, date);
        var chart = c3.generate({
          bindto: "#line",
          data: {
            x: 'x',
            columns: [
              new_date,
              new_bmi
            ]
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                rotate: 112,
                format: '%Y-%m-%d'
              }
            }
          }
        });

      };

      $scope.selectBMI();

      $scope.insertBMI = function(data) {
        var weight = data.weight;
        var d = new Date();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        var day = d.getDate();
        var date = year+"-"+month+"-"+day
        var height = $window.localStorage['userheight']
        var outputBMI;
        var heightm = height/100;
        var outputheight = Math.pow(heightm,2);
        outputBMI = weight/outputheight;
        outputBMI = outputBMI.toFixed(2);
        if (window.cordova) {
          var db = $cordovaSQLite.openDB({ name: "bmi.db", iosDatabaseLocation:'default'});
          var query = "INSERT INTO BMIDetails (height, weight, bmi, date) VALUES (?, ?, ?,'"+date+"')";
          $cordovaSQLite.execute(db, query, [height, weight, outputBMI]).then(function (res) {
            $scope.closeModal()
            $scope.selectBMI()
          }, function (err) {
            console.error(err);
          });
        }
        else{
          var db = window.openDatabase("bmi.db", '1', 'bmi', 20 * 1024 * 1024); // browser
          db.transaction(function (tx) {
            var query = "INSERT INTO BMIDetails (height, weight, bmi, date) VALUES (?, ?, ?,'"+date+"')";
            tx.executeSql(query, [height, weight, outputBMI],
              function(tx, result) {
                $scope.closeModal()
                $scope.selectBMI()
              },
              function(error){
                console.error(error);
              });
          });

        }
      }

      $scope.clearSearch = function() {
        $scope.search = '';
      };

      $scope.getSelBMI = function (value) {
        bData = JSON.parse($window.localStorage['bmiData'])
        $window.localStorage['selected_bmi'] = JSON.stringify(bData[value])
        $state.go('calChecker.bMIResult')
      }

    }])


  .controller('bMIResultCtrl', ['$scope', '$window', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $window) {

      bData = JSON.parse($window.localStorage['selected_bmi']);
      $scope.weight = bData.weight;
      $scope.height = bData.height;
      $scope.date = bData.date;
      $scope.bmi = bData.bmi;
      $scope.current = bData.bmi;

      var type = "";
      if(bData.bmi > 18.5 && bData.bmi < 24.9)
      {
        type = "Normal"
      }
      else if(bData.bmi > 25 && bData.bmi < 30)
      {
        type = "Overweight"
      }
      else if(bData.bmi > 30 && bData.bmi < 40)
      {
        type = "Obese"
      }
      else if(bData.bmi >= 40)
      {
        type = "Morbidly Obese"
      }
      else
      {
        type = "Underweight"
      }

      var chart = c3.generate({
        bindto: '#meter',
        data: {
          columns: [
            [type, 0]
          ],
          type: 'gauge',
          onclick: function (d, i) { console.log("onclick", d, i); },
          onmouseover: function (d, i) { console.log("onmouseover", d, i); },
          onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        gauge: {
          label:{
            format: function(value, ratio){
              return value; //returning here the value and not the ratio
            }
          },
          max: 60
        },
        color: {
          pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044', '#FF0000'], // the three color levels for the percentage values.
          threshold: {
            max: 60,
            values: [18.5, 24.9, 30, 60]
          }
        },
        size: {
          height: 250
        }
      });
      setTimeout(function () {
        chart.load({
          columns: [[type, bData.bmi]]
        });
      }, 500);


    }]);
