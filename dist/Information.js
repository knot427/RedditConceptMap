"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Information {
    constructor(officialName, title, description, href) {
        this.officialName = officialName;
        this.title = title;
        this.description = description;
        this.href = href;
    }
    getOfficialName() {
        return this.officialName;
    }
    getTitle() {
        return this.title;
    }
    getDescription() {
        return this.description;
    }
    getHref() {
        return this.href;
    }
}
exports.default = Information;
//# sourceMappingURL=Information.js.map