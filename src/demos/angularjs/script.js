var app = angular.module('app', []);

app.controller('MainCtrl', function GrandParentCtrl($rootScope, $scope){
    $rootScope.isRootScope = '$rootScope';

    $scope.name = 'test-ng-scope-inheritance';
});
app.controller('GrandParentCtrl', function GrandParentCtrl($scope){
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

/**
 * 
 */

window.onload = function() {
    var mainScope = angular.element(document.getElementById('main')).scope();
    var childScope = angular.element(document.getElementById('child')).scope();
    console.log('[test] childScope :',childScope);
    // TODO: 这么写有 bug 。。不管前面怎么样都应该是 6 个叶子节点！！
    // var isolateScope1 = angular.element(document.getElementById('comp1')).scope();
    // var isolateScope2 = angular.element(document.getElementById('comp2')).scope();
    var isolateScope1 = angular
        .element(document.getElementById('comp1'))
        .isolateScope();
    var isolateScope2 = angular
        .element(document.getElementById('comp2'))
        .isolateScope();

    var todos = [
        // { value: window.angular, _label: 'window.angular' },
        { value: mainScope, _label: 'main scope' },
        { value: childScope, _label: 'child scope' },
        { value: childScope.parent, _label: 'childScope.parent' },
        // { value: childScope.$parent, _label: 'child\'s $parent scope' },
        // { value: childScope.__proto__, _label: 'child.__proto__' },
        { value: isolateScope1, _label: 'isolate scope #1' },
        { value: isolateScope1.$parent, _label: 'isolate scope #1 .$parent' },
        { value: isolateScope2, _label: 'isolate scope #2' },
        { value: isolateScope2.$parent, _label: 'isolate scope #2 .$parent' },
    ];
    var data = {
        chart: {
            container: '#tree',
            levelSeparation: 20,
            siblingSeparation: 15,
            subTeeSeparation: 15,
            rootOrientation: 'EAST',

            node: {
                HTMLclass: 'prototype-draw',
                drawLineThrough: true
            },
            connectors: {
                type: 'straight',
                style: {
                    'stroke-width': 2,
                    stroke: '#ccc'
                }
            }
        },

        nodeStructure: getPrototypeTree(todos)
        /*
            {
                text: { name: 'null' },
                HTMLclass: 'root',
                children: [
                    {
                        text: {
                            name: 'Object.prototype',
                            desc: '...'
                        }
                    },
                    {
                        text: {
                            name: 'Object.prototype',
                            desc: '...'
                        }
                    }
                ]
            }
        */
    };

    /**
     * Possible demos:
     * - collapsable
     * - comments
     * - custom-colored
     * - super-simple (only 3 nodes)
     * - tennis-draw
     * - test-ground
     */
    new Treant(data);
};
