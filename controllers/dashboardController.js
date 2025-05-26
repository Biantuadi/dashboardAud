/**
 * Contrôleur pour le dashboard
 */

const Module = require('../models/module_mysql');
const Patient = require('../models/patient');

// Afficher le dashboard
exports.getDashboard = async (req, res) => {
  try {
    // Récupérer l'utilisateur depuis le cookie
    const user = JSON.parse(req.cookies.user);
    console.log('Accès au dashboard par:', user.email);

    // Récupérer les statistiques des modules
    const modules = await Module.findAll();
    const moduleStats = {
      total: modules.length,
      actifs: modules.filter(m => m.est_publie).length,
      inactifs: modules.filter(m => !m.est_publie).length
    };

    // Récupérer les statistiques des patients
    const patients = await Patient.findAll();
    const patientStats = {
      total: patients.length,
      actifs: patients.filter(p => p.statut === 'actif').length,
      inactifs: patients.filter(p => p.statut === 'inactif').length
    };

    console.log('Statistiques récupérées:', { moduleStats, patientStats });

    // Afficher le dashboard avec les statistiques
    res.render('dashboard', {
      title: 'Dashboard',
      user: user,
      stats: {
        modules: moduleStats,
        patients: patientStats
      },
      patients: patients,
      recentModules: modules.slice(0, 5),
      recentPatients: patients.slice(0, 5)
    });
  } catch (error) {
    console.error('Erreur lors de l\'accès au dashboard:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de l\'accès au dashboard',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};
