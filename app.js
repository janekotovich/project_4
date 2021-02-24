const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const crypto = require("crypto");
const morgan = require("morgan");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const redis = require("redis");
const session = require("express-session");
const redisStore = require("connect-redis")(session);
const client = redis.createClient();

const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());
app.set("view engine", "ejs");

//Set up Routers
const loginRouter = require("./routes/login");
app.use("/routes/login", loginRouter);

const indexRouter = require("./routes/index");
app.use("/routes/index", indexRouter);

const logoutRouter = require("./routes/logout");
app.use("/routes/logout", logoutRouter);

const schedulesRouter = require("./routes/schedules");
app.use("/routes/schedules", schedulesRouter);

const signupRouter = require("./routes/signup");
app.use("/routes/signup", signupRouter);

//DESIGN
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
app.set("layout", "./layouts/full-width");
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const twoHours = 1000 * 60 * 60 * 2;

app.use(
  session({
    name: "sid",
    resave: false,
    cookie: {
      maxAge: twoHours,
      sameSite: true,
    },
    secret: "shh/its1asecret",
    saveUninitialized: false,
    //secure:false
  })
);

//Add database
const database = require("./database.js");

//Test that connection to PORT is active
app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});

app.use("/login", loginRouter);
app.use("/", indexRouter);
app.use("/logout", logoutRouter);
app.use("/signup", signupRouter);
app.use("/schedules", schedulesRouter);
