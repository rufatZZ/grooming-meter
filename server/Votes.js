const { groupBy } = require('./utils/array');

class Votes {
    constructor() {
        this.votes = [];
        this.isShowing = false;
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

    getFormattedList() {
        let result = {};
        if (this.votes) {
            result = { votes: groupBy(this.votes, 'vote'), length: this.votes.length };
        } else {
            result = { votes: [], length: 0 };
        }

        return result;
    }

    setShowViteList(show){
        this.isShowing = show;
    }

    get showVoteList(){
        return this.isShowing;
    }

    reset() {
        this.votes = [];
        return this.votes;
    }
}

module.exports = { Votes };
