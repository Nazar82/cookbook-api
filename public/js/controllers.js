 angular.module("Controllers", ['ngCookies'])

 .run(function($http, $rootScope, $cookies) {
     $rootScope.current_user = $cookies.current_user;
     $rootScope.authenticated = $cookies.authenticated;
     console.log($rootScope.current_user);
     console.log($rootScope.authenticated);


     $rootScope.logout = function() {
         $http.get('/auth/signout');
         $rootScope.authenticated = false;
         $rootScope.current_user = '';
         $cookies.authenticated = 'false';
         $cookies.current_user = '';
     };
 })

 .controller("mainCtrl", function($scope, $http, $location, $window, $rootScope, $cookies) {


     $http.get("/api/recipes")
         .then(function(response) {
             $scope.recipes = response.data;

         });


 

 
      
     $scope.show_recipe = function(recipe) {
         var id = recipe._id;
          
         $http.get("/api/recipe/" + id)
             .then(function(response) {
                 $rootScope.unique_recipe = response.data;;
               console.log($rootScope.unique_recipe);  
               
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
         console.log($cookies.current_user);

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

 .controller("authCtrl", function($scope, $location, $http, $rootScope, $cookies) {
     $scope.user = {
         username: '',
         email: '',
         password: ''
     };

     $scope.register = function() {

         $http.post('/auth/signup', $scope.user).success(function(data, status) {
             if (data.state == "success") {

                 $location.path('/');
                 alert("Registration successful. Now You can log in");

             } else {
                 alert("Registration failed. User with such username already exists");

             }
             console.log(data, status);
         })



     };

     $scope.login = function() {
         $http.post('/auth/login', $scope.user).success(function(data, status) {
             if (data.state == 'success') {
                 $rootScope.authenticated = true;
                 $rootScope.current_user = data.user.username;
                 $cookies.current_user = $rootScope.current_user;
                 $cookies.authenticated = 'true';
                 $location.path('/');
             }
             console.log(data, status);
             if (data.state == 'failure') {
                 alert("Invalid username or password");
             }

         })


     }

 });



 /* console.log(data, status);
             try {
                 $rootScope.current_user = data.user.username;
                 if ($rootScope.current_user == null) {

                 }
             } catch (e) {
                 alert("Invalid username or password");
             }
             if ($rootScope.current_user) {
                 $rootScope.authenticated = true;
             }
         })
         $location.path('/');*/
