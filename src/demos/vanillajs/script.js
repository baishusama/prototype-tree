console.log('Treant :', Treant);

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
    /**
     * ImoNote: 如果没有上面这行，原型树图中的“Cat.prototype”会变成“Animal instance”
     * 原因见 prototype-tree.js 中 protoIdent 的 name 属性的确定逻辑
     */

    var yarn = new Cat();

    var todos = [
        // { value: Object.create(null), _label: 'Object.create(null)' },
        { value: function test() {}, _label: 'function test() {}' },
        { value: Function, _label: 'Function（构造函数视为一个实例对象）' },
        { value: Function.prototype, _label: 'Function.prototype' },
        { value: Function.__proto__, _label: 'Function.__proto__' },
        {
            value: Object.getPrototypeOf(Function),
            _label: 'Object.getPrototypeOf(Function)'
        },
        // { value: new Date(), _label: 'new Date()' },
        { value: Date, _label: 'Date' },
        {
            value: history.constructor,
            _label: 'history.constructor 即 History'
        },
        { value: Object, _label: 'Object' },
        { value: yarn, _label: 'yarn' },
        { value: history, _label: 'history' }
    ];
    var data = {
        chart: {
            container: '#tree',
            levelSeparation: 100,
            siblingSeparation: 25,
            subTeeSeparation: 25,
            rootOrientation: 'EAST',

            node: {
                HTMLclass: 'prototype-draw',
                drawLineThrough: false
            },
            connectors: {
                type: 'straight',
                style: {
                    'stroke-width': 2,
                    stroke: '#ccc'
                }
            }
        },

        nodeStructure: getThenTransformPrototypeTree(todos)
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
