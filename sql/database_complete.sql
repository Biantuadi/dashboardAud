-- Base de données pour le Dashboard Les Audacieuses
-- Script complet pour initialiser toutes les tables

-- Désactivation des vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS = 0;

-- Suppression des tables existantes si elles existent
DROP TABLE IF EXISTS `module_patient`;
DROP TABLE IF EXISTS `contenu_bloc`;
DROP TABLE IF EXISTS `bloc`;
DROP TABLE IF EXISTS `module`;
-- DROP TABLE IF EXISTS `categorie`; -- Table catégorie supprimée
DROP TABLE IF EXISTS `utilisateur`;
DROP TABLE IF EXISTS `psychologue`;
DROP TABLE IF EXISTS `rendez_vous`;

-- --------------------------------------------------------
--
-- Structure de la table `psychologue`
--

CREATE TABLE `psychologue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(70) NOT NULL,
  `prenom` varchar(70) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `telephone` varchar(15) NOT NULL,
  `date_creation` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Structure de la table `utilisateur` (patientes)
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(70) NOT NULL,
  `prenom` varchar(70) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telephone` varchar(15) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `date_inscription` datetime NOT NULL DEFAULT current_timestamp(),
  `emploi_actuel` varchar(100) DEFAULT NULL,
  `emploi_vise` varchar(100) DEFAULT NULL,
  `competences` text DEFAULT NULL,
  `experience` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Structure de la table `module`
--

CREATE TABLE `module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `miniature` varchar(255) DEFAULT '/images/default-module.png',
  `est_publie` tinyint(1) NOT NULL DEFAULT 0,
  `est_gratuit` tinyint(1) NOT NULL DEFAULT 0,
  `duree_estimee` int(11) DEFAULT 0, -- En minutes
  `cree_par` int(11) DEFAULT NULL,
  `date_creation` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_module_psychologue` (`cree_par`),
  CONSTRAINT `fk_module_psychologue` FOREIGN KEY (`cree_par`) REFERENCES `psychologue` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Structure de la table `bloc` (types de contenu génériques)
--

CREATE TABLE `bloc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('titre', 'texte', 'image', 'video', 'liste', 'fichier', 'citation') NOT NULL,
  `date_creation` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Structure de la table `contenu_bloc` (contenu spécifique pour chaque module)
--

CREATE TABLE `contenu_bloc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) NOT NULL,
  `bloc_id` int(11) NOT NULL,
  `contenu` text DEFAULT NULL,
  `url_ressource` varchar(255) DEFAULT NULL,
  `ordre` int(11) NOT NULL DEFAULT 0,
  `metadata` JSON DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_contenu_module` (`module_id`),
  KEY `fk_contenu_bloc` (`bloc_id`),
  CONSTRAINT `fk_contenu_module` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_contenu_bloc` FOREIGN KEY (`bloc_id`) REFERENCES `bloc` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Structure de la table `module_patient` (relation entre modules et patientes)
--

