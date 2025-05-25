const { query } = require('../config/database');

async function updateImageColumns() {
  try {
    console.log('🚀 Début de la migration des colonnes d\'images...');

    // Modification de la table module
    console.log('📝 Modification de la table module...');
    await query('ALTER TABLE module MODIFY COLUMN miniature LONGTEXT');
    console.log('✅ Table module modifiée avec succès');

    // Modification de la table utilisateur
    console.log('📝 Modification de la table utilisateur...');
    await query('ALTER TABLE utilisateur MODIFY COLUMN image_profil LONGTEXT');
    console.log('✅ Table utilisateur modifiée avec succès');

    // Mise à jour des valeurs existantes
    console.log('🔄 Mise à jour des valeurs par défaut...');
    await query('UPDATE module SET miniature = ? WHERE miniature IS NULL', ['/images/default-module.png']);
    await query('UPDATE utilisateur SET image_profil = ? WHERE image_profil IS NULL', ['/images/photo-defaut']);
    console.log('✅ Valeurs par défaut mises à jour avec succès');

    console.log('✨ Migration terminée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

updateImageColumns(); 