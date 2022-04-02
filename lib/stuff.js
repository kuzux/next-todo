import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'stuff.db'
});

export class Item extends Sequelize.Model {
    static statuses = ['todo', 'completed', 'ignored'];
}

Item.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    completedAt: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
}, { sequelize });

// Item.sync({ force: true });

export let za = "xd";