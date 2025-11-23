    // Script spécifique à la page contact
        // Gestion de la soumission du formulaire
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Récupération des valeurs
                const nom = document.getElementById('nom').value;
                const email = document.getElementById('email').value;
                const telephone = document.getElementById('telephone').value;
                const message = document.getElementById('message').value;
                
                // Afficher un message de confirmation
                alert('Merci ' + nom + ' ! Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');
                
                // Réinitialiser le formulaire
                this.reset();
            });
        }