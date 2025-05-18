/**
 * Configuration pour le téléchargement de fichiers avec Multer
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Créer les dossiers de téléchargement s'ils n'existent pas
const createUploadDirs = () => {
  const dirs = [
    './public/uploads',
    './public/uploads/modules',
    './public/uploads/patients',
    './public/uploads/content'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configurer le stockage pour les modules
const moduleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/modules');
  },
  filename: (req, file, cb) => {
    cb(null, 'module-' + Date.now() + path.extname(file.originalname));
  }
});

// Configurer le stockage pour les patientes
const patientStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/patients');
  },
  filename: (req, file, cb) => {
    cb(null, 'patient-' + Date.now() + path.extname(file.originalname));
  }
});

// Configurer le stockage pour le contenu des modules
const contentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/content');
  },
  filename: (req, file, cb) => {
    cb(null, 'content-' + Date.now() + path.extname(file.originalname));
  }
});

// Filtre pour les images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

// Filtre pour les documents
const documentFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
  }
};

// Limites de taille de fichier
const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB par défaut

// Créer les instances de téléchargement
const uploadModule = multer({
  storage: moduleStorage,
  limits: { fileSize: maxSize },
  fileFilter: imageFilter
});

const uploadPatient = multer({
  storage: patientStorage,
  limits: { fileSize: maxSize },
  fileFilter: imageFilter
});

const uploadContent = multer({
  storage: contentStorage,
  limits: { fileSize: maxSize },
  fileFilter: documentFilter
});

// Middleware de gestion des erreurs de téléchargement
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Erreur Multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).render('error', {
        title: 'Erreur de téléchargement',
        message: 'Le fichier est trop volumineux. La taille maximale est de 5 Mo.',
        error: { status: 400 }
      });
    }
    return res.status(400).render('error', {
      title: 'Erreur de téléchargement',
      message: `Erreur lors du téléchargement : ${err.message}`,
      error: { status: 400 }
    });
  } else if (err) {
    // Erreur personnalisée
    return res.status(400).render('error', {
      title: 'Erreur de téléchargement',
      message: err.message,
      error: { status: 400 }
    });
  }
  next();
};

module.exports = {
  uploadModule: uploadModule.single('thumbnail'),
  uploadPatient: uploadPatient.single('avatar'),
  uploadContent: uploadContent.single('file'),
  handleUploadError
};
