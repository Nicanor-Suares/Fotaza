const express = require("express");

const routes = require("./routes/routes.js");
const authRouter = require("./routes/auth.js");
//const usersRouter = require('./routes/usuario.js');
const cors = require("cors");
const storage = require('./libs/handyStorage');
const sequelizeConnection = require('./models/index');

const app = express();

sequelizeConnection.sync();

app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());

//static folders
app.use(express.static('./public'));
app.use(express.static('./usuario'));

//main routes
app.use("/", routes);
//auth routes
app.use("/auth", authRouter);

// app.use((req, res, next) => {
//   res.locals.token = storage.state.token;
//   res.locals.user = storage.state.user.email;
// });

app.listen(3000, () => {
  console.log('Server started on port 3000.');
});
