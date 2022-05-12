import Node from "./Node";
import RelationshipTree from "./RelationshipTree";

export default class Tree<T> implements RelationshipTree{
    private treeMap: Map<number, Node<T>>;
    private nextAvailableID: number;

    public getAncestors(nodeInput: number | Node<T>): number[] {
        let node: Node<T> = this.cleanNodeInput(nodeInput);

        let toCheck: number[] = node.getParents();
        let completed: number[] = [];
        while (toCheck.length > 0) {
            let selected: number = toCheck.pop();
            if (!completed.includes(selected)) {
                let selectedNode: Node<T> = this.lookupID(selected);
                toCheck.concat(selectedNode.getParents());
                completed.push(selected);
            }
        }
        return completed.sort();
    }

    public simplifyIDList(parentIds: number[], selfID?: number): number[] {
        if (typeof (selfID) === 'undefined') {
            selfID = Number.MAX_SAFE_INTEGER;
        }

        let toCheck: number[] = [];

        for (const id of parentIds) {
            toCheck.concat(this.lookupID(id).getParents());
        }
        let completed: number[] = [];

        while (toCheck.length > 0 && parentIds.length > 1) {
            let selected: number = toCheck.pop();
            if (!completed.includes(selected)) {
                parentIds = parentIds.filter((id: number) => id !== selected);
                if (selfID === selected) throw new ContainsCyclicalReference("Contains Cyclical Reference");
                let selectedNode: Node<T> = this.lookupID(selected);
                toCheck.concat(selectedNode.getParents());
                completed.push(selected);
            }
        }

        return parentIds;
    }

    public lookupID(id: number): Node<T> {
        let node: Node<T> = this.treeMap.get(id);
        if (!(node === undefined)) {
            return node;
        } else {
            throw new IDNotFound("Unable to find id: " + id + " in treeMap.");
        }
    }


     public enroll(nodeInput: Node<T> | number): number {
        let node: Node<T> = this.cleanNodeInput(nodeInput);

        let returnedID = this.nextAvailableID;
        this.nextAvailableID = 1 + returnedID;
        this.treeMap.set(returnedID, node);
        node.getParents().forEach((id: number) => this.treeMap.get(id).addChild(returnedID));
        return returnedID;
     }

     public removeNode(nodeInput: Node<T> | number) {
         let node: Node<T> = this.cleanNodeInput(nodeInput);

         node.getParents().forEach((pid: number) => this.treeMap.get(pid).removeChild(node.getId()));
         this.treeMap.delete(node.getId());
     }

     private cleanNodeInput(nodeInput: Node<T> | number): Node<T> {
         let node: Node<T>;
         if (typeof (nodeInput) === "number") {
             node = this.lookupID(nodeInput);
         } else {
             node = nodeInput;
         }
         return node;
     }

}

class IDNotFound extends Error {}
class ContainsCyclicalReference extends Error {}