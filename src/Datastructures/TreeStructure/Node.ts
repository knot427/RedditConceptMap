import Tree from "./Tree";

export default class Node<T> {
    private parents: number[];
    private children: number[];
    private id: number;
    private name: string;
    private readonly data: T;

    public constructor(tree: Tree<T>, parents: number[], children: number[], name: string, data: T) {
        this.parents = parents;
        this.children = children;
        this.name = name;
        this.data = data;
        this.enroll(tree);
    }

    private enroll(tree: Tree<T>) {
        this.parents = tree.simplifyIDList(this.parents);
        this.id = tree.enroll(this);
    }

    public addChild(id: number) {
        this.children.push(id);
    }

    public getId(): number {
        return this.id;
    }

    public removeChild(id: number) {
        this.children = this.children.filter((cid: number) => cid !== id);
    }

    public getData(): T {
        return this.data;
    }

    public getParents(): number[] {
        return this.parents;
    }
}