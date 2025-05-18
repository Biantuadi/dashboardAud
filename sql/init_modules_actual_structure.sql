/**
 * Script pour ajouter des données de test pour les modules
 * en respectant la structure de la base de données existante
 */

-- Insérer une catégorie par défaut si la table est vide
INSERT INTO `categorie` (`nom`, `description`) 
SELECT 'Développement personnel', 'Modules pour le développement personnel'
WHERE NOT EXISTS (SELECT 1 FROM `categorie` LIMIT 1);

-- Récupérer l'ID de la catégorie pour l'utiliser dans l'insertion des modules
SET @categorie_id = (SELECT id FROM `categorie` LIMIT 1);

-- Ajout de données de test pour les modules
INSERT INTO `module` (`id_categorie`, `titre`, `description`, `est_gratuit`) VALUES
(@categorie_id, 'Confiance en soi', 'Module pour développer sa confiance en soi', 1),
(@categorie_id, 'Préparation à l\'entretien', 'Techniques pour réussir ses entretiens d\'embauche', 1),
(@categorie_id, 'CV et lettre de motivation', 'Rédiger un CV et une lettre de motivation efficaces', 1);

-- Création de la table de relation module_patient si elle n'existe pas
CREATE TABLE IF NOT EXISTS `module_patient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `date_assignment` datetime NOT NULL DEFAULT current_timestamp(),
  `progression` int(3) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `module_id` (`module_id`),
  KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
