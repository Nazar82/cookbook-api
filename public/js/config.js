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
        .when("/recipe", {
            templateUrl: "templates/recipe.html",
            controller: "mainCtrl"
        });

    $routeProvider.otherwise("/");
})
