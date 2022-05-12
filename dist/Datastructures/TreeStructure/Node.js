"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Node {
    constructor(tree, parents, children, name, data) {
        this.parents = parents;
        this.children = children;
        this.name = name;
        this.data = data;
        this.enroll(tree);
    }
    enroll(tree) {
        this.parents = tree.simplifyIDList(this.parents);
        this.id = tree.enroll(this);
    }
    addChild(id) {
        this.children.push(id);
    }
    getId() {
        return this.id;
    }
    removeChild(id) {
        this.children = this.children.filter((cid) => cid !== id);
    }
    getData() {
        return this.data;
    }
    getParents() {
        return this.parents;
    }
}
exports.default = Node;
//# sourceMappingURL=Node.js.map