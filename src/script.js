console.log('Treant :', Treant);
console.log('Angular app :', app);

/**
 * TODO:
 * - 抽出一种统一的数据结构，再适配成 treant 所需要的，更灵活。
 * - 边界 case：`Object.create(null)` from [故意创建不具有典型原型链继承的对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype)
 * - Object.prototype 属性的属性特性
 */

/**
 * TODO: 
 * `Object.prototype` more on: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype 
 * `Object.keys` more on: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 * `Object.getOwnPropertyNames` more on: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
 * `_.isEqual` 判断的是什么呃？？
 */

function applyToTreeNodes(tree, locates, fn) {
    // 对当前节点应用 fn
    var objLocates = locates.slice(0, locates.length - 1);
    var propLocate = locates[locates.length - 1];
    var obj = tree;
    objLocates.forEach(function(locate) {
        obj = obj[locate];
    });
    obj[propLocate] = fn(obj[propLocate]);

    if (tree.children) {
        tree.children.forEach(function(childTree) {
            applyToTreeNodes(childTree, locates, fn);
        });
    }
    // TODO: return each tree ???
    return tree;
}

function stringifyNamesInPrototype(prototypeTree) {
    function stringifyName(names) {
        var nameStr = '';
        if (Object.prototype.toString.call(names) === '[object Array]') {
            // 数组去重
            var nameObj = {};
            names.forEach(function(name) {
                var nameStr = stringifyName(name);
                if (nameObj[nameStr] === undefined) {
                    nameObj[nameStr] = 1;
                } else {
                    nameObj[nameStr]++;
                }
            });
            nameStr = Object.keys(nameObj)
                .map(function(name) {
                    var count = nameObj[name];
                    return name + ' (' + count + ') ';
                })
                .join(',');
        } else if (typeof names !== 'string') {
            nameStr = names.toString();
        } else {
            nameStr = names;
        }
        return nameStr;
    }
    // 遍历树，并 stringify names
    return applyToTreeNodes(prototypeTree, ['text', 'name'], stringifyName);
}

function getPrototypeTree(todos) {
    // Make sure todos is an array
    if (Object.prototype.toString.call(todos) !== '[object Array]') {
        todos = [todos];
    }

    /**
     * interface TodoInterface {
     *   value: any;
     *   _label: string;
     * }
     */

    // 对每一个 todo 获取其原型链
    var protoChainArr = todos.map(function(todo) {
        var curProtoObj = todo.value;

        // 遍历获取原型链
        var protoChain = []; // ProtoIdentInterface[]
        while (curProtoObj !== null) {
            /**
             * interface ProtoIdentInterface {
             *   value: any;
             *   properties: any[];
             *   constructor: any;
             *   name: string;
             *   _label?: string;
             * }
             */
            var protoIdent = {
                value: curProtoObj,
                properties: Object.getOwnPropertyNames(curProtoObj),
                constructor: curProtoObj.constructor,
                name:
                    curProtoObj.constructor.name +
                    (curProtoObj.hasOwnProperty('constructor')
                        ? '.prototype'
                        : ' instance')
            };
            protoChain.push(protoIdent);
            curProtoObj = curProtoObj.__proto__;
        }
        protoChain.push({
            value: null
        });

        // 记录 _label
        protoChain[0]['_label'] = todo._label;

        return protoChain;
    });
    console.log('[test] #pt# protoChainArr :', protoChainArr);

    // Initialization
    var prototypes = {
        text: {
            name: 'null'
        },
        HTMLclass: 'root',
        _value: null,
        children: []
    };
    // ProtoIdentInterface[][]
    protoChainArr.forEach(function(protoChain) {
        // var keyArr = [];
        var current = prototypes;
        // 遍历每个原型链
        _.forEachRight(protoChain, function(proto, index) {
            // 即 proto 为 null（在原型链末尾）时
            if (index === protoChain.length - 1) {
                if (!_.isEqual(proto.value, prototypes._value)) {
                    console.log("[test] It's IMPOSSIABLE!!");
                    return false;
                }
            } else {
                // keyArr.push('children');
                // 对 current.children 初始化
                if (current.children === undefined) {
                    current.children = [];
                }

                var bingoIndex = -1;
                current.children.forEach(function(child, index) {
                    if (_.isEqual(child._value, proto.value)) {
                        bingoIndex = index;
                        if (child._value !== proto.value) {
                            console.log(
                                '[test] #where# NOT === ! proto.value :',
                                proto.value
                            );
                        }
                    }
                });
                if (bingoIndex === -1) {
                    bingoIndex = current.children.length;
                    current.children.push({
                        text: {
                            name: [proto._label || proto.name],
                            desc:
                                Object.prototype.toString.call(proto.value) +
                                ' : ' +
                                proto.properties
                                    .filter(function(key) {
                                        // if (key[0] !== '$') {
                                            return true;
                                        // }
                                    })
                                    .join(', ')
                        },
                        _value: proto.value
                    });
                } else {
                    //  keyArr.push(bingoIndex);
                    var names = current.children[bingoIndex].text.name.push(
                        proto._label || proto.name
                    );
                }
                current = current.children[bingoIndex];
            }
        });
    });
    console.log('[test] #where# prototypes :', prototypes);

    prototypes = stringifyNamesInPrototype(prototypes);

    return prototypes;
}

window.onload = function() {
    // Custom Prototype Inheritance
    function Animal() {
        this.species = '动物';
    }
    Animal.prototype.sleep = function() {
        console.log('.zZ');
    };
    function Cat(name, color) {
        // this.species = '猫';
        this.name = name;
        this.color = color;
    }
    Cat.prototype = new Animal();
    Cat.prototype.constructor = Cat;
    var yarn = new Cat();

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
        // { value: Object.create(null), _label: 'Object.create(null)' },
        // { value: new Date(), _label: 'new Date()' },
        { value: function test() {}, _label: 'function test() {}' },
        { value: history, _label: 'history' },
        { value: Function.prototype, _label: 'Function.prototype' },
        { value: Function.__proto__, _label: 'Function.__proto__' },
        { value: Function, _label: 'Function' },
        { value: Date, _label: 'Date' },
        { value: Object, _label: 'Object' },
        { value: yarn, _label: 'yarn' },
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
