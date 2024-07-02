import mongoose from "mongoose";

const MongoDbConnection = async() => {
    try {
    await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("Error in DataBase",error);
        process.exit(1)
    }
}
export default MongoDbConnection