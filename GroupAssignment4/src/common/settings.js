/**
 * API setting JS file.
 */
module.exports = {
    server: {
        port: 8080 || process.env.SERVER_PORT,
    },
    database: {
        url: 'mongodb+srv://mongoclusterconestoga.qmnph5u.mongodb.net' || process.env.DB_URL,
        username: 'apiconestoga' || process.env.DB_USERNAME,
        password: 'bKkaXG3iTgWZHmgL' || process.env.DB_PASSWORD,
        dbName: 'WebAS4' || process.env.DB_DATABASE_NAME
    },
    jwt: {
        secret: 'jkaa8d-aW!@7f' || process.env.JWT_SECRET,
        expiresIn: '24h' || process.env.JWT_EXPIRATION,
    },
    pricing: {
        taxes: 0.13 || process.env.PRICING_TAXES_PERCENT,
    }
};
