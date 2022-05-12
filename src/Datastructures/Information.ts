export default class Information {
    private readonly officialName: string;
    private readonly title: string;
    private readonly description: string;
    private readonly href: string;

    public constructor(officialName: string, title: string, description: string, href: string) {
        this.officialName = officialName;
        this.title = title;
        this.description = description;
        this.href = href;
    }

    public getOfficialName(): string {
        return this.officialName;
    }

    public getTitle(): string {
        return this.title;
    }

    public getDescription(): string {
        return this.description;
    }

    public getHref(): string {
        return this.href;
    }

}