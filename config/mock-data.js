/**
 * Données temporaires pour l'application
 * À utiliser en attendant une vraie base de données
 */

// Utilisateurs
const users = [
  {
    id: 1,
    firstname: 'Admin',
    lastname: 'Audacieuse',
    email: 'admin@lesaudacieuses.fr',
    password: 'admin123',
    role: 'admin',
    avatar: '/images/default-user.png',
    createdAt: new Date('2025-01-01')
  }
];

// Modules
const modules = [
  {
    id: 1,
    title: 'Reconversion professionnelle: par où commencer?',
    description: 'Un module d\'introduction pour aider à structurer sa démarche de reconversion professionnelle.',
    category: 'reconversion',
    thumbnail: '/images/Module item.png',
    content: [
      {
        type: 'heading',
        content: 'Introduction à la reconversion professionnelle',
        order: 1
      },
      {
        type: 'text',
        content: 'La reconversion professionnelle est un processus qui demande réflexion, préparation et méthode. Ce module vous guidera pas à pas dans cette démarche.',
        order: 2
      },
      {
        type: 'image',
        content: '/images/Backgrounds A.jpg',
        order: 3,
        metadata: { caption: 'Le chemin vers une nouvelle carrière' }
      }
    ],
    isPublished: true,
    estimatedDuration: 60,
    createdBy: 1,
    assignedTo: [1, 2],
    createdAt: new Date('2025-03-15')
  },
  {
    id: 2,
    title: 'Confiance en soi et développement personnel',
    description: 'Renforcer la confiance en soi pour mieux aborder sa reconversion professionnelle.',
    category: 'confiance en soi',
    thumbnail: '/images/Module item.png',
    content: [
      {
        type: 'heading',
        content: 'Développer sa confiance en soi',
        order: 1
      },
      {
        type: 'text',
        content: 'La confiance en soi est un élément clé dans toute démarche de changement professionnel. Ce module propose des exercices pratiques pour la renforcer.',
        order: 2
      }
    ],
    isPublished: true,
    estimatedDuration: 45,
    createdBy: 1,
    assignedTo: [2],
    createdAt: new Date('2025-04-01')
  }
];

// Patientes
const patients = [
  {
    id: 1,
    firstname: 'Marie',
    lastname: 'Dupont',
    email: 'marie.dupont@example.com',
    phone: '06 12 34 56 78',
    birthdate: new Date('1985-06-15'),
    profession: 'Assistante administrative',
    situation: 'en recherche d\'emploi',
    children: 2,
    goals: ['Reconversion dans le digital', 'Équilibre vie pro/perso'],
    notes: 'Marie souhaite se réorienter vers les métiers du numérique après 10 ans dans l\'administratif.',
    avatar: '/images/default-avatar.png',
    assignedModules: [
      {
        module: 1,
        assignedAt: new Date('2025-04-10'),
        progress: 60
      }
    ],
    appointments: [
      {
        date: new Date('2025-05-25T14:00:00'),
        duration: 60,
        type: 'présentiel',
        notes: 'Bilan de mi-parcours',
        status: 'planifié'
      }
    ],
    status: 'active',
    createdAt: new Date('2025-04-05')
  },
  {
    id: 2,
    firstname: 'Sophie',
    lastname: 'Martin',
    email: 'sophie.martin@example.com',
    phone: '07 98 76 54 32',
    birthdate: new Date('1990-03-21'),
    profession: 'Vendeuse',
    situation: 'en congé parental',
    children: 1,
    goals: ['Formation à distance', 'Secteur de la santé'],
    notes: 'Sophie est en congé parental et souhaite profiter de cette période pour se former dans un nouveau domaine.',
    avatar: '/images/default-avatar.png',
    assignedModules: [
      {
        module: 1,
        assignedAt: new Date('2025-04-15'),
        progress: 30
      },
      {
        module: 2,
        assignedAt: new Date('2025-04-20'),
        progress: 10
      }
    ],
    appointments: [
      {
        date: new Date('2025-05-20T10:00:00'),
        duration: 60,
        type: 'visio',
        notes: 'Premier rendez-vous',
        status: 'confirmé'
      }
    ],
    status: 'active',
    createdAt: new Date('2025-04-10')
  }
];

module.exports = {
  users,
  modules,
  patients,
  
  // Fonctions utilitaires pour simuler des opérations de base de données
  findUserByEmail: (email) => {
    return users.find(user => user.email === email);
  },
  
  findUserById: (id) => {
    return users.find(user => user.id === id);
  },
  
  getAllModules: () => {
    return [...modules].sort((a, b) => b.createdAt - a.createdAt);
  },
  
  getModuleById: (id) => {
    return modules.find(module => module.id === parseInt(id));
  },
  
  getAllPatients: () => {
    return [...patients].sort((a, b) => a.lastname.localeCompare(b.lastname) || a.firstname.localeCompare(b.firstname));
  },
  
  getPatientById: (id) => {
    return patients.find(patient => patient.id === parseInt(id));
  },
  
  getAssignedModules: (patientId) => {
    const patient = patients.find(p => p.id === parseInt(patientId));
    if (!patient) return [];
    
    return patient.assignedModules.map(am => {
      const module = modules.find(m => m.id === am.module);
      return {
        ...am,
        moduleDetails: module
      };
    });
  },
  
  getUpcomingAppointments: () => {
    const now = new Date();
    const upcoming = [];
    
    patients.forEach(patient => {
      patient.appointments.forEach(appointment => {
        if (appointment.date > now && ['planifié', 'confirmé'].includes(appointment.status)) {
          upcoming.push({
            patientId: patient.id,
            firstname: patient.firstname,
            lastname: patient.lastname,
            appointment
          });
        }
      });
    });
    
    return upcoming.sort((a, b) => a.appointment.date - b.appointment.date).slice(0, 5);
  }
};
