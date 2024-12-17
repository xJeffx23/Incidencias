const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // 'Bearer <token>'
    
    if (!token) {
        return res.status(403).json({ message: 'No autorizado' });
    }

    jwt.verify(token, 'tu_clave_secreta_aqui', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token no válido' });
        }
        req.user = decoded; 
        next(); 
    });
};
