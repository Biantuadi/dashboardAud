const { query } = require('../config/database');

async function createTypeBlocTable() {
  try {
    console.log('🚀 Création de la table type_bloc...');

    // Création de la table type_bloc
    await query(`
      CREATE TABLE IF NOT EXISTS type_bloc (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL UNIQUE,
        description LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table type_bloc créée avec succès');

    // Insertion des types de blocs par défaut
    const types = [
      { type: 'titre', description: 'Titre de section' },
      { type: 'texte', description: 'Bloc de texte' },
      { type: 'liste', description: 'Liste à puces' },
      { type: 'image', description: 'Image (format base64)' },
      { type: 'video', description: 'Vidéo (URL ou embed)' },
      { type: 'fichier', description: 'Fichier à télécharger (URL)' },
      { type: 'citation', description: 'Citation' },
      { type: 'liste_verifiee', description: 'Liste avec cases à cocher' }
    ];

    console.log('📝 Insertion des types de blocs...');
    for (const type of types) {
      await query(`
        INSERT IGNORE INTO type_bloc (type, description)
        VALUES (?, ?)
      `, [type.type, type.description]);
    }
    console.log('✅ Types de blocs insérés avec succès');

    console.log('✨ Migration terminée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

createTypeBlocTable(); 