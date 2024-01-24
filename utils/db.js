const { Sequelize } = require('sequelize');
const pg = require('pg');
exports.sequelize = new Sequelize("testdb", "postgres", "greenage", {
    host: '192.168.100.17',
    dialect: 'postgres'
    ,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
    ,
    dialectModule: pg
});

exports.sequelize2 = new Sequelize("dataofmysql", "postgres", "greenage", {
    host: '192.168.100.17',
    dialect: 'postgres'
    ,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
    ,
    dialectModule: pg
});
