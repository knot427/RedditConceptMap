"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vote {
    constructor(data, duration, callbackSuccess, callbackFailure) {
        this.data = data;
        this.duration = duration;
        this.callbackSuccess = callbackSuccess;
        this.callbackFailure = callbackFailure;
        this.startTime = Date.now();
    }
    voteFor() {
        this.votesFor += 1;
    }
    voteAgainst() {
        this.votesAgainst += 1;
    }
    checkAlive() {
        let elapsed = Date.now() - this.startTime;
        return elapsed < this.duration;
    }
    attemptVoteResolution() {
        if (this.checkAlive()) {
            return false;
        }
        else {
            this.preformCallback();
            return true;
        }
    }
    preformCallback() {
        if (this.votesFor > this.votesAgainst) {
            this.callbackSuccess(this.data);
        }
        else {
            this.callbackFailure(this.data);
        }
    }
}
exports.default = Vote;
//# sourceMappingURL=Vote.js.map