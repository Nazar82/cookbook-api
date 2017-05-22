cookApp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/main.html",
            controller: "mainCtrl"
        })
        .when("/register", {
            templateUrl: "templates/register.html",
            controller: "registerCtrl"
        })
        .when("/login", {
            templateUrl: "templates/login.html"

        })
        .when("/add_recipe", {
            templateUrl: "templates/add_recipe.html",
            controller: "mainCtrl"
        })

        .when("/show_recipe", {
            templateUrl: "templates/show_recipe.html",
            controller: "mainCtrl"
        });

    $routeProvider.otherwise("/");
})
