// storages/usersStorage.js
// This class lets us simulate interacting with a database.

class UsersStorage {
    constructor () {
        this.storage = {};
        this.id = 0;
    }

    addUser({ firstName, lastName, email, age = 0, bio = "" }) {
        const id = this.id;
        this.storage[id] = { id, firstName, lastName, email, age, bio };
        this.id++;
    }

    getUsers() {
        return Object.values(this.storage);
    }

    getUser(id) {
        return this.storage[id];
    }

    getUserByEmail(email) {
        const users = Object.values(this.storage);
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === email) {
                return users[i];
            }
        }
        return null;
    }

    updateUser(id, { firstName, lastName, email, age, bio }) {
        this.storage[id] = { id, firstName, lastName, email, age, bio };
    }
    
    deleteUser(id) {
        delete this.storage[id];
    }
}

module.exports = new UsersStorage();