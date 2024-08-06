// 表达式解析器模块
class ExpressionParser {
    /**
     * 解析表达式
     * @param {string} expression - 要解析的表达式
     * @returns {Node} - 解析后的语法树根节点
     */
    parse(expression) {
        const tokens = this.tokenize(expression);
        return this.parseTokens(tokens);
    }

    /**
     * 将表达式转换为标记数组
     * @param {string} expression - 要转换的表达式
     * @returns {string[]} - 标记数组
     */
    tokenize(expression) {
        return expression.match(/\d+|\+|\-|\*|\/|\(|\)|\[|\]|\{|\}/g);
    }

    /**
     * 解析标记数组
     * @param {string[]} tokens - 标记数组
     * @returns {Node} - 解析后的语法树根节点
     */
    parseTokens(tokens) {
        const stack = [];
        const output = [];

        for (const token of tokens) {
            if (["(", "[", "{"].includes(token)) {
                stack.push(token);
            } else if ([")", "]", "}"].includes(token)) {
                while (
                    stack.length > 0 &&
                    !this.isMatchingPair(stack[stack.length - 1], token)
                ) {
                    output.push(stack.pop());
                }
                stack.pop(); // 移除开括号
            } else if (["+", "-", "*", "/"].includes(token)) {
                while (
                    stack.length > 0 &&
                    this.precedence(stack[stack.length - 1]) >=
                        this.precedence(token)
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

        return this.buildTree(output);
    }

    /**
     * 检查括号是否匹配
     * @param {string} open - 开括号
     * @param {string} close - 闭括号
     * @returns {boolean} - 是否匹配
     */
    isMatchingPair(open, close) {
        return (
            (open === "(" && close === ")") ||
            (open === "[" && close === "]") ||
            (open === "{" && close === "}")
        );
    }

    /**
     * 获取运算符优先级
     * @param {string} operator - 运算符
     * @returns {number} - 优先级
     */
    precedence(operator) {
        if (operator === "+" || operator === "-") return 1;
        if (operator === "*" || operator === "/") return 2;
        return 0;
    }

    /**
     * 构建语法树
     * @param {string[]} postfix - 后缀表达式
     * @returns {Node} - 语法树根节点
     */
    buildTree(postfix) {
        const stack = [];

        for (const token of postfix) {
            if (!["+", "-", "*", "/"].includes(token)) {
                stack.push(new Node(token));
            } else {
                const right = stack.pop();
                const left = stack.pop();
                stack.push(new Node(token, left, right));
            }
        }

        return stack[0];
    }
}

// 语法树节点类
class Node {
    /**
     * 创建一个新的节点
     * @param {string} value - 节点值
     * @param {Node} left - 左子节点
     * @param {Node} right - 右子节点
     */
    constructor(value, left = null, right = null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

// 树打印器类
class TreePrinter {
    /**
     * 打印语法树
     * @param {Node} node - 要打印的节点
     * @param {string} prefix - 前缀字符串
     * @param {boolean} isLeft - 是否为左子树
     */
    static print(node, prefix = "", isLeft = true) {
        if (node === null) return;

        const newPrefix = prefix + (isLeft ? "│   " : "    ");
        if (node.right) this.print(node.right, newPrefix, false);

        console.log(prefix + (isLeft ? "└── " : "┌── ") + node.value);

        if (node.left) this.print(node.left, newPrefix, true);
    }
}

// 表达式验证器类
class ExpressionValidator {
    /**
     * 检查表达式是否完整（括号匹配）
     * @param {string} expression - 要检查的表达式
     * @returns {boolean} - 表达式是否完整
     */
    static isComplete(expression) {
        const stack = [];
        for (const token of expression) {
            if (["(", "[", "{"].includes(token)) {
                stack.push(token);
            } else if ([")", "]", "}"].includes(token)) {
                if (
                    stack.length === 0 ||
                    !this.isMatchingPair(stack[stack.length - 1], token)
                ) {
                    return false;
                }
                stack.pop();
            }
        }
        return stack.length === 0;
    }

    /**
     * 检查括号是否匹配
     * @param {string} open - 开括号
     * @param {string} close - 闭括号
     * @returns {boolean} - 是否匹配
     */
    static isMatchingPair(open, close) {
        return (
            (open === "(" && close === ")") ||
            (open === "[" && close === "]") ||
            (open === "{" && close === "}")
        );
    }
}

// 主程序
(() => {
    const expression = "(3 + [4 * {5 - 2}]) / 2";

    if (!ExpressionValidator.isComplete(expression)) {
        console.error("无效的表达式");
        return;
    }

    const parser = new ExpressionParser();
    const tree = parser.parse(expression);

    console.log(`\n表达式:, ${expression}\n`);

    TreePrinter.print(tree);
})();
