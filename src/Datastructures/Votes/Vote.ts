import VoteStructure from "./VoteStructure";

export default class Vote<T> implements VoteStructure{
    private readonly data: T;
    private readonly startTime: number;
    private readonly duration: number;
    private votesFor: number;
    private votesAgainst: number;
    private readonly callbackSuccess: (data: T) => {} ;
    private readonly callbackFailure: (data: T) => {} ;

    constructor(data: T, duration: number, callbackSuccess: (data: T) => {}, callbackFailure: (data: T) => {}) {
        this.data = data;
        this.duration = duration;
        this.callbackSuccess = callbackSuccess;
        this.callbackFailure = callbackFailure;
        this.votesFor = 0;
        this.votesAgainst = 0;
        this.startTime = Date.now();
    }

    public voteFor() {
        this.votesFor += 1;
    }

    public voteAgainst() {
        this.votesAgainst += 1;
    }

    public checkAlive(): boolean {
        let elapsed: number = Date.now() - this.startTime;
        return elapsed < this.duration;
    }

    public attemptVoteResolution(): boolean {
        if(this.checkAlive()) {
            return false;
        } else {
            this.preformCallback();
            return true;
        }
    }

    private preformCallback() {
        if (this.votesFor > this.votesAgainst) {
            this.callbackSuccess(this.data);
        } else {
            this.callbackFailure(this.data);
        }
    }
}