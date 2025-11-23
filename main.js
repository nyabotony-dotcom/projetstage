// ====== ATTENDRE QUE LA PAGE SOIT CHARGÉE ======
document.addEventListener("DOMContentLoaded", () => {

  // ====== VARIABLES GLOBALES ======
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("overlay");
  const navbar = document.querySelector(".navbar");

  // Variables du panier
  const cartButton = document.getElementById("cart-button");
  const cartPanel = document.getElementById("cart-panel");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const payBtn = document.getElementById("pay-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");

  // Variables du modal produits
  const modal = document.getElementById("subproduct-modal");
  const closeModalBtn = modal.querySelector(".close");
  const modalTitle = document.getElementById("modal-product-title");
  const subproductsGrid = modal.querySelector(".subproducts-grid");
  const voirPlusButtons = document.querySelectorAll(".voir-plus");

  // Variables du modal paiement
  const paymentModal = document.getElementById("payment-modal");
  const closePaymentBtn = document.getElementById("close-payment");
  const paymentOptions = document.querySelectorAll(".payment-option");

  // Tableau pour stocker les produits du panier
  let cart = [];

  // ====== FONCTION: NAVBAR SCROLL EFFECT ======
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // ====== FONCTION: MENU BURGER (MOBILE) ======
  burger.addEventListener("click", () => {
    // Toggle le menu mobile
    mobileMenu.classList.toggle("active");
    burger.classList.toggle("active");
    overlay.classList.toggle("active");

    // Empêcher le scroll quand le menu est ouvert
    if (mobileMenu.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Fermer le menu mobile quand on clique sur un lien
  const mobileLinks = document.querySelectorAll(".mobile-link");
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      burger.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // ====== FONCTION: OUVRIR/FERMER LE PANIER ======
  cartButton.addEventListener("click", () => {
    cartPanel.setAttribute("aria-hidden", "false");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  closeCartBtn.addEventListener("click", () => {
    cartPanel.setAttribute("aria-hidden", "true");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Fermer le panier en cliquant sur l'overlay
  overlay.addEventListener("click", () => {
    cartPanel.setAttribute("aria-hidden", "true");
    mobileMenu.classList.remove("active");
    burger.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  voirPlusButtons.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");
      modal.setAttribute("aria-hidden", "false");
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
      modalTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}`;

      const categoryGroups = subproductsGrid.querySelectorAll(".category-group");
      categoryGroups.forEach(group => {
        if (group.getAttribute("data-category") === category) {
          group.classList.add("active"); // ✅ NOUVEAU CODE
        } else {
          group.classList.remove("active"); // ✅ NOUVEAU CODE
        }
      });
    });
  });
  // ====== FONCTION: FERMER LE MODAL ======
  closeModalBtn.addEventListener("click", () => {
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";
    document.body.style.overflow = "";
  });

  // Fermer le modal en cliquant en dehors
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.setAttribute("aria-hidden", "true");
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  });

  // ====== FONCTION: AJOUTER AU PANIER ======
  subproductsGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      // Récupérer les informations du produit
      const button = e.target;
      const productName = button.getAttribute("data-name");
      const productPrice = parseInt(button.getAttribute("data-price"));
      const productImage = button.getAttribute("data-image");

      // Créer l'objet produit
      const product = {
        name: productName,
        price: productPrice,
        image: productImage
      };

      // Ajouter au panier
      cart.push(product);

      // Mettre à jour l'affichage
      updateCart();

      // Notification
      showNotification(`${productName} ajouté au panier !`);
    }
  });

  // ====== FONCTION: METTRE À JOUR LE PANIER ======
  function updateCart() {
    // Mettre à jour le compteur
    cartCount.textContent = cart.length;

    // Calculer le total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `${formatPrice(total)} FCFA`;

    // Afficher les produits
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p style="text-align: center; color: #aaa; padding: 20px;">Votre panier est vide</p>';
      return;
    }

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>${formatPrice(item.price)} FCFA</p>
        </div>
        <button class="remove-item" data-index="${index}">×</button>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    // Ajouter les événements de suppression
    const removeButtons = document.querySelectorAll(".remove-item");
    removeButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        removeFromCart(index);
      });
    });
  }

  // ====== FONCTION: SUPPRIMER UN PRODUIT DU PANIER ======
  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    showNotification("Produit retiré du panier");
  }

  // ====== FONCTION: VIDER LE PANIER ======
  clearCartBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showNotification("Le panier est déjà vide");
      return;
    }

    if (confirm("Voulez-vous vraiment vider le panier ?")) {
      cart = [];
      updateCart();
      showNotification("Panier vidé avec succès");
    }
  });

  // ====== FONCTION: FORMATER LE PRIX ======
  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  // ====== FONCTION: NOTIFICATION ======
  function showNotification(message) {
    // Créer la notification
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: linear-gradient(135deg, #00bcd4, #1e88e5);
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 188, 212, 0.5);
      z-index: 9999;
      font-weight: 600;
      animation: slideInRight 0.4s ease;
    `;
    notification.textContent = message;

    // Ajouter l'animation CSS
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);

    // Ajouter au DOM
    document.body.appendChild(notification);

    // Supprimer après 3 secondes
    setTimeout(() => {
      notification.style.animation = "slideInRight 0.4s ease reverse";
      setTimeout(() => {
        notification.remove();
      }, 400);
    }, 3000);
  }

  // ====== FONCTION: COMMANDER VIA WHATSAPP ======
  subproductsGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("order-whatsapp")) {
      const button = e.target;
      const productName = button.getAttribute("data-name");
      const productPrice = parseInt(button.getAttribute("data-price"));

      // Numéro WhatsApp (remplacez par votre numéro)
      const phoneNumber = "237697846295"; // ⚠️ Mettez votre numéro ici

      // Message
      const message = `Bonjour TonyTech,\n\nJe souhaite commander :\n\n📦 Produit : ${productName}\n💰 Prix : ${formatPrice(productPrice)} FCFA\n\nMerci !`;

      // URL WhatsApp
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

      // Ouvrir WhatsApp
      window.open(whatsappURL, "_blank");
    }
  });

  // ====== FONCTION: COMMANDER TOUT LE PANIER VIA WHATSAPP ======
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showNotification("Votre panier est vide !");
      return;
    }

    // Numéro WhatsApp (remplacez par votre numéro)
    const phoneNumber = "237XXXXXXXXX"; // ⚠️ Mettez votre numéro ici

    // Créer le message avec tous les produits
    let message = "Bonjour TonyTech,\n\nJe souhaite commander :\n\n";

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - ${formatPrice(item.price)} FCFA\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `\n💰 Total : ${formatPrice(total)} FCFA\n\nMerci !`;

    // URL WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Ouvrir WhatsApp
    window.open(whatsappURL, "_blank");
  });

  // ====== FONCTION: OUVRIR LE MODAL DE PAIEMENT ======
  payBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showNotification("Votre panier est vide !");
      return;
    }

    paymentModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // ====== FONCTION: FERMER LE MODAL DE PAIEMENT ======
  closePaymentBtn.addEventListener("click", () => {
    paymentModal.classList.remove("active");
    document.body.style.overflow = "";
  });

  // ====== FONCTION: TRAITER LE PAIEMENT ======
  paymentOptions.forEach(option => {
    option.addEventListener("click", () => {
      const method = option.getAttribute("data-method");
      const total = cart.reduce((sum, item) => sum + item.price, 0);

      let methodName = "";
      if (method === "om") {
        methodName = "Orange Money";
      } else if (method === "mtn") {
        methodName = "MTN Money";
      }

      // Ici vous pouvez ajouter l'intégration avec votre système de paiement
      showNotification(`Paiement de ${formatPrice(total)} FCFA via ${methodName} en cours...`);

      // Simulation de paiement
      setTimeout(() => {
        showNotification("Paiement effectué avec succès ! ✅");
        cart = [];
        updateCart();
        paymentModal.classList.remove("active");
        cartPanel.setAttribute("aria-hidden", "true");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      }, 2000);
    });
  });

  // ====== INITIALISATION: Mettre à jour le panier au chargement ======
  updateCart();

  // ====== EFFET: Smooth scroll pour les liens d'ancrage ======
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  console.log("✅ TonyTech E-commerce chargé avec succès !");
});
// Configuration du carrousel
// ====== CAROUSEL FUNCTIONALITY ======
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('indicators');
const slides = document.querySelectorAll('.carousel-slide');

