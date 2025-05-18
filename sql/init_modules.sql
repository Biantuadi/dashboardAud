/**
 * Script pour créer les tables et ajouter des données de test
 * pour les modules et les relations module-patient
 */

-- Mise à jour du schéma de la table module pour correspondre à notre modèle
ALTER TABLE `module` 
  ADD COLUMN IF NOT EXISTS `titre` varchar(255) NOT NULL,
  ADD COLUMN IF NOT EXISTS `description` text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `categorie` varchar(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `miniature` varchar(255) DEFAULT '/images/default-module.png',
  ADD COLUMN IF NOT EXISTS `contenu` JSON,
  ADD COLUMN IF NOT EXISTS `est_publie` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `duree_estimee` int(11) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `cree_par` int(11),
  ADD COLUMN IF NOT EXISTS `date_creation` datetime NOT NULL DEFAULT current_timestamp();

-- Création de la table de relation module_patient si elle n'existe pas
CREATE TABLE IF NOT EXISTS `module_patient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `date_assignment` datetime NOT NULL DEFAULT current_timestamp(),
  `progression` int(3) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_module_patient_module` (`module_id`),
  KEY `fk_module_patient_patient` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Ajout de données de test pour les modules
INSERT INTO `module` (`titre`, `description`, `categorie`, `miniature`, `contenu`, `est_publie`, `duree_estimee`, `cree_par`, `date_creation`) VALUES
('Confiance en soi', 'Module pour développer sa confiance en soi', 'développement personnel', '/images/default-module.png', '[]', 1, 60, 1, NOW()),
('Préparation à l\'entretien', 'Techniques pour réussir ses entretiens d\'embauche', 'compétences professionnelles', '/images/default-module.png', '[]', 1, 45, 1, NOW()),
('CV et lettre de motivation', 'Rédiger un CV et une lettre de motivation efficaces', 'compétences professionnelles', '/images/default-module.png', '[]', 1, 30, 1, NOW());

-- Ajout de données de test pour les relations module-patient (à ajuster selon les IDs disponibles)
-- Remplacer les IDs par les valeurs réelles des utilisateurs et modules dans votre base
-- INSERT INTO `module_patient` (`module_id`, `patient_id`, `progression`) VALUES
-- (1, 1, 75),
-- (2, 1, 40),
-- (3, 1, 90);
