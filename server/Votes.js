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

  getList() {
    return this.votes;
  }

  reset() {
    return (this.votes = []);
  }
}

module.exports = { Votes };
