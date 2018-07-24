/**
 * TODO:
 * - 抽出一种统一的数据结构，再适配成 treant 所需要的，更灵活。
 * - 边界 case：`Object.create(null)` from [故意创建不具有典型原型链继承的对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype)
 * - Object.prototype 属性的属性特性 more on: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype
 */

function PrototypeTree(value, name) {
    this._value = value || null;
    this._nameArr = [name || '' + this._value];
    this.children = [];
}
PrototypeTree.prototype.appendName = function(name) {
    this._nameArr.push(name);
};
/**
 *  深度优先的 applyToAllNodes 方法
 */
PrototypeTree.prototype.applyToAllNodes = function applyToAllNodes(
    srcLocates,
    destLocates,
    fn
) {
    // 对当前节点应用 fn
    var src = this;
    srcLocates.forEach(function(locate) {
        src = src[locate];
    });

    var destObjLocates = destLocates.slice(0, destLocates.length - 1);
    var destPropLocate = destLocates[destLocates.length - 1];
    var destObj = this;
    destObjLocates.forEach(function(locate) {
        if (destObj[locate] === undefined) {
            destObj[locate] = {};
        }
        destObj = destObj[locate];
    });

    destObj[destPropLocate] = fn(src);

    if (this.children) {
        this.children.forEach(function(childTree) {
            /**
             * ImoNote:
             * 因为不确定 childTree 是不是一个 PrototypeTree 的实例，
             * 所以这里保险起见使用 .call 调用，而不是 childTree.applyToAllNodes
             * TODO: 这里有可能使用尾递归优化么？
             */
            applyToAllNodes.call(childTree, srcLocates, destLocates, fn);
        });
    }

    return this;
};

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
             *   // properties: any[];
             *   // constructor: any;
             *   name: string;
             *   _label?: string;
             * }
             */
            var protoIdent = {
                value: curProtoObj,
                // properties: Object.getOwnPropertyNames(curProtoObj),
                // constructor: curProtoObj.constructor,
                name:
                    curProtoObj.constructor.name +
                    (curProtoObj.hasOwnProperty('constructor')
                        ? '.prototype'
                        : ' instance')
            };
            protoChain.push(protoIdent);
            curProtoObj = Object.getPrototypeOf(curProtoObj); // curProtoObj.__proto__;
        }
        protoChain.push({
            value: null
        });

        // 记录 _label
        protoChain[0]['_label'] = todo._label;

        return protoChain;
    });
    console.log('[test] #getPrototypeTree# protoChainArr :', protoChainArr);

    // Initialization
    // {
    //     _value: null,
    //     _nameArr: ['null'],
    //     children: []
    // };
    var prototypeTree = new PrototypeTree();
    console.log(
        '[test] #getPrototypeTree# After initialization, prototypeTree :',
        _.cloneDeep(prototypeTree)
    );
    // ProtoIdentInterface[][]
    protoChainArr.forEach(function(protoChain) {
        // var keyArr = [];
        var current = prototypeTree;
        // 遍历每个原型链
        _.forEachRight(protoChain, function(proto, index) {
            // 即 proto 为 null（在原型链末尾）时
            if (index === protoChain.length - 1) {
                if (!_.isEqual(proto.value, prototypeTree._value)) {
                    console.log("[test] #getPrototypeTree# It's IMPOSSIABLE!!");
                    return false;
                }
            } else {
                // 原型链除了值为 null 的第一项外所有项都执以下逻辑：
                // keyArr.push('children');
                // 对 current.children 初始化
                if (current.children === undefined) {
                    current.children = [];
                }

                var bingoIndex = -1;
                // 为 proto 找到对应的孩子节点，记录角标到 bingoIndex
                current.children.forEach(function(child, index) {
                    if (_.isEqual(child._value, proto.value)) {
                        bingoIndex = index;
                        if (child._value !== proto.value) {
                            // lodash 的 isEqual 深比较判断相同，但是引用不同的情况
                            console.log(
                                '[test] #getPrototypeTree# 非 ===, proto.value :',
                                proto.value
                            );
                        }
                    }
                });

                var name = proto._label || proto.name;
                if (bingoIndex === -1) {
                    // 如果在孩子节点中没有找到 isEqual _value 的节点，那么基于 proto 创建孩子节点
                    bingoIndex = current.children.length;
                    current.children.push(new PrototypeTree(proto.value, name));
                } else {
                    // 如果在孩子节点中找到了 isEqual _value 的节点，那么记录到该孩子节点的 name 数组中
                    // keyArr.push(bingoIndex);
                    current.children[bingoIndex].appendName(name);
                }
                // 指针指向上面新创建的或者深比较值相同的孩子节点
                current = current.children[bingoIndex];
            }
        });
    });
    console.log(
        '[test] #getPrototypeTree# prototypeTree :',
        _.cloneDeep(prototypeTree)
    );

    return prototypeTree;
}

// 供外部调用的函数，可以获得符合 Treant 要求的数据格式
function getThenTransformPrototypeTree(todos) {
    // 遍历树，并 stringify names
    return getPrototypeTree(todos)
        .applyToAllNodes(['_nameArr'], ['text', 'name'], stringifyName)
        .applyToAllNodes([], ['text', 'desc'], generateDescription);
}

// 字符串化名称
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
                return count > 1 ? name + ' (' + count + ') ' : name;
            })
            .join(',');
    } else if (typeof names !== 'string') {
        nameStr = names.toString();
    } else {
        nameStr = names;
    }
    return nameStr;
}
// 字符串化描述
function generateDescription(node) {
    var desc = '';
    if (node._value) {
        desc =
            Object.prototype.toString.call(node._value) +
            ' : ' +
            Object.getOwnPropertyNames(node._value)
                .sort(function(a, b) {
                    // 对长度不定的 iterate 进行升序排序
                    var length = Math.min(a.length, b.length);
                    for (var i = 0; i < length; i++) {
                        var charCodeA = a.charCodeAt(i);
                        var charCodeB = b.charCodeAt(i);
                        if (charCodeA !== charCodeB) {
                            return charCodeA - charCodeB;
                        }
                    }
                    return a.length - b.length;
                })
                .filter(function(key) {
                    // if (key[0] !== '$') {
                    return true;
                    // }
                })
                .join(', ');
    }
    return desc;
}
