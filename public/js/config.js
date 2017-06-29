cookApp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/main.html",
            controller: "mainCtrl"
        })
        .when("/register", {
            templateUrl: "templates/register.html",
            controller: "authCtrl"
        })
        .when("/login", {
            templateUrl: "templates/login.html",
            controller: "authCtrl"
           
        })
        .when("/add_recipe", {
            templateUrl: "templates/add_recipe.html",
            controller: "mainCtrl"
        })

        .when("/show_recipe", {
            templateUrl: "templates/show_recipe.html",
            controller: "mainCtrl"
        })
        .when("/filtered", {
            templateUrl: "templates/filtered.html",
            controller: "mainCtrl"
        })
        .when("/edit_recipe", {
            templateUrl: "templates/edit_recipe.html",
            controller: "mainCtrl"
        });
    $routeProvider.otherwise("/");
})
