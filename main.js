/* ==========================================================================
   1. GLOBAL STATE & NAVIGATION UTILITIES
   ========================================================================== */

// Global Carousel State Variables
window.currentSlideIndex = 0;
window.carouselTimer = null;

/**
 * Navigation Menu Toggle
 */
function toggleMenu() {
    const nav = document.getElementById("navMenu");
    if (nav) {
        nav.style.display = nav.style.display === "flex" ? "none" : "flex";
        nav.classList.toggle("active");
    }
}

/**
 * Sidebar Drawer Toggle
 */
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
        sidebar.classList.toggle("collapsed");
    }
}


/* ==========================================================================
   2. WEIGHBRIDGE HERO CAROUSEL ENGINE (WITH NULL GUARDS)
   ========================================================================== */

/**
 * Renders active carousel slide by applying horizontal translateX transform.
 */
function renderCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return; // Exit gracefully if not present on page

    const dots = document.querySelectorAll('#carouselDots .dot');
    const totalSlides = track.children.length;
    if (totalSlides === 0) return;
    
    // Boundary checks
    if (window.currentSlideIndex >= totalSlides) window.currentSlideIndex = 0;
    if (window.currentSlideIndex < 0) window.currentSlideIndex = totalSlides - 1;

    // Apply horizontal shift
    track.style.transform = `translateX(-${window.currentSlideIndex * 100}%)`;

    // Update dot indicator styling safely
    if (dots && dots.length > 0) {
        dots.forEach((dot, idx) => {
            if (dot) {
                if (idx === window.currentSlideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            }
        });
    }
}

/**
 * Advance or reverse slide direction (-1 or +1)
 */
function moveCarousel(direction) {
    window.currentSlideIndex += direction;
    renderCarousel();
    resetCarouselTimer();
}

/**
 * Jump directly to slide index
 */
function goToSlide(index) {
    window.currentSlideIndex = index;
    renderCarousel();
    resetCarouselTimer();
}

/**
 * Starts 4-second auto-play timer
 */
function startCarouselAutoPlay() {
    if (window.carouselTimer) clearInterval(window.carouselTimer);
    window.carouselTimer = setInterval(() => {
        window.currentSlideIndex++;
        renderCarousel();
    }, 4000);
}

/**
 * Resets auto-play timer on user manual click
 */
function resetCarouselTimer() {
    if (window.carouselTimer) clearInterval(window.carouselTimer);
    startCarouselAutoPlay();
}


/* ==========================================================================
   3. PRODUCT CATALOG FILTERING & SEARCH
   ========================================================================== */

/**
 * Filter product display cards by category tag
 */
function filterProducts(category, clickedItem) {
    // Update active class on category menu items
    const categoryList = document.querySelectorAll("#categoryList li");
    if (categoryList) {
        categoryList.forEach(li => li.classList.remove("active"));
    }
    if (clickedItem) clickedItem.classList.add("active");

    // Toggle visibility of matching products
    const products = document.querySelectorAll(".product");
    if (products) {
        products.forEach(product => {
            const matches = category === "all" || product.dataset.category === category;
            product.style.display = matches ? "block" : "none";
        });
    }
}

/**
 * Live search filter for catalog products
 */
function searchProducts() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    const input = searchInput.value.toLowerCase().trim();
    const products = document.querySelectorAll(".product");

    if (products) {
        products.forEach(p => {
            const nameMatch = p.dataset.name ? p.dataset.name.toLowerCase().includes(input) : false;
            p.style.display = nameMatch ? "block" : "none";
        });
    }
}


/* ==========================================================================
   4. WHATSAPP INTEGRATION & CONTACT ROUTING
   ========================================================================== */

