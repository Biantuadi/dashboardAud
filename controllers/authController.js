/**
 * Contrôleur pour l'authentification
 */

// Utiliser le modèle psychologue
const Psychologue = require('../models/psychologue');

// Afficher la page de connexion
exports.getLoginPage = (req, res) => {
  // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
  if (req.cookies.user) {
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
  
  console.log(`Tentative de connexion depuis le contrôleur avec: email=${email}, password=${password}`);
  
  try {
    // Vérifier les identifiants avec la base de données MySQL
    const psychologue = await Psychologue.verifyCredentials(email, password);
    
    console.log('Résultat de verifyCredentials:', psychologue);
    
    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (!psychologue) {
      console.log('Authentification échouée dans le contrôleur');
      return res.render('login', {
        title: 'Connexion',
        error: 'Email ou mot de passe incorrect'
      });
    }
    
    // Créer l'objet utilisateur
    const user = {
      id: psychologue.id,
      firstname: psychologue.prenom,
      lastname: psychologue.nom,
      email: psychologue.email,
      role: 'psychologue',
      avatar: '/images/default-user.png'
    };

    // Stocker les informations de l'utilisateur dans un cookie
    res.cookie('user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
      sameSite: 'lax'
    });
    
    console.log('Cookie utilisateur créé avec succès');
    
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
  res.clearCookie('user');
  res.redirect('/');
};

// Middleware pour vérifier si l'utilisateur est authentifié
exports.requireAuth = (req, res, next) => {
  if (!req.cookies.user) {
    return res.redirect('/');
  }
  next();
};

// Middleware pour vérifier si l'utilisateur a un rôle spécifique
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.cookies.user) {
      return res.redirect('/');
    }
    
    try {
      const user = JSON.parse(req.cookies.user);
      if (user.role !== role) {
        return res.status(403).render('error', {
          title: 'Accès refusé',
          message: 'Vous n\'avez pas les autorisations nécessaires pour accéder à cette page',
          error: { status: 403 }
        });
      }
      next();
    } catch (error) {
      console.error('Erreur lors du parsing du cookie utilisateur:', error);
      res.clearCookie('user');
      return res.redirect('/');
    }
  };
};
