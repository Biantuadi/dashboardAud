/**
 * Script pour la page de connexion
 * Gère la validation du formulaire et les animations
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            let isValid = true;
            let errorMessage = '';
            
            // Validation simple du format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                isValid = false;
                errorMessage = 'Veuillez entrer une adresse email valide.';
            }
            
            // Validation du mot de passe (non vide)
            if (!password.trim()) {
                isValid = false;
                errorMessage = errorMessage || 'Le mot de passe est requis.';
            }
            
            // Afficher les erreurs si nécessaire
            if (!isValid) {
                e.preventDefault();
                
                // Créer ou mettre à jour le message d'erreur
                let errorDiv = document.querySelector('.error-message');
                
                if (!errorDiv) {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    loginForm.insertBefore(errorDiv, loginForm.firstChild);
                }
                
                errorDiv.textContent = errorMessage;
                
                // Effet visuel sur les champs invalides
                if (!emailRegex.test(email)) {
                    document.getElementById('email').classList.add('input-error');
                }
                
                if (!password.trim()) {
                    document.getElementById('password').classList.add('input-error');
                }
            }
        });
        
        // Supprimer les effets d'erreur pendant la saisie
        const inputs = loginForm.querySelectorAll('input');
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('input-error');
                
                // Vérifier si tous les champs sont corrigés
                const stillHasErrors = loginForm.querySelectorAll('.input-error').length > 0;
                
                if (!stillHasErrors) {
                    const errorDiv = document.querySelector('.error-message');
                    if (errorDiv) {
                        errorDiv.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // Animation de fond si présente
    const loginBackground = document.querySelector('.login-page');
    
    if (loginBackground) {
        // Ajouter une légère animation pour améliorer l'expérience utilisateur
        loginBackground.classList.add('background-animate');
    }
});