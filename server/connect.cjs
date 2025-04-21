const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

async function main() {
    const Db = process.env.ATLAS_URI;
    const client = new MongoClient(Db);
    try {
        await client.connect();
        const collections = await client.db("LaundroTrack").collections();
        collections.forEach((collection) => console.log(collection.collectionName));
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
