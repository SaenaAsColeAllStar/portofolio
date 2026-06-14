import pg from 'pg';

const connectionString = "postgres://avnadmin:VNS_hpj4mnvuoL4IQWP4ao6@portfolio-coleallstar.e.aivencloud.com:15533/defaultdb";

console.log("Starting connection test...");
const client = new pg.Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => {
    console.log("Connected successfully!");
    return client.query("SELECT NOW()");
  })
  .then(res => {
    console.log("Query result:", res.rows[0]);
    return client.end();
  })
  .catch(err => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