function sendToWhatsApp(productName) {
    const phoneNumber = "254723117400";
    const message = `Hello Everlast, I'm interested in the ${productName}. Please share more details.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
}

function openWhatsAppGeneral(customMessage) {
    const phoneNumber = "254712244184";
    const defaultText = "Hello Everlast, I would like to inquire about your weighing solutions.";
    const message = customMessage || defaultText;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
}

function contact() {
    openWhatsAppGeneral();
}


/* ==========================================================================
   5. PRODUCT DETAIL MODAL & QUOTE FORM HANDLERS
   ========================================================================== */

let currentProduct = "";

function openModal(element) {
    if (!element) return;
    currentProduct = element.dataset.name || "Product Inquiry";

    const modalTitle = document.getElementById("modalTitle");
    const modalSpecs = document.getElementById("modalSpecs");
    const modalDesc = document.getElementById("modalDescription");
    const modalImg = document.getElementById("modalImage");
    const modal = document.getElementById("productModal");

    if (modalTitle) modalTitle.innerText = element.dataset.name || "";
    if (modalSpecs) modalSpecs.innerText = element.dataset.specs || "";
    if (modalDesc) modalDesc.innerText = element.dataset.description || "";
    if (modalImg) modalImg.src = element.dataset.image || "";

    // Clear form fields each time modal opens
    const quoteName = document.getElementById("quoteName");
    const quotePhone = document.getElementById("quotePhone");
    const quoteEmail = document.getElementById("quoteEmail");
    const quoteDetails = document.getElementById("quoteDetails");

    if (quoteName) quoteName.value = "";
    if (quotePhone) quotePhone.value = "";
    if (quoteEmail) quoteEmail.value = "";
    if (quoteDetails) quoteDetails.value = "";

    if (modal) modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("productModal");
    if (modal) modal.style.display = "none";
}

// Close modal when clicking the backdrop container
function handleModalOutsideClick(event) {
    const modal = document.getElementById("productModal");
    if (modal && event.target === modal) {
        closeModal();
    }
}

/**
 * Handle quote submission from modal form
 */
function submitQuote() {
    const nameEl = document.getElementById("quoteName");
    const phoneEl = document.getElementById("quotePhone");
    const emailEl = document.getElementById("quoteEmail");
    const detailsEl = document.getElementById("quoteDetails");

    const name = nameEl ? nameEl.value.trim() : "";
    const phone = phoneEl ? phoneEl.value.trim() : "";
    const email = emailEl ? emailEl.value.trim() : "";
    const details = detailsEl ? detailsEl.value.trim() : "";

    if (!name || !phone) {
        alert("Please fill in your name and phone number.");
        return;
    }

    const leadId = "EV-" + Date.now();
    const timestamp = new Date().toLocaleString();

    const quote = { id: leadId, product: currentProduct, name, phone, email, details, time: timestamp };

    // Save quote lead to local storage
    let quotes = JSON.parse(localStorage.getItem("everlast_quotes")) || [];
    quotes.push(quote);
    localStorage.setItem("everlast_quotes", JSON.stringify(quotes));

    // Send formatted quote message via WhatsApp
    const phoneNumber = "254723117400";
    const message =
`Hello Everlast,

📋 QUOTE REQUEST

Name: ${name}
Phone: ${phone}
Email: ${email || "Not provided"}

Product: ${currentProduct}

Details: ${details || "None"}

Quote ID: ${leadId}`;

    window.location.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}


/* ==========================================================================
   6. DOM INITIALIZATION & EVENT ATTACHMENTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize Weighbridge Carousel engine if element exists
    const track = document.getElementById('carouselTrack');
    if (track) {
        renderCarousel();
        startCarouselAutoPlay();
    }

    // 2. Safely attach listener to modal button if present
    const modalBtn = document.getElementById("modalBtn");
    if (modalBtn) {
        modalBtn.onclick = function () {
            sendToWhatsApp(currentProduct);
        };
    }

    // 3. Attach scroll fade-in animation observers safely
    const fadeElements = document.querySelectorAll(".fade-in");
    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        });

        fadeElements.forEach(el => observer.observe(el));
    }
});
