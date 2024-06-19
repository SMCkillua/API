import User from '../models/User.js'
import {authenticateJWT} from '../middleware/jwtMiddleware.js'
export const sessionChecker = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "No autorizado." });
  }
};

export const isAdmin = async (req, res, next) => {
  await authenticateJWT(req, res, async () => {
    try {
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      if (!user.admin) {
        return res.status(403).json({ message: 'Acceso denegado: No es administrador' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
};