CREATE TABLE `module_patient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `date_assignation` datetime NOT NULL DEFAULT current_timestamp(),
  `progression` int(3) NOT NULL DEFAULT 0,
  `derniere_activite` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `module_patient_unique` (`module_id`, `patient_id`),
  KEY `fk_mp_module` (`module_id`),
  KEY `fk_mp_patient` (`patient_id`),
  CONSTRAINT `fk_mp_module` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mp_patient` FOREIGN KEY (`patient_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Structure de la table `rendez_vous`
--

CREATE TABLE `rendez_vous` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `psychologue_id` int(11) NOT NULL,
  `date_heure` datetime NOT NULL,
  `duree` int(11) NOT NULL DEFAULT 60, -- En minutes
  `type` enum('présentiel', 'visio', 'téléphone') NOT NULL DEFAULT 'présentiel',
  `notes` text DEFAULT NULL,
  `statut` enum('planifié', 'confirmé', 'annulé', 'terminé') NOT NULL DEFAULT 'planifié',
  `date_creation` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_rdv_patient` (`patient_id`),
  KEY `fk_rdv_psychologue` (`psychologue_id`),
  CONSTRAINT `fk_rdv_patient` FOREIGN KEY (`patient_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rdv_psychologue` FOREIGN KEY (`psychologue_id`) REFERENCES `psychologue` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Réactivation des vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
--
-- Insertion des données initiales
--

-- Insertion d'un psychologue par défaut (admin)
INSERT INTO `psychologue` (`nom`, `prenom`, `email`, `mot_de_passe`, `telephone`) VALUES
('Admin', 'Psychologue', 'admin@lesaudacieuses.fr', 'admin123', '0123456789');

-- Suppression de l'insertion des catégories de modules (table catégorie supprimée)

-- Insertion des modules de base
INSERT INTO `module` (`titre`, `description`, `miniature`, `est_publie`, `est_gratuit`, `duree_estimee`, `cree_par`) VALUES
('Confiance en soi', 'Module pour développer sa confiance en soi', '/images/default-module.png', 1, 1, 60, 1),
('Préparation à l''entretien', 'Techniques pour réussir ses entretiens d''embauche', '/images/default-module.png', 1, 1, 45, 1),
('CV et lettre de motivation', 'Rédiger un CV et une lettre de motivation efficaces', '/images/default-module.png', 1, 1, 30, 1);

-- Insertion des types de blocs
INSERT INTO `bloc` (`type`) VALUES
('titre'),
('texte'),
('image'),
('liste'),
('citation');

-- Insertion de contenus pour le module "Confiance en soi"
INSERT INTO `contenu_bloc` (`module_id`, `bloc_id`, `contenu`, `ordre`) VALUES
(1, 1, 'Développer sa confiance en soi', 1),
(1, 2, 'La confiance en soi est essentielle pour réussir sa reconversion professionnelle. Ce module vous propose des techniques concrètes pour renforcer votre confiance.', 2),
(1, 1, 'Exercices pratiques', 3),
(1, 2, 'Voici quelques exercices que vous pouvez pratiquer quotidiennement pour renforcer votre confiance en vous.', 4),
(1, 4, '- Notez chaque jour trois succès, même minimes\n- Identifiez vos forces et qualités\n- Apprenez à accepter les compliments\n- Adoptez une posture confiante', 5);

-- Insertion de contenus pour le module "Préparation à l'entretien"
INSERT INTO `contenu_bloc` (`module_id`, `bloc_id`, `contenu`, `ordre`) VALUES
(2, 1, 'Réussir ses entretiens d\'embauche', 1),
(2, 2, 'L\'entretien d\'embauche est une étape cruciale dans votre reconversion. Ce module vous donne toutes les clés pour le réussir.', 2),
(2, 1, 'Se préparer efficacement', 3),
(2, 2, 'Une bonne préparation est essentielle pour mettre toutes les chances de votre côté.', 4),
(2, 4, '- Recherchez l\'entreprise en profondeur\n- Préparez des réponses aux questions fréquentes\n- Préparez vos propres questions\n- Entraînez-vous avec des simulations', 5);

-- Insertion de données utilisateur de test
INSERT INTO `utilisateur` (`nom`, `prenom`, `email`, `telephone`, `mot_de_passe`, `emploi_actuel`, `emploi_vise`, `competences`, `experience`, `notes`) VALUES
('Dupont', 'Marie', 'marie.dupont@example.com', '0612345678', 'motdepasse123', 'Assistante administrative', 'Développeuse web', 'Organisation, Communication, Pack Office, Anglais, HTML/CSS (débutant)', '8 ans d expérience en tant qu assistante administrative dans divers secteurs. Formation en ligne en développement web depuis 6 mois.', 'Marie est très motivée pour sa reconversion. Elle travaille actuellement sur son portfolio.'),
('Martin', 'Sophie', 'sophie.martin@example.com', '0687654321', 'motdepasse456', 'Vendeuse', 'Chargée de communication', 'Relation client, Vente, Réseaux sociaux, Photographie', '5 ans d expérience dans la vente. A suivi une formation en communication digitale.', 'Sophie souhaite valoriser ses compétences en communication pour se reconvertir.');

-- Assignation de modules aux patientes
INSERT INTO `module_patient` (`module_id`, `patient_id`, `progression`) VALUES
(1, 1, 75),
(2, 1, 40),
(3, 1, 90),
(1, 2, 50),
(2, 2, 25);

-- Création de rendez-vous de test
INSERT INTO `rendez_vous` (`patient_id`, `psychologue_id`, `date_heure`, `type`, `notes`, `statut`) VALUES
(1, 1, NOW() + INTERVAL 2 DAY, 'présentiel', 'Premier rendez-vous pour faire le point sur ses progrès', 'confirmé'),
(2, 1, NOW() + INTERVAL 5 DAY, 'visio', 'Bilan de mi-parcours', 'planifié');