let currentIndex = 0;
let slidesToShow = 3;
let autoPlayInterval;

// Responsive slides
function updateSlidesToShow() {
  if (window.innerWidth <= 768) {
    slidesToShow = 1;
  } else if (window.innerWidth <= 1024) {
    slidesToShow = 2;
  } else {
    slidesToShow = 3;
  }
  updateCarousel();
  createIndicators();
}

// Create indicators
function createIndicators() {
  indicatorsContainer.innerHTML = '';
  const totalPages = Math.ceil(slides.length - slidesToShow + 1);
  for (let i = 0; i < totalPages; i++) {
    const indicator = document.createElement('button');
    indicator.classList.add('indicator');
    if (i === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(i));
    indicatorsContainer.appendChild(indicator);
  }
}

// Update carousel position
function updateCarousel() {
  const slideWidth = slides[0].offsetWidth + 30; // width + gap
  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

  // Update indicators
  document.querySelectorAll('.indicator').forEach((ind, i) => {
    ind.classList.toggle('active', i === currentIndex);
  });
}

// Go to specific slide
function goToSlide(index) {
  const maxIndex = slides.length - slidesToShow;
  currentIndex = Math.max(0, Math.min(index, maxIndex));
  updateCarousel();
}

// Next slide
function nextSlide() {
  const maxIndex = slides.length - slidesToShow;
  if (currentIndex < maxIndex) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateCarousel();
}

