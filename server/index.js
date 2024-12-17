const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const reportesRoutes = require('./api/reportes'); 
const assignmentsRoutes = require('./api/assignments'); 
const app = express();
const JWT_SECRET = "your_secret_key_here";

//nota: hay que ordenar el código y separarlo en /api /models /config /controllers

app.use(express.json());
app.use(cors());

//conexion mongo
mongoose.connect('mongodb://localhost:27017/incidenciasdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Conexión a MongoDB exitosa'))
    .catch(err => console.error('Error conectando a MongoDB:', err));


app.use('/api/reportes', reportesRoutes);
app.use('/api/assignments', assignmentsRoutes);

//modelo de usuario (en models/user.model)
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

//validar formato de correo
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

//get usuarios
app.get('/users', async (req, res) => {
    try {
      const users = await User.find(); 
      res.status(200).json(users); 
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
});

//get admins
app.get('/api/admins', async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' });
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los administradores', error });
    }
});

  
//register 
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName) return res.status(400).json({ message: 'El nombre es obligatorio' });
    if (!lastName) return res.status(400).json({ message: 'El apellido es obligatorio' });
    if (!email) return res.status(400).json({ message: 'El correo electrónico es obligatorio' });
    if (!isValidEmail(email)) return res.status(400).json({ message: 'El formato del correo no es válido' });
    if (!password) return res.status(400).json({ message: 'La contraseña es obligatoria' });

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'El correo ya está registrado' });

        const hashedPassword = await bcrypt.hash(password, 10); //hash de la password
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || 'user', //se pone user de predeterminado
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
});

//token
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No autorizado' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token no válido' });
        }
        req.user = decoded; 
        next(); 
    });
};


//login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'El correo y la contraseña son obligatorios' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Correo electrónico no encontrado' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        //crear token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login exitoso', token, role: user.role });  // Incluir el role
    } catch (error) {
        console.error('Error al hacer login:', error);
        res.status(500).json({ message: 'Error al hacer login', error });
    }
});


//actualizar
app.put('/users/:id', async (req, res) => {
    const { firstName, lastName, email, role } = req.body;
    const { id } = req.params;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, email, role },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al editar usuario', error });
    }
});

//eliminar
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error });
    }
});


app.listen(4000, () => {
    console.log('Servidor en el puerto 4000');
});
