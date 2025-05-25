/**
 * Configuration pour le traitement des images en base64
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Fonction pour convertir une image en base64
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    // Vérifier si c'est déjà une chaîne base64
    if (typeof file === 'string' && file.startsWith('data:image')) {
      resolve(file);
      return;
    }

    // Si c'est un fichier uploadé via multer
    if (file.buffer) {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      resolve(base64);
      return;
    }

    // Si c'est un chemin de fichier
    if (file.path) {
      fs.readFile(file.path, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const base64 = `data:${file.mimetype};base64,${data.toString('base64')}`;
        resolve(base64);
      });
      return;
    }

    reject(new Error('Format de fichier non supporté'));
  });
};

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

// Configuration de multer pour stocker en mémoire
const memoryStorage = multer.memoryStorage();

// Créer les instances de téléchargement
const uploadModule = multer({
  storage: memoryStorage,
  limits: { fileSize: maxSize },
  fileFilter: imageFilter
});

const uploadPatient = multer({
  storage: memoryStorage,
  limits: { fileSize: maxSize },
  fileFilter: imageFilter
});

const uploadContent = multer({
  storage: memoryStorage,
  limits: { fileSize: maxSize },
  fileFilter: documentFilter
});

// Middleware pour convertir les images en base64
const convertImagesToBase64 = async (req, res, next) => {
  try {
    if (req.file) {
      req.file.base64 = await convertToBase64(req.file);
    }
    next();
  } catch (error) {
    next(error);
  }
};

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
  handleUploadError,
  convertImagesToBase64,
  convertToBase64
};
