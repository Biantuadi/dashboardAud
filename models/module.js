/**
 * Modèle de données pour les modules de formation
 */

const mongoose = require('mongoose');

// Schéma pour les blocs de contenu (similaire à Notion)
const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'heading', 'image', 'video', 'file', 'quote', 'list', 'checklist'],
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: true });

// Schéma pour les modules
const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['reconversion', 'développement personnel', 'compétences professionnelles', 'confiance en soi', 'autre']
  },
  thumbnail: {
    type: String,
    default: '/images/default-module.png'
  },
  content: [contentBlockSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  estimatedDuration: {
    type: Number, // en minutes
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }]
}, { timestamps: true });

// Méthodes du modèle
moduleSchema.methods.isAssignedToPatient = function(patientId) {
  return this.assignedTo.includes(patientId);
};

// Méthodes statiques
moduleSchema.statics.findByCategory = function(category) {
  return this.find({ category });
};

moduleSchema.statics.findPublished = function() {
  return this.find({ isPublished: true });
};

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
