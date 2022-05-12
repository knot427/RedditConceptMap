"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tree {
    getAncestors(nodeInput) {
        let node = this.cleanNodeInput(nodeInput);
        let toCheck = node.getParents();
        let completed = [];
        while (toCheck.length > 0) {
            let selected = toCheck.pop();
            if (!completed.includes(selected)) {
                let selectedNode = this.lookupID(selected);
                toCheck.concat(selectedNode.getParents());
                completed.push(selected);
            }
        }
        return completed.sort();
    }
    simplifyIDList(parentIds, selfID) {
        if (typeof (selfID) === 'undefined') {
            selfID = Number.MAX_SAFE_INTEGER;
        }
        let toCheck = [];
        for (const id of parentIds) {
            toCheck.concat(this.lookupID(id).getParents());
        }
        let completed = [];
        while (toCheck.length > 0 && parentIds.length > 1) {
            let selected = toCheck.pop();
            if (!completed.includes(selected)) {
                parentIds = parentIds.filter((id) => id !== selected);
                if (selfID === selected)
                    throw new ContainsCyclicalReference("Contains Cyclical Reference");
                let selectedNode = this.lookupID(selected);
                toCheck.concat(selectedNode.getParents());
                completed.push(selected);
            }
        }
        return parentIds;
    }
    lookupID(id) {
        let node = this.treeMap.get(id);
        if (!(node === undefined)) {
            return node;
        }
        else {
            throw new IDNotFound("Unable to find id: " + id + " in treeMap.");
        }
    }
    enroll(nodeInput) {
        let node = this.cleanNodeInput(nodeInput);
        let returnedID = this.nextAvailableID;
        this.nextAvailableID = 1 + returnedID;
        this.treeMap.set(returnedID, node);
        node.getParents().forEach((id) => this.treeMap.get(id).addChild(returnedID));
        return returnedID;
    }
    removeNode(nodeInput) {
        let node = this.cleanNodeInput(nodeInput);
        node.getParents().forEach((pid) => this.treeMap.get(pid).removeChild(node.getId()));
        this.treeMap.delete(node.getId());
    }
    cleanNodeInput(nodeInput) {
        let node;
        if (typeof (nodeInput) === "number") {
            node = this.lookupID(nodeInput);
        }
        else {
            node = nodeInput;
        }
        return node;
    }
}
exports.default = Tree;
class IDNotFound extends Error {
}
class ContainsCyclicalReference extends Error {
}
//# sourceMappingURL=Tree.js.map