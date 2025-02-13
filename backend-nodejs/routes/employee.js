const express = require("express");
const connection = require("../connection");
const router = express.Router();

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

router.post("/signup", (req, res) => {
  let employee = req.body;
  const joinYear = new Date().toISOString().slice(0, 10);

  let query =
    "select email, password, role, status from employee where email=?";
  connection.query(query, [employee.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query =
          "insert into employee(employee_name, employee_phone, join_year, email, password, salary, status, role) values(?, ?, ?, ?, ?, '0', 'false', 'employee')";
        connection.query(
          query,
          [
            employee.employee_name,
            employee.employee_phone,
            joinYear,
            employee.email,
            employee.password,
          ],
          (err, results) => {
            if (!err) {
              return res
                .status(200)
                .json({ message: "successfully registered" });
            } else {
              return res.status(500).json(err);
            }
          }
        );
      } else {
        return res.status(400).json({ message: "email already exists" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.post("/login", (req, res) => {
  const employee = req.body;
  query = "select email, password, role, status from employee where email=?";
  connection.query(query, [employee.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != employee.password) {
        return res
          .status(401)
          .json({ message: "incorrect username or password" });
      } else if (results[0].status === "false") {
        return res.status(401).json({ message: "wait for admin approval" });
      } else if (results[0].password == employee.password) {
        const response = { email: results[0].email, role: results[0].role };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "8h",
        });
        res.status(200).json({ token: accessToken });
      } else {
        return res
          .status(400)
          .json({ message: "something went wrong, please try again later" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

router.post("/forgotPassword", (req, res) => {
  const employee = req.body;
  query = "select email, password from employee where email=?";
  connection.query(query, [employee.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res
          .status(200)
          .json({ message: "password sent successfully to your email" });
      } else {
        var mailOptions = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: "password by Cloth Craft",
          html:
            "<p><b>Your Login details for Cloth Craft</b><br><b>Email: </b>" +
            results[0].email +
            "<br><b>Password: </b>" +
            results[0].password +
            '<br><a href="http://localhost:3000">Click to Login!</a></p>',
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("email sent: " + info.response);
          }
        });
        return res
          .status(200)
          .json({ message: "password sent successfully to your email" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/get", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  var query =
    "select employee_id, employee_name, employee_phone, salary, join_year, email, status from employee where role = 'employee'";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res) => {
    let employee = req.body;
    var query = "update employee set status =? where employee_id=?";
    connection.query(
      query,
      [employee.status, employee.employee_id],
      (err, results) => {
        if (!err) {
          if (results.affectedRows == 0) {
            return res
              .status(404)
              .json({ message: "Employee ID does not exist" });
          }
          return res
            .status(200)
            .json({ message: "Employee Updated Successfully" });
        } else {
          return res.status(500).json(err);
        }
      }
    );
  }
);

router.get("/checkToken", auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: "true" });
});

router.post("/changePassword", auth.authenticateToken, (req, res) => {
  const employee = req.body;
  const email = res.locals.email;
  var query = "select * from employee where email=? and password =?";
  connection.query(query, [email, employee.oldPassword], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(400).json({ message: "Incorrect Old Password" });
      } else if (results[0].password == employee.oldPassword) {
        query = "update employee set password =? where email =?";
        connection.query(
          query,
          [employee.newPassword, email],
          (err, results) => {
            if (!err) {
              return res
                .status(200)
                .json({ message: "Password Updated Successfully!" });
            } else {
              return res.status(500).json(err);
            }
          }
        );
      } else {
        return res
          .status(400)
          .json({ message: "Something went wrong. Please try again later!" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

module.exports = router;
