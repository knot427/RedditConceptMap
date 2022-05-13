import CommunityInfo from "./CommunityInfo";

export default class CommunityDataStructure implements CommunityInfo {
    private readonly name:string;
    private readonly href:string;
    private readonly description:string;

    constructor(name: string, href: string, description: string) {
        this.name = name;
        this.href = href;
        this.description = description;
    }

    getDesc(): string {
        return this.description;
    }

    getHref(): string {
        return this.href;
    }

    getName(): string {
        return this.name;
    }

}