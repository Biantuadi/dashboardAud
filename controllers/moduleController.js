/**
 * Contrôleur pour les modules
 */

// Utilisation du modèle module avec MySQL
const Module = require('../models/module_mysql');
const Patient = require('../models/patient');
const { query } = require('../config/database');
const ModuleAssignment = require('../models/moduleAssignment');

// Afficher la liste des modules
exports.getModules = async (req, res) => {
  try {
    const modules = await Module.findAll();
    
    res.render('modules/list', {
      title: 'Liste des modules',
      active: 'modules',
      modules
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des modules:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la récupération des modules',
      error
    });
  }
};

// Afficher le formulaire d'ajout de module
exports.getAddModuleForm = async (req, res) => {
  try {
    // Récupérer toutes les catégories
    const blockTypes = await Module.getBlockTypes();
    const categories = await query('SELECT id, nom FROM categorie ORDER BY nom');
    
    res.render('modules/add', {
      title: 'Ajouter un module',
      active: 'modules',
      module: {},
      blockTypes,
      categories
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données pour le formulaire:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la récupération des données pour le formulaire',
      error
    });
  }
};

// Ajouter un nouveau module 
exports.addModule = async (req, res) => {
  try {
    const moduleData = {
      titre: req.body.title,
      description: req.body.description,
      miniature: req.file ? `/uploads/modules/${req.file.filename}` : '/images/default-module.png',
      est_publie: req.body.isPublished === 'on',
      est_gratuit: req.body.isFree === 'on',
      duree_estimee: parseInt(req.body.estimatedDuration || 0),
      cree_par: req.session.user.id,
      categorie_id: req.body.categorie_id || null
    };
    const newModule = await Module.create(moduleData);

    // Mapper types front->DB
    const frontToDb = { heading: 'titre', paragraph: 'texte', list: 'liste', image: 'image' };
    // Récupérer mapping bloc IDs
    const blocTypes = await Module.getBlockTypes();

    // Debugging: vérifier le contenu et le mapping des blocs
    console.log('DEBUG raw content payload:', req.body.content);
    let contentItems = [];
    if (req.body.content) {
      try { contentItems = JSON.parse(req.body.content); } catch (e) {
        console.error('DEBUG JSON parse error:', e);
      }      
    }
    console.log('DEBUG parsed contentItems:', contentItems);
    console.log('DEBUG blocTypes from DB:', blocTypes);

    // Parse content JSON
    if (Array.isArray(contentItems)) {
      for (let i = 0; i < contentItems.length; i++) {
        const item = contentItems[i];
        const dbType = frontToDb[item.type] || item.type;
        // Trouver bloc_id correspondant
        const bloc = blocTypes.find(b => b.type === dbType);
        if (!bloc) continue;
        // Préparer contenu textuel
        let contenu = '';
        if (Array.isArray(item.content)) {
          contenu = item.content.map(val => `- ${val}`).join('\n');
        } else if (typeof item.content === 'string') {
          contenu = item.content;
        }
        try {
          const inserted = await Module.addContentBlock(newModule.id, {
            bloc_id: bloc.id,
            contenu: contenu,
            url_ressource: item.url || null,
            ordre: i + 1
          });
          console.log('DEBUG inserted block:', inserted);
        } catch (err) {
          console.error('DEBUG error inserting block:', err);
        }
      }
    }
    res.redirect(`/modules/${newModule.id}`);
  } catch (error) {
    console.error('Erreur lors de la création du module:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la création du module',
      error
    });
  }
};

// Afficher les détails d'un module
exports.getModuleDetails = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).render('error', {
        title: 'Module non trouvé',
        message: 'Le module demandé n\'existe pas',
        error: { status: 404 }
      });
    }
    
    // Récupérer le contenu du module
    const moduleContent = await Module.getModuleContent(module.id);
    console.log('DEBUG moduleContent:', moduleContent);
    
    // Récupérer les patientes assignées et toutes les patientes pour toggle
    const assignedPatients = await ModuleAssignment.getPatientsAssignedToModule(module.id);
    const allPatients = await Patient.findAll();
    const assignedIds = assignedPatients.map(p => p.patient_id);

    // Récupérer les statistiques du module
    const moduleStats = await ModuleAssignment.getModuleStats(module.id);
    
    res.render('modules/details', {
      title: 'Détails du module',
      active: 'modules',
      module,
      moduleContent,
      assignedPatients,
      allPatients,
      assignedIds,
      stats: moduleStats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du module:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la récupération des détails du module',
      error
    });
  }
};

// Afficher le formulaire de modification d'un module
exports.getEditModuleForm = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).render('error', {
        title: 'Module non trouvé',
        message: 'Le module demandé n\'existe pas',
        error: { status: 404 }
      });
    }
    
    // Récupérer le contenu du module
    const moduleContent = await Module.getModuleContent(module.id);
    const categories = await query('SELECT id, nom FROM categorie ORDER BY nom');
    
    res.render('modules/edit', {
      title: 'Modifier le module',
      active: 'modules',
      module,
      moduleContent,
      categories
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du module à modifier:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la récupération du module à modifier',
      error
    });
  }
};

// Mettre à jour un module
exports.updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const moduleData = {
      titre: req.body.title,
      description: req.body.description,
      miniature: req.file ? `/uploads/modules/${req.file.filename}` : module.miniature,
      est_publie: req.body.isPublished === 'on',
      est_gratuit: req.body.isFree === 'on',
      duree_estimee: parseInt(req.body.estimatedDuration || 0),
      categorie_id: req.body.categorie_id || null
    };
    await Module.update(id, moduleData);

    if (req.body.updateContent === 'true') {
      const existingBlocks = await Module.getModuleContent(id);
      for (const block of existingBlocks) {
        await Module.removeContentBlock(block.id);
      }
      // Récupérer mapping bloc IDs
      const frontToDb = { heading: 'titre', paragraph: 'texte', list: 'liste', image: 'image' };
      const blocTypes = await Module.getBlockTypes();
      // Parse content JSON
      let contentItems = [];
      if (req.body.content) {
        try { contentItems = JSON.parse(req.body.content); } catch {}
      }
      if (Array.isArray(contentItems)) {
        for (let i = 0; i < contentItems.length; i++) {
          const item = contentItems[i];
          const dbType = frontToDb[item.type] || item.type;
          const bloc = blocTypes.find(b => b.type === dbType);
          if (!bloc) continue;
          let contenu = '';
          if (Array.isArray(item.content)) {
            contenu = item.content.map(val => `- ${val}`).join('\n');
          } else if (typeof item.content === 'string') {
            contenu = item.content;
          }
          await Module.addContentBlock(id, {
            bloc_id: bloc.id,
            contenu: contenu,
            url_ressource: item.url || null,
            ordre: i + 1
          });
        }
      }
    }
    res.redirect(`/modules/${id}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du module:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la mise à jour du module',
      error
    });
  }
};

// Supprimer un module
exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Supprimer le module de la base de données
    await Module.remove(id);
    
    res.redirect('/modules');
  } catch (error) {
    console.error('Erreur lors de la suppression du module:', error);
    res.status(500).render('error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la suppression du module',
      error
    });
  }
};
