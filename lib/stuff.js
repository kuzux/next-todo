let db;
if(typeof window === 'undefined') {
    // only load the package on server side
    const Database = require("better-sqlite3");
    db = Database('stuff.db');
}

export class Item {
    // id int
    // name text
    // createdAt datetime
    // completedAt datetime?
    // status enum
    static statuses = ['todo', 'completed', 'ignored'];

    static addItem(name) {
        const now = new Date().toISOString();
        const info = db.prepare('insert into items (name, createdAt) values (?, ?)').run(name, now);
        return db.prepare('select * from items where rowid = ?').get(info.lastInsertRowid);
    }

    static allItems() {
        return db.prepare('select * from items').all();
    }

    static changeStatus(id, newStatus) {
        if(newStatus < 0 || newStatus >= this.statuses.length) {
            return false;
        }

        let completedAt = null;
        if(newStatus == 1) completedAt = new Date().toISOString();
        const info = db.prepare('update items set status = @status, completedAt = @completedAt where id = @id').run({
            id,
            completedAt,
            status: newStatus
        });

        return info.changes > 0;
    }
}

export let za = "xd";