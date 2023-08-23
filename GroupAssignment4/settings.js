module.exports = {
  server: {
    host: "localhost",
    port: 8080,
  },
  database: {
    url: "mongodb://localhost:27017",
    dbName: "WebAS4",
    collections: {
      user: "user",
      product: "product",
      comment: "comment",
      cart: "cart",
      order: "order",
    },
  },
  jwt: {
    secret: "jkaa8d-aW!@7f",
  },
};
