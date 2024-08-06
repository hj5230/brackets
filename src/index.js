import { ExpressionValidator } from "./utils/validator.js";
import { ExpressionParser } from "./utils/parser.js";
import { TreePrinter } from "./utils/node.js";

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
