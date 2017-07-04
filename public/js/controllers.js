angular.module("Controllers", ['ngCookies'])
 
.run(function($http, $rootScope, $cookies) {
     $rootScope.current_user = $cookies.current_user;
     $rootScope.authenticated = $cookies.authenticated;

     var parsed_recipes = JSON.parse(localStorage.getItem('filtered_recipes'));
     $rootScope.filtered_recipes = parsed_recipes;

     var parsed_unique_recipe = JSON.parse(localStorage.getItem('unique_recipe'));
     $rootScope.unique_recipe = parsed_unique_recipe;

     var parsed_ingreds = JSON.parse(localStorage.getItem('ingreds'));
     $rootScope.ingreds = parsed_ingreds;

     var parsed_directions = JSON.parse(localStorage.getItem('directions'));
     $rootScope.directions = parsed_directions;

     $rootScope.show_edit = localStorage.getItem('show_edit');

     //==================Logout function=====================

     $rootScope.logout = function() {
         $http.get('/auth/signout');
         $rootScope.authenticated = false;
         $rootScope.current_user = '';
         $cookies.authenticated = 'false';
         $cookies.current_user = '';
     };
 })
 
 
 //===================Main controller======================

.controller("mainCtrl", function($scope, $location, $http, $rootScope, $cookies, $window) {

     $http.get("/api/recipes")
         .then(function(response) {
             $rootScope.recipes = response.data;

         });

     //=========Function to show recipes according to their types===========

     $scope.filter = function(type) {
         $http.get("api/recipes")
         
             .then(function(response) {
                 var filtered = [];
                 if (type == "user") {
                     for (var i = 0; i < response.data.length; i++) {
                         if (response.data[i].posted_by == $cookies.current_user) {
                             filtered.push(response.data[i]);
                         }
                     }
                 }
                 else {
                     for (var i = 0; i < response.data.length; i++) {
                         if (response.data[i].type == type) {
                             filtered.push(response.data[i]);
                         }
                     }
                 }
                 $scope.filtered_recipes = filtered;
                 var filtered_toJson = JSON.stringify(filtered);
                 localStorage.setItem('filtered_recipes', filtered_toJson);

             }, function(response) {
                 alert("There was an error. Please try again.\n" + "StatusCode: " + response.status);
             });
     };

     //=============Function to store data in localStorage============

     function toStorage(response) {
         $rootScope.unique_recipe = response.data;
         $rootScope.ingreds = response.data.ingredients.split('\n');
         $rootScope.directions = response.data.body.split('\n');

         var unique_recipe_toJson = JSON.stringify($rootScope.unique_recipe);
         var ingreds_toJson = JSON.stringify($rootScope.ingreds);
         var directions_toJson = JSON.stringify($rootScope.directions);

         localStorage.setItem('unique_recipe', unique_recipe_toJson);
         localStorage.setItem('ingreds', ingreds_toJson);
         localStorage.setItem('directions', directions_toJson);
     }

     //============Function to show a separate recipe==========

     $scope.show_recipe = function(recipe) {
         var id = recipe._id;
         if (recipe.posted_by == $cookies.current_user) {
             $rootScope.show_edit = true;
             localStorage.setItem('show_edit', 'true');

         }
         else {
             $rootScope.show_edit = false;
             localStorage.setItem('show_edit', 'false');
         }

         $http.get("/api/recipe/" + id)
             .then(function(response) {

                 toStorage(response);

             }, function(response) {
                 
                 alert("There was an error. Please try again.\n" + "StatusCode: " + response.status);
             });
             $rootScope.unique_recipe = '';
                 localStorage.removeItem('unique_recipe');
                 localStorage.removeItem('ingreds');
                 $rootScope.ingreds = '';
                 localStorage.removeItem('directions');
                 $rootScope.directions = '';
     };

     //===================Add recipe function=========================

     $scope.addRecipe = function() {
         $scope.newRecipe.posted_by = $rootScope.current_user;
         $http.post("/api/recipes", $scope.newRecipe)
             .then(function(response) {
                 $location.path('/');
                 $window.scrollTo(0, 0);
             }, function(response) {
                 alert("There was an error. Please try again.\n" + "StatusCode: " + response.status);
                 $location.path('/add_recipe');
             });

     };

     //===============Open window for editting recipe function========

     $scope.edit = function(recipe) {
         $http.get("/api/recipe/" + recipe._id)
             .then(function(response) {
                 $rootScope.recipe = response.data;
                 $location.path('/edit_recipe');
             }, function(response) {
                 $location.path('/show_recipe');
                 $rootScope.recipe = '';
                 alert("There was an error. Please try again.\n" + "StatusCode: " + response.status);
             });
                              $scope.recipes = '';

         $window.scrollTo(0, 0);
     };

     //================Save editted recipe function============

     $scope.save = function() {

         $http.put("/api/recipe/" + $scope.recipe._id, $scope.recipe)
             .then(function(response) {
                 toStorage(response);
                  $location.path('/show_recipe');
              }, function(response) {
                 alert("There was an error. Please try again.\n" + "StatusCode: " + response.status);
                 $location.path('/edit_recipe');
             });
           $window.scrollTo(0, 0);
     };

     //================Delete function==========================

     $scope.delete = function(recipe) {
         var temp = confirm("The recipe will be deleted! Procceed?");
         if (temp) {
             $http.delete("/api/recipe/" + recipe._id)
                 .then(function(response) {
                  $rootScope.recipe = '';
                     $location.path('/');
                    $rootScope.recipe = ''; 
                 }, function(response) {
                     alert("There was an error. Please try again.\n" + "StatusCode: " + response.status);
                     $location.path('/show_recipe');
                 });
          }
         $rootScope.recipe = '';

         $window.scrollTo(0, 0);
     };

     //================Show/hide aside menu function=============

     $scope.center_menu = false;
     $scope.show_menu = function() {

         if ($scope.center_menu) {
             $scope.center_menu = false;
         }
         else {
             $scope.center_menu = true;
         }
     };
 })

 //===============Authorization controller===================

.controller("authCtrl", function($scope, $location, $http, $rootScope, $cookies) {
     $scope.user = {
         username: '',
         email: '',
         password: ''
     };

     //================Register function========================

     $scope.register = function() {

         $http.post('/auth/signup', $scope.user).success(function(data, status) {
             if (data.state == "success") {
                 $location.path('/');
                 alert("Registration successful. Now You can log in");
             }
             else {
                 alert("Registration failed. User with such username already exists");

             }

         });
     };

     //================Login fucntion ===========================

     $scope.login = function() {
         $http.post('/auth/login', $scope.user)
             .then(function(response) {
                 
                 if (response.data.state == 'success') {
                     $rootScope.authenticated = true;
                     $rootScope.current_user = response.data.user.username;
                     $cookies.current_user = $rootScope.current_user;
                     $cookies.authenticated = 'true';
                     $location.path('/');
                 }
                 if (response.data.state == 'failure') {
                     alert("Invalid username or password");
                 }
             }, function(response) {
                 alert("There was an error. Please try again.\n" + "StatusCode: " + response.status);
                 $location.path('/show_recipe');
             });
     };
 });
 