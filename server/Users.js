class Users {
  constructor() {
    this.users = [];
  }

  add(user) {
    this.users.push(user);
  }

  getUser(id) {
    return this.users.find(user => user.id === id);
  }

  userVoted(id) {
    const user = this.getUser(id);
    if (user) {
      const userIndex = this.users.findIndex(user => user.id === id);
      this.users[userIndex].isVoted = true;
    }
  }

  remove(id) {
    const user = this.getUser(id);
    if (user) {
      const userIndex = this.users.findIndex(user => user.id === id);
      this.users.splice(userIndex, 1);
    }
  }

  getList() {
    return this.users;
  }
}

module.exports = { Users };
