 angular.module("Controllers", [])
     .controller("mainCtrl", function($scope, $http, $location, $window) {
         /*   $scope.recipes = [{
                title: "Salad",
                descript: "chop onion, cucumber, tomato. then mixed all of this in a big bowl. chop onion, cucumber, tomato. then mixed all of this in a big bowl",
                ingredients: "onion, cucumber, tomato",
                body: "chop onion, cucumber, tomato. then mixed all of this in a big bowl.",
                posted_by: "Pedro"
            }, {
                title: "Salad",
                descript: "chop onion, cucumber, tomato. then mixed all of this in a big bowl.",
                ingredients: "onion, cucumber, tomato",
                body: "chop onion, cucumber, tomato. then mixed all of this in a big bowl.",
                posted_by: "Pedro"
            }, {
                title: "Salad",
                descript: "chop onion, cucumber, tomato. then mixed all of this in a big bowl.",
                ingredients: "onion, cucumber, tomato",
                body: "chop onion, cucumber, tomato. then mixed all of this in a big bowl.",
                posted_by: "Pedro"
            }];  */

         $http.get("/api/recipes")
             .then(function(response) {
                 $scope.recipes = response.data;

             });



         $scope.unique_recipe = {
             title: '',
             descript: '',
             ingredients: '',
             body: '',
             posted_by: "guest"
         }


             var id = "";
             $scope.show_recipe = function(recipe) {
                id = recipe._id;
                console.log(id); 
                $http.get("/api/recipe/" + id)
                 .then(function(response) {
                     $scope.unique_recipe = response.data;
                     console.log($scope.unique_recipe);
                 });

             }
      
            

         


         $scope.recipe = {
             title: '',
             descript: '',
             ingredients: '',
             body: '',
             posted_by: "guest"
         }


         $scope.addRecipe = function() {
             $http.post("/api/recipes", $scope.recipe).success(function(data, status) {
                 console.log(data, status);
             });

             $location.path('/');

         };


         $scope.center_menu = false;
         $scope.show_menu = function() {

             if ($scope.center_menu) {
                 $scope.center_menu = false;
             } else {
                 $scope.center_menu = true;
             }
             console.log($scope.center_menu);
         };
     })

 .controller("registerCtrl", function($scope, $location, $http) {
     $scope.user = {
         username: '',
         email: '',
         password: ''
     };

     $scope.register = function() {
         $http.post('/auth/user', $scope.user).success(function(data, status) {
             console.log(data, status);
         })
         $location.path('/');



     }

     $scope.login = function () {
         // body...
     };

 });
