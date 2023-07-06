const express = require("express");
const app = express();
const connectDB = require("./config/db");
const userRouter = require("./routes/userRoute");
const staffRouter = require("./routes/StaffRoute");
const errorHandler = require("./middleware/errorHandling");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use("/user", userRouter);
app.use("/staff", staffRouter);
connectDB();

const Port = process.env.PORT || 5000;

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
