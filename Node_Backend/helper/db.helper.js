// Database configuration
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

// Sequelize ORM
const { Sequelize } = require("sequelize");

module.exports = db = {};

initialize();

async function initialize() {

    // Initialize Sequelize instance for PostgreSQL
    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        dialect: "postgres",
        host: DB_HOST,
        port: DB_PORT,
        logging: false, 
        dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Use this cautiously, only for development
        }
        }// Optional: disable query logging
    });

    // Import models with Sequelize instance
    db.user = require("../model/user.model")(
        sequelize
    );

    db.lead = require("../model/lead.model")(
        sequelize
    );

    db.follow_up = require("../model/follow_up.model")(
        sequelize
    );

    db.task = require("../model/task.model")(
        sequelize
    );

    db.document = require("../model/document.model")(
        sequelize
    );

    db.password_reset = require("../model/password_reset.model")(
        sequelize
    );

    // Define model relationships

    /**
     * user has many leads
     * - A user can create/manage multiple leads
     */
    db.user.hasMany(db.lead, {
        foreignKey: "user_id",
    });

    db.lead.belongsTo(db.user, {
        foreignKey: "user_id",
    });

     /**
     * user has many folllow_up
     * - A user can create/manage multiple leads
     */
        db.user.hasMany(db.follow_up, {
            foreignKey: "user_id",
        });
    
        db.follow_up.belongsTo(db.user, {
            foreignKey: "user_id",
        });
    

    /**
     * lead has many followups
     * - A lead can have multiple follow-up entries
     */
    db.lead.hasMany(db.follow_up, {
        foreignKey: "lead_id",
    });

    db.follow_up.belongsTo(db.lead, {
        foreignKey: "lead_id",
    });

    /**
     * followup has many tasks
     * - Each follow-up may have multiple tasks associated with it
     */
    db.follow_up.hasMany(db.task, {
        foreignKey: "follow_up_id",
    });

    db.task.belongsTo(db.follow_up, {
        foreignKey: "follow_up_id",
    });

    /**
     * task has many documents
     * - A task may have multiple related documents
     */
    // db.task.hasMany(db.document, {
    //     foreignKey: "task_id",
    // });

    // db.document.belongsTo(db.task, {
    //     foreignKey: "task_id",
    // });

    // Sync all models with the database (creates tables if not exist)
    await sequelize.sync(
    {
        alter: true,
    })
    .then(() => {
        console.log('PostgreSQL Synced Successfully');
    })
    .catch(err => {
        console.error('Unable to connect to DB:', err);
    });

    // Export Sequelize instance
    db.sequelize = sequelize;
}