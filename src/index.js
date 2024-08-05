class Node {
    constructor(value, left = null, right = null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

function parseExpression(expression) {
    let tokens = tokenize(expression);
    return parseTokens(tokens);
}

function tokenize(expression) {
    return expression.match(/\d+|\+|\-|\*|\/|\(|\)|\[|\]|\{|\}/g);
}

function parseTokens(tokens) {
    let stack = [];
    let output = [];

    for (let token of tokens) {
        if (["(", "[", "{"].includes(token)) {
            stack.push(token);
        } else if ([")", "]", "}"].includes(token)) {
            while (
                stack.length > 0 &&
                !isMatchingPair(stack[stack.length - 1], token)
            ) {
                output.push(stack.pop());
            }
            stack.pop(); // Remove the opening bracket
        } else if (["+", "-", "*", "/"].includes(token)) {
            while (
                stack.length > 0 &&
                precedence(stack[stack.length - 1]) >= precedence(token)
            ) {
                output.push(stack.pop());
            }
            stack.push(token);
        } else {
            output.push(token);
        }
    }

    while (stack.length > 0) {
        output.push(stack.pop());
    }

    return buildTree(output);
}

function isMatchingPair(open, close) {
    return (
        (open === "(" && close === ")") ||
        (open === "[" && close === "]") ||
        (open === "{" && close === "}")
    );
}

function precedence(operator) {
    if (operator === "+" || operator === "-") return 1;
    if (operator === "*" || operator === "/") return 2;
    return 0;
}

function buildTree(postfix) {
    let stack = [];

    for (let token of postfix) {
        if (!["+", "-", "*", "/"].includes(token)) {
            stack.push(new Node(token));
        } else {
            let right = stack.pop();
            let left = stack.pop();
            stack.push(new Node(token, left, right));
        }
    }

    return stack[0];
}

function printTree(node, prefix = "", isLeft = true) {
    if (node === null) return;

    let newPrefix = prefix + (isLeft ? "│   " : "    ");
    if (node.right) printTree(node.right, newPrefix, false);

    console.log(prefix + (isLeft ? "└── " : "┌── ") + node.value);

    if (node.left) printTree(node.left, newPrefix, true);
}

function isComplete(expression) {
    let stack = [];
    for (let token of expression) {
        if (["(", "[", "{"].includes(token)) {
            stack.push(token);
        } else if ([")", "]", "}"].includes(token)) {
            if (
                stack.length === 0 ||
                !isMatchingPair(stack[stack.length - 1], token)
            ) {
                return false;
            }
            stack.pop();
        }
    }
    return stack.length === 0;
}

(() => {
    const expression = "(3 + [4 * {5 - 2}]) / 2";
    if (!isComplete(expression)) {
        console.error("Invalid expression");
        return;
    }
    const tree = parseExpression(expression);
    console.log("Expression:", expression);
    console.log("Parse Tree:");
    printTree(tree);
})();
