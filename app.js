const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
require("dotenv").config();
const passport = require("./auth/passport")

const routes = require("./routes/routes.js");
const authRouter = require("./routes/auth.js");
const usersRouter = require("./routes/users.js");
const postsRouter = require("./routes/posts.js");
const cors = require("cors");
const storage = require('./libs/handyStorage');
const sequelizeConnection = require('./models/index');

const app = express();

sequelizeConnection.sync();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

dotenv.config({ path: "./env/.env" });

//app.use(passport.initialize());

//static folders
app.use(express.static('./public'));
app.use(express.static('./usuario'));

app.use(express.static('./users.js'));
app.use(express.static('./files.js'));
//app.use('/avatars', express.static('database/users/avatars'));
app.use('/avatars', express.static('C:\\Users\\nican\\Desktop\\Uni\\Web Dev 2\\Fotaza\\Fotaza\\database\\users\\avatars'));
app.use('/posts', express.static('C:\\Users\\nican\\Desktop\\Uni\\Web Dev 2\\Fotaza\\Fotaza\\database\\users\\posts'));

//main routes
app.use("/", routes);
//auth routes
app.use("/auth", authRouter);
//user routes
app.use("/users", usersRouter);
//posts routes
app.use("/posts", postsRouter);


//cache stuff
// app.use((req, res, next) => {
//   res.locals.token = storage.state.token;
//   res.locals.user = storage.state.user.email;
// });

app.listen(3000, () => {
  console.log('Server started on port 3000.');
});
