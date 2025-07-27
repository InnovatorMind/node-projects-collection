import mongoose from "mongoose";

try {
  await mongoose.connect(
    "mongodb://admin:admin@localhost:27017/todoApp?authSource=admin"
  );
  console.log("Database connected");
} catch (err) {
  console.log(err);
  process.exit(1);
}

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("Client Disconnected!");
  process.exit(0);
});


// import { MongoClient } from "mongodb";

// const client = new MongoClient("mongodb://127.0.0.1:27017/todoApp");

// export async function connectDB() {
//   await client.connect();
//   const db = client.db();
//   console.log("Database connected");
//   return db;
// }

// process.on("SIGINT", async () => {
//   await client.close();
//   console.log("Client Disconnected!");
//   process.exit(0);
// });
