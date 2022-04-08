let db;
let bcrypt;
if(typeof window === 'undefined') {
    // only load the package on server side
    const Database = require("better-sqlite3");
    bcrypt = require('bcrypt');

    if(process.env.DB) {
        console.log(`using db ${process.env.DB}`);
        db = Database(process.env.DB);
    } else {
        console.log(`using db stuff.db`);
        db = Database('stuff.db');
    }
}

export class Item {
    // id int
    // name text
    // createdAt datetime
    // completedAt datetime?
    // status enum
    static statuses = { todo: 0, completed: 1, ignored: 2, deleted: 3 };

    static addItem(name, userId) {
        const now = new Date().toISOString();
        const info = db.prepare('insert into items (name, createdAt, userId) values (?, ?, ?)').run(name, now, userId);
        return db.prepare('select * from items where rowid = ?').get(info.lastInsertRowid);
    }

    static allItems() {
        return db.prepare('select * from items where status <> 3').all();
    }

    static itemsByUser(userId) {
        return db.prepare('select * from items where status <> 3 and userId = ?').all(userId);
    }

    static changeStatus(id, newStatus) {
        if(newStatus < 0 || newStatus >= this.statuses.size) {
            return false;
        }

        let completedAt = null;
        if(newStatus == this.statuses.completed) completedAt = new Date().toISOString();
        const info = db.prepare('update items set status = @status, completedAt = @completedAt where id = @id').run({
            id,
            completedAt,
            status: newStatus
        });

        return info.changes > 0;
    }
}

export class User {
    // id int
    // username text
    // passwordHash text
    static async signup(username, password) {
        const hash = await bcrypt.hash(password, 10);
        const info = db.prepare('insert into users (username, passwordHash) values (?, ?)').run(username, hash);
        if(info.changes == 0) return null;
        return info.lastInsertRowid;
    }

    static async verify(username, password) {
        const row = db.prepare('select id, passwordHash from users where username = ?').get(username);
        if(!row) return null;

        const res = await bcrypt.compare(password, row.passwordHash);
        if(!res) return null;
        return row.id;
    }

    static getById(id) {
        const row = db.prepare('select * from users where id = ?').get(id);
        if(!row) return null;

        delete row['passwordHash'];
        return row;
    }
}

export let za = "xd";