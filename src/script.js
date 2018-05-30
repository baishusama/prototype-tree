console.log('Treant :', Treant);

function getPrototypeTree(todos) {
    // Make sure todos is an array
    if (Object.prototype.toString.call(todos) !== '[object Array]') {
        todos = [todos];
    }

    // Initialization
    var prototypes = {
        text: {
            name: 'null'
        },
        HTMLclass: 'root',
        _value: null,
        children: []
    };

    var protoChainArr = todos.map(function(todo) {
        var obj = todo.value;
        obj.label = todo.label;
        var protoChain = [];
        while (obj !== null) {
            /**
             * interface ProtoIdentInterface {
             *   value: any;
             *   constructor: any;
             *   protoName: string;
             *   label?: string;
             * }
             */
            var protoIdent = {
                value: obj,
                constructor: obj.constructor
            };

            if (obj.label) {
                protoIdent.label = obj.label;
            }

            if (obj.hasOwnProperty('constructor')) {
                protoIdent.protoName = obj.constructor.name + '.prototype';
            } else {
                protoIdent.protoName = obj.constructor.name + ' instance';
            }

            protoChain.push(protoIdent);
            obj = obj.__proto__;
        }
        protoChain.push({
            value: null
        });
        return protoChain;
    });
    console.log('[test] #pt# protoChainArr :', protoChainArr);
    protoChainArr.forEach(function(protoChain) {
        var lastIndex = protoChain.length - 1;
        var keyArr = [];
        var current = prototypes;
        _.forEachRight(protoChain, function(proto, index) {
            if (index === lastIndex) {
                if (!_.isEqual(proto.value, prototypes._value)) {
                    console.log('[test] #where# impossible...');
                    return false;
                }
            } else {
                keyArr.push('children');
                var L = keyArr.length;
                if (current[keyArr[L - 1]] === undefined) {
                    current[keyArr[L - 1]] = [];
                }
                var bingoIndex = -1;
                current[keyArr[L - 1]].forEach(function(child, index) {
                    if (_.isEqual(child._value, proto.value)) {
                        bingoIndex = index;
                    }
                });
                if (bingoIndex !== -1) {
                    keyArr.push(bingoIndex);
                } else {
                    bingoIndex = current[keyArr[L - 1]].length;
                    current[keyArr[L - 1]].push({
                        text: {
                            name: proto.label || proto.protoName,
                            desc: Object.prototype.toString.call(proto.value)
                        },
                        _value: proto.value
                    });
                }
                current = current[keyArr[L - 1]][bingoIndex];
                // if()
                // TODO: 需要遍历来找到当前位置？
            }
        });
    });
    console.log('[test] #where# prototypes :', prototypes);

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

    var todos = [
        { value: new Date(), label: 'new Date()' },
        { value: function test() {}, label: 'function test() {}' },
        { value: yarn, label: 'yarn' }
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
