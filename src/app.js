const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const app = express();
const favicon = require("serve-favicon");

const RegisterRouter = require("./routes/account/register.route");
const LoginRouter = require("./routes/account/login.route");
const UserRouter = require("./routes/user/user.route");
const LogoutRouter = require("./routes/account/logout.route");
const ForgotPasswordRouter = require("./routes/account/forgot_password.route");
const ResetPasswordRouter = require("./routes/account/reset_password.route");

const LoginAuthentication = require("./authentications/login.authentication");

app.use(favicon(path.join(__dirname, "..", "public", "images", "icon.ico")));
app.use(require("cookie-parser")("secret"));
app.use(require("express-session")({ cookie: { maxAge: null } }));
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(require("body-parser").json());

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "/public")));

app.use("/login", LoginRouter);
app.use("/register", RegisterRouter);
app.use("/user", LoginAuthentication, UserRouter);
app.use("/logout", LoginAuthentication, LogoutRouter);
app.use("/forgot-password", ForgotPasswordRouter);
app.use("/reset-password", ResetPasswordRouter);

app.get("/", LoginAuthentication, (req, res) => {
  res.redirect("/user");
});

app.use(function (req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts("html")) {
    res.render("404", { style: "404PageStyle.css", url: req.url });
    return;
  }

  // respond with json
  if (req.accepts("json")) {
    res.json({ error: "Not found" });
    return;
  }

  // default to plain-text. send()
  res.type("txt").send("Not found");
});

module.exports = app;