// Previous slide
function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = slides.length - slidesToShow;
  }
  updateCarousel();
}

// Auto play
function startAutoPlay() {
  autoPlayInterval = setInterval(nextSlide, 4000);
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

// Event listeners
nextBtn.addEventListener('click', () => {
  nextSlide();
  stopAutoPlay();
  startAutoPlay();
});

prevBtn.addEventListener('click', () => {
  prevSlide();
  stopAutoPlay();
  startAutoPlay();
});

// Stop autoplay on hover
track.addEventListener('mouseenter', stopAutoPlay);
track.addEventListener('mouseleave', startAutoPlay);

// Responsive
window.addEventListener('resize', updateSlidesToShow);

// ====== COUNTER ANIMATION ======
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

// Intersection Observer for counter animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-target]');
      counters.forEach(counter => animateCounter(counter));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

observer.observe(document.querySelector('.stats-wrapper'));

// Initialize
updateSlidesToShow();
startAutoPlay();
// ====== NEWSLETTER FORM ======
document.getElementById('newsletterForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = this.querySelector('input').value;

  // Animation de succès
  const btn = this.querySelector('button');
  const originalText = btn.textContent;
  btn.textContent = '✓ Inscrit !';
  btn.style.background = 'linear-gradient(135deg, #25d366, #1ebe5d)';

  // Réinitialiser après 3 secondes
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    this.reset();
  }, 3000);

  // Ici vous pouvez ajouter l'envoi vers votre backend
  console.log('Newsletter:', email);
});

