 angular.module("Controllers", [])
     .controller("mainCtrl", function($scope, $http, $location) {
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
                 console.log(response.data);
             });



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

         }





         $scope.center_menu = false;
         $scope.show_menu = function() {

             if ($scope.center_menu) {
                 $scope.center_menu = false;
             } else {
                 $scope.center_menu = true;
             }

         }
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

 });
