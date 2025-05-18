/**
 * Contrôleur pour l'authentification
 */

// Utilisation des données mockées au lieu de MongoDB
const { findUserByEmail } = require('../config/mock-data');

// Afficher la page de connexion
exports.getLoginPage = (req, res) => {
  // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  
  res.render('login', { 
    title: 'Connexion',
    error: null
  });
};

// Traiter la demande de connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Rechercher l'utilisateur par email dans les données mockées
    const user = findUserByEmail(email);
    
    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (!user || user.password !== password) {
      return res.render('login', {
        title: 'Connexion',
        error: 'Email ou mot de passe incorrect'
      });
    }
    
    // Stocker les informations de l'utilisateur dans la session
    req.session.user = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };
    
    // Rediriger vers le dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.render('login', {
      title: 'Connexion',
      error: 'Une erreur est survenue lors de la connexion'
    });
  }
};

// Déconnexion
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
    res.redirect('/');
  });
};

// Middleware pour vérifier si l'utilisateur est authentifié
exports.requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
};

// Middleware pour vérifier si l'utilisateur a un rôle spécifique
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      return res.status(403).render('error', {
        title: 'Accès refusé',
        message: 'Vous n\'avez pas les autorisations nécessaires pour accéder à cette page',
        error: { status: 403 }
      });
    }
    next();
  };
};