// ====== SCROLL TO TOP BUTTON ======
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', function () {
  if (window.pageYOffset > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
// ====== GESTION DES CLICS SUR LE CARROUSEL ====== 
document.addEventListener('DOMContentLoaded', function () {

  // Sélectionner tous les slides du carrousel
  const carouselSlides = document.querySelectorAll('.carousel-slide');

  carouselSlides.forEach(slide => {
    slide.addEventListener('click', function () {
      // Récupérer la catégorie et le nom du produit
      const category = this.getAttribute('data-category');
      const productName = this.getAttribute('data-product');

      console.log('Catégorie:', category);
      console.log('Produit:', productName);

      // Ouvrir le modal des sous-produits
      const modal = document.getElementById('subproduct-modal');
      const modalTitle = document.getElementById('modal-product-title');

      // ✅ CORRECTION : Utiliser classList au lieu de style.display
      const allCategories = document.querySelectorAll('.category-group');
      allCategories.forEach(cat => {
        cat.classList.remove('active'); // Utiliser classList
      });

      // Afficher uniquement la catégorie sélectionnée
      const selectedCategory = document.querySelector(`.category-group[data-category="${category}"]`);
      if (selectedCategory) {
        selectedCategory.classList.add('active'); // Utiliser classList

        // Mettre à jour le titre du modal
        const categoryNames = {
          'ordinateur': 'Ordinateurs',
          'telephone': 'Téléphones',
          'imprimante': 'Imprimantes',
          'clavier': 'Claviers',
          'ecouteurs': 'Écouteurs',
          'souris': 'Souris',
          'manettes': 'Manettes',
          'ecran': 'Écrans'
        };
        modalTitle.textContent = categoryNames[category] || 'Produits';
      }

      // Afficher le modal
      modal.setAttribute("aria-hidden", "false");
      modal.style.display = "block";
      document.body.style.overflow = "hidden";

      // Scroll vers le produit spécifique si possible
      setTimeout(() => {
        const productCards = selectedCategory.querySelectorAll('.subproduct-card');
        productCards.forEach(card => {
          const cardTitle = card.querySelector('h4').textContent;
          if (cardTitle === productName) {
            // Mettre en surbrillance le produit
            card.style.border = '3px solid #667eea';
            card.style.animation = 'pulse 1s ease-in-out 2';

            // Scroll vers le produit
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Retirer la surbrillance après 3 secondes
            setTimeout(() => {
              card.style.border = '';
              card.style.animation = '';
            }, 3000);
          }
        });
      }, 300);
    });
  });

});

// Animation pulse pour le produit ciblé
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
`;
document.head.appendChild(style);
// ====== SMOOTH SCROLL POUR TOUS LES LIENS ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});
// ====== SYSTÈME DE RECHERCHE INTELLIGENT ======
// ====== FONCTIONNALITÉ DE RECHERCHE ======

// Base de données de tous les produits (à extraire du HTML)
const produitsDatabase = [
  // Ordinateurs
  { name: "HP Pavilion 15", category: "ordinateur", price: 350000, image: "image/pc.jpg", description: "Intel Core i5, 8GB RAM, 512GB SSD" },
  { name: "Dell Inspiron 14", category: "ordinateur", price: 450000, image: "image/pc.jpg", description: "Intel Core i7, 16GB RAM, 1TB SSD" },
  { name: "Lenovo ThinkPad X1", category: "ordinateur", price: 520000, image: "image/pc.jpg", description: "Intel Core i7, 16GB RAM, 512GB SSD" },
  { name: "Asus VivoBook 15", category: "ordinateur", price: 320000, image: "image/pc.jpg", description: "Intel Core i5, 8GB RAM, 256GB SSD" },
  { name: "MacBook Air M2", category: "ordinateur", price: 650000, image: "image/pc.jpg", description: "Puce M2, 8GB RAM, 256GB SSD" },
  { name: "Acer Aspire 5", category: "ordinateur", price: 380000, image: "image/pc.jpg", description: "Intel Core i5, 12GB RAM, 512GB SSD" },
  { name: "MSI GF63 Gaming", category: "ordinateur", price: 580000, image: "image/pc.jpg", description: "Intel Core i7, 16GB RAM, RTX 3050" },
  { name: "HP EliteBook 840", category: "ordinateur", price: 620000, image: "image/pc.jpg", description: "Intel Core i7, 16GB RAM, 1TB SSD" },
  { name: "Dell XPS 13", category: "ordinateur", price: 680000, image: "image/pc.jpg", description: "Intel Core i7, 16GB RAM, 512GB SSD" },
  { name: "Lenovo IdeaPad 3", category: "ordinateur", price: 340000, image: "image/pc.jpg", description: "AMD Ryzen 5, 8GB RAM, 512GB SSD" },
  { name: "Asus TUF Gaming A15", category: "ordinateur", price: 720000, image: "image/pc.jpg", description: "AMD Ryzen 7, 16GB RAM, RTX 3060" },
  { name: "MacBook Pro M3", category: "ordinateur", price: 1200000, image: "image/pc.jpg", description: "Puce M3 Pro, 16GB RAM, 512GB SSD" },

  // Téléphones
  { name: "Samsung Galaxy A54", category: "telephone", price: 250000, image: "image/téléphone 1.jpg", description: "6GB RAM, 128GB, Écran AMOLED" },
  { name: "iPhone 13", category: "telephone", price: 550000, image: "image/téléphone 2.jpg", description: "128GB, Puce A15 Bionic" },
  { name: "Xiaomi Redmi Note 13", category: "telephone", price: 180000, image: "image/téléphone 3.jpg", description: "8GB RAM, 256GB, Écran 120Hz" },
  { name: "iPhone 15 Pro", category: "telephone", price: 750000, image: "image/téléphone 4.jpg", description: "256GB, Puce A17 Pro, Titane" },
  { name: "Samsung Galaxy S24", category: "telephone", price: 620000, image: "image/téléphone 6.jpg", description: "12GB RAM, 256GB, Snapdragon 8 Gen 3" },
  { name: "Google Pixel 8", category: "telephone", price: 450000, image: "image/téléphone 7.jpg", description: "8GB RAM, 128GB, Tensor G3" },
  { name: "OnePlus 12", category: "telephone", price: 580000, image: "image/téléphone 8.jpg", description: "16GB RAM, 512GB, Snapdragon 8 Gen 3" },
  { name: "Oppo Find X6", category: "telephone", price: 520000, image: "images/telephone.jpg", description: "12GB RAM, 256GB, Caméra Hasselblad" },
  { name: "Vivo X100", category: "telephone", price: 480000, image: "images/telephone.jpg", description: "12GB RAM, 512GB, MediaTek 9300" },
  { name: "Realme GT 5", category: "telephone", price: 380000, image: "images/telephone.jpg", description: "12GB RAM, 256GB, Snapdragon 8 Gen 2" },
  { name: "Tecno Phantom X2", category: "telephone", price: 280000, image: "images/telephone.jpg", description: "8GB RAM, 256GB, MediaTek 9000" },
  { name: "Infinix Zero 30", category: "telephone", price: 220000, image: "images/telephone.jpg", description: "12GB RAM, 256GB, MediaTek 8200" },

  // Imprimantes
  { name: "Canon Pixma G3020", category: "imprimante", price: 120000, image: "images/imprimante.jpg", description: "Impression couleur, WiFi, Tank" },
  { name: "HP LaserJet Pro M404dn", category: "imprimante", price: 180000, image: "images/imprimante.jpg", description: "Impression laser N/B, Recto-verso" },
  { name: "Epson EcoTank L3250", category: "imprimante", price: 135000, image: "images/imprimante.jpg", description: "Multifonction, WiFi, Tank" },
  { name: "Brother DCP-L2550DW", category: "imprimante", price: 210000, image: "images/imprimante.jpg", description: "Laser monochrome, WiFi, Duplex" },

  // Claviers
  { name: "Logitech K380", category: "clavier", price: 25000, image: "images/clavier.jpg", description: "Bluetooth, Compact, Multi-device" },
  { name: "Razer BlackWidow V3", category: "clavier", price: 85000, image: "images/clavier.jpg", description: "Mécanique, RGB, Green Switch" },
  { name: "Corsair K70 RGB PRO", category: "clavier", price: 95000, image: "images/clavier.jpg", description: "Mécanique, Cherry MX, RGB" },
  { name: "Keychron K8", category: "clavier", price: 65000, image: "images/clavier.jpg", description: "Mécanique sans fil, Hot-swap" },

  // Écouteurs
  { name: "AirPods Pro 2", category: "ecouteurs", price: 150000, image: "images/ecouteurs.jpg", description: "Réduction de bruit active, Spatial Audio" },
  { name: "Sony WH-1000XM5", category: "ecouteurs", price: 200000, image: "images/ecouteurs.jpg", description: "Casque sans fil, ANC premium, 30h" },
  { name: "Bose QuietComfort Ultra", category: "ecouteurs", price: 220000, image: "images/ecouteurs.jpg", description: "ANC avancé, Immersive Audio" },
  { name: "Samsung Galaxy Buds 2 Pro", category: "ecouteurs", price: 95000, image: "images/ecouteurs.jpg", description: "ANC, 360 Audio, IPX7" }
];

// Éléments DOM
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchSuggestions = document.getElementById('search-suggestions');
const searchContainer = document.getElementById('search-container');

// Variable pour stocker le timeout de recherche
let searchTimeout;

// Fonction de normalisation du texte (pour la recherche insensible aux accents)
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Fonction de recherche
function searchProducts(query) {
  if (!query || query.trim().length < 2) {
    searchSuggestions.classList.remove('active');
    return [];
  }

  const normalizedQuery = normalizeText(query);

  return produitsDatabase.filter(product => {
    const normalizedName = normalizeText(product.name);
    const normalizedCategory = normalizeText(product.category);
    const normalizedDescription = normalizeText(product.description);

    return normalizedName.includes(normalizedQuery) ||
      normalizedCategory.includes(normalizedQuery) ||
      normalizedDescription.includes(normalizedQuery);
  });
}

// Fonction pour afficher les suggestions
function displaySuggestions(results) {
  searchSuggestions.innerHTML = '';

  if (results.length === 0) {
    searchSuggestions.innerHTML = `
      <div class="no-results">
        <p>🔍 Aucun produit trouvé</p>
        <p style="font-size: 12px; margin-top: 5px;">Essayez avec d'autres mots-clés</p>
      </div>
    `;
    searchSuggestions.classList.add('active');
    return;
  }

  // Limiter à 8 résultats maximum
  results.slice(0, 8).forEach(product => {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.innerHTML = `
      <img src="${product.image}" alt="${product.name}" onerror="this.src='image/pc.jpg'">
      <div class="suggestion-info">
        <div class="suggestion-name">${product.name}</div>
        <div class="suggestion-category">${getCategoryLabel(product.category)}</div>
      </div>
      <div class="suggestion-price">${formatPrice(product.price)}</div>
    `;

    // Événement au clic sur une suggestion
    suggestionItem.addEventListener('click', () => {
      selectProduct(product);
    });

    searchSuggestions.appendChild(suggestionItem);
  });

  searchSuggestions.classList.add('active');
}

// Fonction pour formater le prix
function formatPrice(price) {
  return price.toLocaleString('fr-FR') + ' FCFA';
}

// Fonction pour obtenir le label de catégorie
function getCategoryLabel(category) {
  const labels = {
    'ordinateur': 'Ordinateur',
    'telephone': 'Téléphone',
    'imprimante': 'Imprimante',
    'clavier': 'Clavier',
    'ecouteurs': 'Écouteurs',
    'souris': 'Souris',
    'manettes': 'Manettes',
    'ecran': 'Écran'
  };
  return labels[category] || category;
}

// Fonction pour sélectionner un produit
function selectProduct(product) {
  // Fermer les suggestions
  searchSuggestions.classList.remove('active');

  // Remplir l'input avec le nom du produit
  searchInput.value = product.name;

  // Ouvrir la modal de la catégorie correspondante
  openCategoryModal(product.category);

  // Optionnel : scroll jusqu'au produit dans la modal
  setTimeout(() => {
    scrollToProductInModal(product.name);
  }, 300);
}

// Fonction pour ouvrir la modal d'une catégorie
function openCategoryModal(category) {
  const modal = document.getElementById('subproduct-modal');
  const modalTitle = document.getElementById('modal-product-title');

  // ✅ NOUVEAU CODE :
  // Cacher toutes les catégories
  document.querySelectorAll('.category-group').forEach(group => {
    group.classList.remove('active');  // ✅ UTILISER classList
  });

  // Afficher la catégorie sélectionnée
  const categoryGroup = document.querySelector(`.category-group[data-category="${category}"]`);
  if (categoryGroup) {
    categoryGroup.classList.add('active');  // ✅ UTILISER classList
  }

  // Changer le titre
  modalTitle.textContent = getCategoryLabel(category) + 's';

  // Afficher la modal
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
// Fonction pour scroller jusqu'à un produit dans la modal
function scrollToProductInModal(productName) {
  const subproductCards = document.querySelectorAll('.subproduct-card');

  subproductCards.forEach(card => {
    const cardTitle = card.querySelector('h4').textContent;
    if (cardTitle === productName) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Animation de highlight
      card.style.transition = 'all 0.3s ease';
      card.style.transform = 'scale(1.05)';
      card.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.6)';

      setTimeout(() => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '';
      }, 1000);
    }
  });
}

// Événement sur l'input de recherche
searchInput.addEventListener('input', (e) => {
  const query = e.target.value;

  // Debounce : attendre que l'utilisateur arrête de taper
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const results = searchProducts(query);
    displaySuggestions(results);
  }, 300);
});

// Événement sur le bouton de recherche
searchBtn.addEventListener('click', () => {
  const query = searchInput.value;
  const results = searchProducts(query);

  if (results.length > 0) {
    selectProduct(results[0]); // Sélectionner le premier résultat
  } else {
    displaySuggestions(results); // Afficher "Aucun résultat"
  }
});

// Recherche avec Enter
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    searchBtn.click();
  }
});

// Fermer les suggestions en cliquant ailleurs
document.addEventListener('click', (e) => {
  if (!searchContainer.contains(e.target)) {
    searchSuggestions.classList.remove('active');
  }
});

// Empêcher la fermeture quand on clique dans la zone de recherche
searchContainer.addEventListener('click', (e) => {
  e.stopPropagation();
});

// ====== FONCTIONNALITÉ MOBILE ======

// Créer le bouton toggle pour mobile (si pas déjà dans le HTML)
function createMobileSearchToggle() {
  if (window.innerWidth <= 768) {
    let toggleBtn = document.querySelector('.search-toggle-btn');

    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.className = 'search-toggle-btn';
      toggleBtn.innerHTML = '🔍';
      toggleBtn.setAttribute('aria-label', 'Ouvrir la recherche');

      // Insérer avant le bouton panier
      const cartButton = document.querySelector('.cart-button');
      cartButton.parentNode.insertBefore(toggleBtn, cartButton);

      // Événement pour ouvrir/fermer la recherche mobile
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchContainer.classList.toggle('mobile-active');

        if (searchContainer.classList.contains('mobile-active')) {
          searchInput.focus();
        }
      });
    }
  }
}

// Initialiser au chargement
createMobileSearchToggle();

// Réinitialiser lors du redimensionnement
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    searchContainer.classList.remove('mobile-active');
  }
  createMobileSearchToggle();
});

// Fermer la recherche mobile quand on scroll
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  if (window.innerWidth <= 768 && searchContainer.classList.contains('mobile-active')) {
    if (Math.abs(window.scrollY - lastScrollY) > 50) {
      searchContainer.classList.remove('mobile-active');
    }
  }
  lastScrollY = window.scrollY;
});

console.log('✅ Système de recherche initialisé avec', produitsDatabase.length, 'produits');