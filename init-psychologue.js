/**
 * Script pour insérer des données initiales dans la table psychologue
 */

const { connectDB, query } = require('./config/database');

const insertTestPsychologue = async () => {
  try {
    // Connexion à la base de données
    await connectDB();
    
    // Vérifier si des psychologues existent déjà
    const checkSql = 'SELECT COUNT(*) as count FROM psychologue';
    const result = await query(checkSql);
    
    if (result[0].count > 0) {
      console.log('Des psychologues existent déjà dans la base de données');
      return;
    }
    
    // Insérer un psychologue de test
    const insertSql = `
      INSERT INTO psychologue (nom, prenom, email, mot_de_passe, telephone) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await query(insertSql, [
      'Admin',
      'Audacieuse',
      'admin@lesaudacieuses.fr',
      'admin123',
      '0601020304'
    ]);
    
    console.log('Psychologue de test inséré avec succès');
    
    // Terminer le processus
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données de test:', error);
    process.exit(1);
  }
};

// Exécuter la fonction
insertTestPsychologue();
