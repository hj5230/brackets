import { Node } from "./node.js";

// 表达式解析器模块
export class ExpressionParser {
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
