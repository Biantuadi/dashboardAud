-- Modification de la table module pour stocker les images en base64
ALTER TABLE module MODIFY COLUMN miniature TEXT;

-- Modification de la table utilisateur pour stocker les images en base64
ALTER TABLE utilisateur MODIFY COLUMN image_profil TEXT;

-- Mise à jour des valeurs existantes pour utiliser le chemin par défaut
UPDATE module SET miniature = '/images/default-module.png' WHERE miniature IS NULL;
UPDATE utilisateur SET image_profil = '/images/photo-defaut' WHERE image_profil IS NULL; 