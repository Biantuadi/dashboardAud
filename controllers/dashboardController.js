/**
 * Contrôleur pour le dashboard
 */

// Utilisation des données mockées au lieu de MongoDB
const { 
  getAllModules, 
  getAllPatients, 
  getUpcomingAppointments 
} = require('../config/mock-data');

// Afficher la page d'accueil du dashboard
exports.getDashboard = async (req, res) => {
  try {
    // Récupérer les statistiques pour le dashboard
    const modules = getAllModules();
    const patients = getAllPatients();
    const upcomingAppointments = getUpcomingAppointments();
    
    res.render('dashboard', {
      title: 'Dashboard',
      active: 'dashboard',
      stats: {
        moduleCount: modules.length,
        patientCount: patients.length,
        activePatients: patients.filter(p => p.status === 'active').length
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
