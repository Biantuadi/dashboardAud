/**
 * Contrôleur pour le dashboard
 */

// Utilisation des modèles avec MySQL
const Module = require('../models/module_mysql');
const Patient = require('../models/patient');

// Afficher la page d'accueil du dashboard
exports.getDashboard = async (req, res) => {
  try {
    // Récupérer les statistiques pour le dashboard
    const modules = await Module.findAll();
    const patients = await Patient.findAll();
    // Les rendez-vous ne sont pas encore implémentés dans MySQL
    const upcomingAppointments = [];
    
    res.render('dashboard', {
      title: 'Dashboard',
      active: 'dashboard',
      stats: {
        moduleCount: modules.length,
        patientCount: patients.length,
        // Pour le moment, tous les patients sont considérés comme actifs
        activePatients: patients.length
      },
      recentModules: modules.slice(0, 5),
      recentPatients: patients.slice(0, 5),
      upcomingAppointments
    });
  } catch (error) {
    console.error('Erreur lors du chargement du dashboard:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors du chargement du dashboard',
      error
    });
  }
};
