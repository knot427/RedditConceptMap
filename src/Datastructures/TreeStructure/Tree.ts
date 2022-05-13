import Node from "./Node";
import RelationshipTree from "./RelationshipTree";

export default class Tree<T> implements RelationshipTree<T>{
    private treeMap: Map<number, Node<T>>;
    private nameMap: Map<string, number>;
    private nextAvailableID: number;

    constructor() {
        // TODO temporary
        this.nextAvailableID = 0;
        this.nameMap = new Map<string, number>();
        this.treeMap = new Map<number, Node<T>>();
    }

    public getAncestors(nodeInput: number | Node<T>): number[] {
        let node: Node<T> = this.cleanNodeInput(nodeInput);

        let toCheck: number[] = node.getParents();
        let completed: number[] = [];
        while (true) {
            let selected: number | undefined = toCheck.pop();

            if (typeof selected === "undefined") {
                break;
            }

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

        while (parentIds.length > 1) {
            let selected: number | undefined = toCheck.pop();

            if (typeof selected === "undefined") {
                break;
            }

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
        let node: Node<T> | undefined = this.treeMap.get(id);
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
        node.getParents().forEach((id: number) => {
            let node = this.treeMap.get(id);
            if (typeof node !== "undefined") {
                node.addChild(returnedID);
            } else {
                throw new Error("Parent ID not found.")
            }
        });

        this.nameMap.set(node.getName(), returnedID);
        return returnedID;
     }

     public removeNode(nodeInput: Node<T> | number) {
         let node: Node<T> = this.cleanNodeInput(nodeInput);
         node.getParents().forEach((id: number) => {
             let node = this.treeMap.get(id);
             if (typeof node !== "undefined") {
                 node.removeChild(node.getId());
             } else {
                 throw new Error("Parent ID not found.")
             }
         });
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

    retrieveCommunity(name: string): T {
        let id: number | undefined = this.nameMap.get(name);
        if(typeof id === "undefined") {
            throw new Error("ID not found.");
        } else {
            return this.lookupID(id).getData();
        }
    }
}

class IDNotFound extends Error {}
class ContainsCyclicalReference extends Error {}