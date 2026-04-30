const path = require("path");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/db");
const { errorHandler } = require("./middlewares/errorMiddleware");
const createLimiter = require("./middlewares/rateLimitMiddleware");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
dotenv.config();
connectDb();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(xss());

const { authRouter, userRouter } = require("./routes/userRoutes");

app.use("/api/auth", createLimiter(20), authRouter);
app.use("/api/users", createLimiter(100), userRouter);
app.use("/api/categories", createLimiter(500), require("./routes/categoryRoutes"));
app.use("/api/subcategories", createLimiter(500), require("./routes/subcategoryRoutes"));
app.use("/api/fields", createLimiter(300), require("./routes/fieldTemplateRoutes"));
app.use("/api/ads", createLimiter(500), require("./routes/adRoutes"));
app.use("/api/saved", createLimiter(300), require("./routes/savedAdRoutes"));
app.use("/api/admin", createLimiter(100), require("./routes/admin/index"));

app.use(errorHandler);
app.listen(port, () => console.log("Server Started On Port " + port));
