/**
 * Script principal pour le dashboard Les Audacieuses
 * Gère les fonctionnalités communes à toutes les pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Gestion des menus déroulants
    const dropdowns = document.querySelectorAll('.sort-dropdown');
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.btn-sort');
        const options = dropdown.querySelector('.sort-options');
        
        if (button && options) {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                options.style.display = options.style.display === 'block' ? 'none' : 'block';
            });
            
            document.addEventListener('click', function() {
                options.style.display = 'none';
            });
            
            options.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });
    
    // Gestion des popups génériques
    const popups = document.querySelectorAll('.popup-container');
    
    popups.forEach(popup => {
        const closeButtons = popup.querySelectorAll('[data-dismiss="popup"]');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                popup.style.display = 'none';
            });
        });
        
        // Fermer le popup en cliquant en dehors du contenu
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                popup.style.display = 'none';
            }
        });
    });
    
    // Afficher une notification
    window.showNotification = function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Afficher la notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Masquer la notification après 5 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Supprimer la notification après la transition
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // Fermer la notification en cliquant sur le bouton
        notification.querySelector('.close-notification').addEventListener('click', function() {
            notification.classList.remove('show');
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    };
    
    // Validation commune des formulaires
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const requiredInputs = form.querySelectorAll('[required]');
        
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Ajouter un message d'erreur si nécessaire
                    const errorMessage = input.parentElement.querySelector('.error-message');
                    
                    if (!errorMessage) {
                        const message = document.createElement('div');
                        message.className = 'error-message';
                        message.textContent = 'Ce champ est requis';
                        input.parentElement.appendChild(message);
                    }
                } else {
                    input.classList.remove('error');
                    
                    // Supprimer le message d'erreur si existant
                    const errorMessage = input.parentElement.querySelector('.error-message');
                    
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
        
        // Supprimer les messages d'erreur lors de la saisie
        requiredInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (input.value.trim()) {
                    input.classList.remove('error');
                    
                    const errorMessage = input.parentElement.querySelector('.error-message');
                    
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                }
            });
        });
    });
});

// Draw circular progress rings for each patient
document.addEventListener('DOMContentLoaded', function() {
    const rings = document.querySelectorAll('.progress-ring');
    rings.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        const completed = parseInt(canvas.dataset.completed, 10) || 0;
        const assigned = parseInt(canvas.dataset.assigned, 10) || 0;
        const percent = assigned > 0 ? completed / assigned : 0;
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const thickness = 12; // augmenté de 8 => 12 pour un anneau plus épais
        const radius = (Math.min(width, height) / 2) - thickness;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#e6e6e6';
        ctx.lineWidth = thickness;
        ctx.stroke();

        // Progress arc
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (2 * Math.PI * percent);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        ctx.lineWidth = thickness;
        ctx.stroke();
    });
});