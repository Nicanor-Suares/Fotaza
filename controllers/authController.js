const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userUpload = require('../libs/users');
const {models} = require('../models/index');
const userModel = models.Usuario;

const saltRounds = 10;

const authController = {
  showRegister: (req, res) => {
    res.render('register', {title: 'Registro - Fotaza', scripts: ['login']});
  },
  register: async (req, res) => {
    try {
      const {nombre, usuario, email, password, confirm_password } = req.body;

      //Validaciones
      const existingUsername = await userModel.findOne({ where: { usuario } });
      const existingEmail = await userModel.findOne({ where: { email } });

      if (existingUsername) {
        return res.status(400).json({ message: 'Ya existe un usuario con ese username' });
      }

      if (existingEmail) {
        return res.status(400).json({ message: 'Ya hay un usuario registrado con ese email' });
      }

      if(password !== confirm_password)
        return res.status(400).json({ message: 'Las contraseñas no coinciden' });

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const imageUrl = req.file ? req.file.path : null;
      const imageName = imageUrl.split('\\').pop();
      const url = '/avatars/' + imageName;
      const avatarPath = url;

      const newUser = await userModel.create({ nombre, usuario, email, password: hashedPassword, avatar: avatarPath });

      if(newUser)
        res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Registration failed' });
    }
  },
  showLogin: (req, res) => {
    res.render('login', {title: 'Login - Fotaza', scripts: ['login']});
  },
  login: async (req, res) => {
    try {
      console.log('DATA', req.body);
      const { email, password } = req.body;

      // Find the user with the provided email
      const user = await userModel.findOne({ where: { email } }).catch(error => {
        console.error(error);
        return res.status(500).json({ message: 'Failed to get user' });
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const jwtToken = jwt.sign({ id: user.id, email: user.email }, 'secret');

      const cookieOptions = {
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				httpOnly: true
			}

			res.cookie('jwt', jwtToken, cookieOptions);
      // Redirect or send a success response
      res.json({ message: "Login successful", success: true, token: jwtToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Login failed' });
    }
  },
  logout: (req, res) => {
    try {
      // Clear the user's session or token (depending on your authentication method)
      req.session.destroy(); // If you're using session-based authentication
      // or
      // Remove the user's token (if using token-based authentication)

      // Redirect or send a success response
      res.redirect('/auth/login'); // Redirect to the login page after logout
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Logout failed' });
    }
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
}

module.exports = authController;