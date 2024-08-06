// 表达式验证器类
export class ExpressionValidator {
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
