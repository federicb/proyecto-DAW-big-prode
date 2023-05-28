module.exports = {
    database_dev:{
        host:process.env.DEV_MYSQL_HOST,
        user:process.env.DEV_MYSQL_USERNAME,
        password:process.env.DEV_MYSQL_PASSWORD,
        database:process.env.DEV_MYSQL_DATABASE,
    },
        database_prod:{
        host:process.env.PROD_MYSQL_HOST,
        user:process.env.PROD_MYSQL_USERNAME,
        password:process.env.PROD_MYSQL_PASSWORD,
        database:process.env.PROD_MYSQL_DATABASE,
        port:3306
    }
};