import DataManager from "./DataManager";
import RelationshipTree from "../Datastructures/TreeStructure/RelationshipTree";
import Tree from "../Datastructures/TreeStructure/Tree";
import CommunityInfo from "../Datastructures/CommunityInfo/CommunityInfo";
import CommunityDataStructure from "../Datastructures/CommunityInfo/CommunityDataStructure";

export default class RealDataManager implements DataManager {
    private treeStructure: RelationshipTree<CommunityDataStructure>;

    constructor() {
        this.treeStructure = new Tree<CommunityDataStructure>();
    }

    public retrieveCommunityInformation(community: string): undefined | {} {
        let communityInfo: CommunityInfo = this.treeStructure.retrieveCommunity(community);
        if (communityInfo) {
            return this.communityInfoToObject(communityInfo);
        } else {
            return undefined;
        }
    }

    private communityInfoToObject(comInfo: CommunityInfo): {} {
        return {
            "name": comInfo.getName(),
            "href": comInfo.getHref(),
            "description": comInfo.getDesc()
        };
    }

}