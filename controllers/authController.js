const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userUpload = require('../libs/users');
const {models} = require('../models/index');
const userModel = models.Usuario;
const passport = require("passport");
const promisify = require('util').promisify;

const saltRounds = 10;

const authController = {
  showRegister: (req, res) => {
    res.render('register', {title: 'Registro - Fotaza', scripts: ['login']});
  },
  register: async (req, res, next) => {
    try {

      passport.authenticate('signup', {session: false}, async (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(400).json({ message: 'Invalid user data' });
        }
        req.login(user, {session: false}, async (err) => {
          if (err) {
            return next(err);
          }
          const token = jwt.sign({ id: user.user_id }, 'secret');
          const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true
          }

          res.cookie('jwt', token, cookieOptions);

          res.json({ success: true });
        });
      })(req, res, next);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Registration failed' });
    }
  },
  showLogin: (req, res) => {
    res.render('login', {title: 'Login - Fotaza', scripts: ['login']});
  },
  login: async (req, res, next) => {
    try {
      passport.authenticate('login', {session: false}, async (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(400).json({ message: 'Invalid user data' });
        }
        req.login(user, {session: false}, async (err) => {
          if (err) {
            return next(err);
          }
          const token = jwt.sign({ id: user.user_id }, 'secret');
          const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true
          }

          res.cookie('jwt', token, cookieOptions);

          res.json({ message: "Login successful", success: true });
        });
      })(req, res, next);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Login failed' });
    }
  },
  logout: (req, res) => {
    res.clearCookie('jwt')
    req.session ? req.session.destroy() : ''
    return res.redirect('/auth/login')
  },
  showHome: (req, res) => {
    try {
      // Check if the user is authenticated (You can define your own authentication logic here)
      if (!req.session.userId) {
        return res.status(403).json({ message: 'Access denied. Please log in.' });
      }

      // Render the user's home page or send a response
      res.render('./index'); // You can render a template or send JSON data
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to load home page' });
    }
  },
  getUserId: async (req, res, next) => {
    res.locals.user_id = null;

    if (req.cookies.jwt) {
      const decodificada = await promisify(jwt.verify)(req.cookies.jwt, 'secret');
      const user = await userModel.findByPk(decodificada.id);
      if (user) res.locals.user_id = decodificada.id
    }

    return next()
  },
  
  isAuthenticated: async (req, res, next) => {
      if (!req.cookies.jwt)
        return res.redirect('/auth/login')
    
      const decodificada = await promisify(jwt.verify)(req.cookies.jwt, 'secret')
    
      const user = await userModel.findByPk(decodificada.id)
    
      if (user == null) return next()
    
      req.user = user
      return next()
  }
}

module.exports = authController;