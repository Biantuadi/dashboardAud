-- Module Patient Relation Table
CREATE TABLE IF NOT EXISTS `module_patient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `date_assignment` datetime NOT NULL DEFAULT current_timestamp(),
  `progression` int(3) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_module_patient_module` (`module_id`),
  KEY `fk_module_patient_patient` (`patient_id`),
  CONSTRAINT `fk_module_patient_module` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_module_patient_patient` FOREIGN KEY (`patient_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Update Module table to match our requirements
ALTER TABLE `module` 
  ADD COLUMN IF NOT EXISTS `miniature` varchar(255) DEFAULT '/images/default-module.png',
  ADD COLUMN IF NOT EXISTS `contenu` JSON,
  ADD COLUMN IF NOT EXISTS `est_publie` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `duree_estimee` int(11) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `cree_par` int(11),
  ADD COLUMN IF NOT EXISTS `date_creation` datetime NOT NULL DEFAULT current_timestamp(),
  ADD COLUMN IF NOT EXISTS `categorie` varchar(50) DEFAULT NULL;

-- Add foreign keys if not already present
ALTER TABLE `module` 
  ADD CONSTRAINT `fk_module_psychologue` FOREIGN KEY (`cree_par`) REFERENCES `psychologue` (`id`) ON DELETE SET NULL;
