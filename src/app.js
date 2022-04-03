const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const app = express();
const favicon = require("serve-favicon");

const RegisterRouter = require("./routes/account/register.route");
const LoginRouter = require("./routes/account/login.route");
const ChangePassRouter = require("./routes/account/change_password.route");
const UserRouter = require("./routes/user/user.route");

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
app.use("/change_password", ChangePassRouter);
app.use("/user", UserRouter);

app.get("/", (req, res) => {
  res.redirect("/login");
});

// app.get("/forgot-password", (req, res) => {
//   res.render("forgot-password");
// });

// app.post("/forgot-password", (req, res) => {
//   const { email } = req.body;

//   User.findOne({ username: email }, (err, user) => {
//     if (err || !user) {
//       return res.status(400).json({ errror: "User email is not exists" });
//     }
//     const token = jwt.sign({ _id: user._id }, "accountactivatekey123", {
//       expiresIn: "5m",
//     });
//     const output = `
//     <h2>Please click on given link to reset your password</h2>
//     <p>http://localhost:8080/reset-password/${token}</p>
//   `;

//     let mailOptions = {
//       from: "admin@gmail.com", // sender address
//       to: req.body.email, // list of receivers
//       subject: "Node Contact Request", // Subject line
//       text: "Hello world?", // plain text body
//       html: output, // html body
//     };

//     return user.updateOne({ resetLink: token }, (err, success) => {
//       if (err) {
//         return res.status(400).json({ error: "Reset password link error" });
//       } else {
//         let transporter = nodemailer.createTransport({
//           host: "smtp.gmail.com",
//           port: 465,
//           service: "gmail",
//           secure: false, // true for 465, false for other ports
//           auth: {
//             user: "nguyenchinhan502@gmail.com", // generated ethereal user
//             pass: "4612302001", // generated ethereal password
//           },
//           tls: {
//             rejectUnauthorized: false,
//           },
//         });

//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             return console.log(error);
//           }

//           return res.json({
//             message: "Email has been sent, kindly follow the instructions",
//           });
//         });
//       }
//     });
//   });
// });

// app.get("/reset-password/:id", (req, res) => {
//   res.render("reset-password", { token: req.params.id });
// });

// app.post("/reset-password", (req, res) => {
//   const { token, newpass1, newpass2 } = req.body;
//   // if (newpass1 !== newpass2) {
//   //   res.redirect(`/reset-password/${token}`);
//   // }
//   if (token) {
//     jwt.verify(token, "accountactivatekey123", (err, decodedData) => {
//       if (err) {
//         return res.status(401).json({
//           error: "Incorrect token or it is expired",
//         });
//       }
//       User.findOne({ resetLink: token }, (err, user) => {
//         if (err || !user) {
//           return res.status(400).json({ error: "User email is not exists" });
//         }
//         const obj = {
//           password: newpass1,
//         };
//         user = _.extend(user, obj);
//         user.save((err, result) => {
//           if (err) {
//             return res.status(400).json({ error: "Reset password failed" });
//           } else {
//             return res
//               .status(200)
//               .json({ message: "Your password has been changed" });
//           }
//         });
//       });
//     });
//   }
// });

// app.use((req, res, next) => {
//   res.locals.message = req.session.message;
//   delete req.session.message;
//   next();
// });

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
