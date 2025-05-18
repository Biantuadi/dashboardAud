/**
 * Script pour vérifier les psychologues dans la base de données
 */

const { connectDB, query } = require('./config/database');

const checkPsychologues = async () => {
  try {
    // Connexion à la base de données
    await connectDB();
    
    // Récupérer tous les psychologues
    const sql = 'SELECT * FROM psychologue';
    const psychologues = await query(sql);
    
    console.log('=== Psychologues trouvés dans la base de données ===');
    console.log(JSON.stringify(psychologues, null, 2));
    console.log('===================================================');
    
    // Terminer le processus
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la vérification des psychologues:', error);
    process.exit(1);
  }
};

// Exécuter la fonction
checkPsychologues();
