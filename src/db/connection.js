import mongoose from "mongoose";

async function dbConnection() {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("db connected successfully");
    })
    .catch((error) => {
      console.log({
        message: "failed to  connect to db",
        error: error.message,
      });
    });
}

export default dbConnection;
