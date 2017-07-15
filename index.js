var htmlparser = require("htmlparser");
var Radixer = require("radixer");
var radixer = new Radixer('abcdefghijklmnopqrstuvwxyz');
//refer to: http://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393
function traverseBF (nodes, root, callback) {
    var queue = [];
    queue.push({ node: nodes, parent: root });
    currentNode = queue.shift();
    while (currentNode) {
        var parent = callback(currentNode.node, currentNode.parent);
        if (currentNode.node.children) {
            for (var i = 0, length = currentNode.node.children.length; i < length; i++) {
                queue.push({ node: currentNode.node.children[i], parent: parent });
            }
        }
        currentNode = queue.shift();
    }

}

function createElement (node, parent, fnName) {
    let label = null
    let entry = null
    let exit = null
    let exit2 = null
    // create element
    let dom = ''
    dom += 'var ' + fnName + '=document.createElementNS("http://www.w3.org/2000/svg","' + node.name + '");'
    // only restore last one
    for (var i in node.attribs) {
        var attr = node.attribs[i]
        switch (i) {
            case 'data-label':
                label = attr
                break
            case 'data-entry':
                entry = attr
                break
            case 'data-exit':
                exit = attr
                break
            default:
                dom += fnName + '.setAttribute("' + i + '","' + attr + '");'
        }
    }
    // append to parent
    dom += parent + '.appendChild(' + fnName + ');'
    return {
        dom: dom,
        label: label,
        entry: entry,
        exit: exit,
    }
}
module.exports = function (source) {
    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error) {
        	throw new Error('Must only contain one svg')
        } else {
        	// TODO: tell some to user
        }
    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(source);
    domAST = handler.dom
    if (domAST.length !== 1) {
        throw new Error('Must only contain one svg')
    }
    if (domAST[0].type !== 'tag' && domAST[0].name !== 'svg') {
        throw new Error('Must contain one svg, and no any space character')
    }
    // function name, it should be increate when Declare another function
    var fnName = 0;
    var root = radixer.numberToString(fnName);
    var dom = 'var ' + root + '=document.createElementNS("http://www.w3.org/2000/svg","g");'
    // restore attr
    var entries = []
    var exits = []
    var labels = []
    fnName++;
    traverseBF(domAST[0], root, function (node, parent) {
        var name = radixer.numberToString(fnName);
        if (parent && node.type !== 'text') {
            el = createElement(node, parent, name);
            if (el.label) {
                labels.push('{el:' + name + ',attr:' + el.label + '}')
            }
            if (el.entry) {
                entries.push('{el:' + name + ',attr:' + el.entry + '}')
            }
            if (el.exit) {
                exits.push('{el:' + name + ',attr:' + el.exit + '}')
            }
            dom += el.dom;
            fnName++;
        }
        return name
    });
    return 'module.exports = function(){' + dom + 'return {' +
        '"root": ' + root + ',' +
        '"entries": [' + entries.join(',') + '],' +
        '"exits": [' + exits.join(',') + '],' +
        '"labels": [' + labels.join(',') + ']' +
        '}}';
};