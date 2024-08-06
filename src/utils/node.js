// 语法树节点类
export class Node {
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
export class TreePrinter {
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
