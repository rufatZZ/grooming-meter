class Votes {
    constructor() {
        this.votes = [];
    }

    addVote(vote) {
        const voterIndex = this.votes.findIndex(user => user.id === vote.id);
        if (~voterIndex) {
            this.votes[voterIndex] = vote;
        } else {
            this.votes.push(vote);
        }
    }

    removeVote(id) {
        const voterIndex = this.votes.findIndex(user => user.id === id);
        if (~voterIndex) {
            return this.votes.splice(voterIndex, 1);
        }
    }

    getList() {
        return this.votes;
    }

    reset() {
        this.votes = [];
        return this.votes;
    }
}

module.exports = { Votes };
