var app = angular.module('app', []);

app.controller('GrandParentCtrl', function GrandParentCtrl($rootScope, $scope){
    $rootScope.isRootScope = '$rootScope';

    $scope.age = 80;
    $scope.health = 'healthy';
});
app.controller('ParentCtrl', function ParentCtrl($scope){
    $scope.age = 50;
    $scope.job = 'Front End Engineer';
});
app.controller('ChildCtrl', function ChildCtrl($scope){
    $scope.age = 20;
    $scope.school = 'Coursera';
});

app.component('firstComp', {
    bindings: { name: '<' },
    controller: function FirstComp($scope){
        $scope.index = 1;
    },
    controllerAs: 'compCtrl1',
    template: '<second-comp id="comp2"></second-comp>'
});

app.component('secondComp', {
    bindings: { name : '<' },
    controller: function SecondComp($scope){
        $scope.index = 2;
    },
    controllerAs: 'compCtrl2'
});