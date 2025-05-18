/**
 * Modèle de données pour les patientes
 */

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Veuillez fournir une adresse email valide']
  },
  phone: {
    type: String,
    trim: true
  },
  birthdate: {
    type: Date
  },
  profession: {
    type: String,
    trim: true
  },
  situation: {
    type: String,
    enum: ['en activité', 'en recherche d\'emploi', 'en congé parental', 'étudiante', 'autre'],
    default: 'autre'
  },
  children: {
    type: Number,
    default: 0,
    min: 0
  },
  goals: {
    type: [String],
    default: []
  },
  notes: {
    type: String
  },
  avatar: {
    type: String,
    default: '/images/default-avatar.png'
  },
  assignedModules: [{
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  }],
  appointments: [{
    date: {
      type: Date,
      required: true
    },
    duration: {
      type: Number, // en minutes
      default: 60
    },
    type: {
      type: String,
      enum: ['présentiel', 'visio', 'téléphone'],
      default: 'présentiel'
    },
    notes: {
      type: String
    },
    status: {
      type: String,
      enum: ['planifié', 'confirmé', 'annulé', 'terminé'],
      default: 'planifié'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  }
}, { timestamps: true });

// Méthodes virtuelles
patientSchema.virtual('fullName').get(function() {
  return `${this.firstname} ${this.lastname}`;
});

patientSchema.virtual('age').get(function() {
  if (!this.birthdate) return null;
  const ageDiffMs = Date.now() - this.birthdate.getTime();
  const ageDate = new Date(ageDiffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

// Méthodes d'instance
patientSchema.methods.getCompletedModules = function() {
  return this.assignedModules.filter(module => module.completedAt);
};

patientSchema.methods.getActiveModules = function() {
  return this.assignedModules.filter(module => !module.completedAt && module.progress > 0);
};

patientSchema.methods.getUpcomingAppointments = function() {
  const now = new Date();
  return this.appointments
    .filter(apt => apt.date > now && apt.status !== 'annulé')
    .sort((a, b) => a.date - b.date);
};

// Configuration pour inclure les virtuals dans la conversion JSON
patientSchema.set('toJSON', { virtuals: true });
patientSchema.set('toObject', { virtuals: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
