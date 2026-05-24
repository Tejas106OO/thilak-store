document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Mobile Navigation Drawer Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileNavToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons({ attrs: { class: 'lucide-icon' } });
            }
        });

        // Close mobile drawer when clicking a link
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileNavToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // 3. Catalog Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const idCards = document.querySelectorAll('.id-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            idCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all') {
                    card.classList.remove('hidden');
                } else if (cardCategory === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    // Custom Scouter card should always remain visible at the end of "All" but can be filtered
                    if (card.classList.contains('card-custom-req') && filterValue !== 'all') {
                        card.classList.add('hidden');
                    } else if (card.classList.contains('card-custom-req') && filterValue === 'all') {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });

    // 4. Modal Dialog Native & Fallback Control
    const dialogTriggers = document.querySelectorAll('[commandfor]');
    
    dialogTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const targetId = trigger.getAttribute('commandfor');
            const command = trigger.getAttribute('command');
            const targetElement = document.getElementById(targetId);

            if (targetElement && targetElement.tagName === 'DIALOG') {
                e.preventDefault();
                if (command === 'show-modal') {
                    targetElement.showModal();
                } else if (command === 'close') {
                    targetElement.close();
                }
            }
        });
    });

    // Close Dialog by clicking outside (on backdrop)
    const dialogs = document.querySelectorAll('dialog');
    dialogs.forEach(dialog => {
        dialog.addEventListener('click', (e) => {
            const rect = dialog.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY &&
                e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX &&
                e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                dialog.close();
            }
        });
    });

    // 5. Conditional Form Fields (Show Location for Patna Offline Deal)
    const dealTypeRadios = document.querySelectorAll('input[name="deal_type"]');
    const locationField = document.getElementById('location-field');
    const locationInput = document.getElementById('user-location');

    dealTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'Offline Meeting in Patna') {
                locationField.style.display = 'flex';
                locationInput.setAttribute('required', 'true');
            } else {
                locationField.style.display = 'none';
                locationInput.removeAttribute('required');
            }
        });
    });

    // 6. Custom ID Request - Form Submit to WhatsApp Prefill Formatter
    const customIdForm = document.getElementById('custom-id-form');
    const whatsappAgencyNumber = '919876543210'; // Agency contact number

    if (customIdForm) {
        customIdForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Fetch Form Data
            const name = document.getElementById('user-name').value.trim();
            const whatsapp = document.getElementById('user-whatsapp').value.trim();
            const budget = document.getElementById('user-budget').value;
            const level = document.getElementById('user-level').value;
            
            let dealMode = 'Online Delivery';
            dealTypeRadios.forEach(radio => {
                if (radio.checked) {
                    dealMode = radio.value;
                }
            });

            const location = locationInput.value.trim();
            const requirements = document.getElementById('user-requirements').value.trim();

            // Construct WhatsApp Message Template
            let message = `*🔥 NEW CUSTOM ID REQUEST 🔥*\n\n`;
            message += `👤 *Customer Name:* ${name}\n`;
            message += `📱 *WhatsApp:* ${whatsapp}\n`;
            message += `💰 *Budget Range:* ₹${budget}\n`;
            message += `⭐ *Account Level:* ${level}\n`;
            message += `🤝 *Deal Mode:* ${dealMode}\n`;
            
            if (dealMode === 'Offline Meeting in Patna' && location) {
                message += `📍 *Meeting Location (Patna):* ${location}\n`;
            }
            
            if (requirements) {
                message += `🔫 *Requirements/Rare Items:* ${requirements}\n`;
            } else {
                message += `🔫 *Requirements:* Any good account in budget\n`;
            }
            
            message += `\n_Submitted via Thilak Store Web Store._`;

            // URL Encode text
            const encodedText = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappAgencyNumber}?text=${encodedText}`;

            // Open WhatsApp in a new window/tab
            window.open(whatsappUrl, '_blank');

            // Close dialog
            const parentDialog = customIdForm.closest('dialog');
            if (parentDialog) {
                parentDialog.close();
            }

            // Reset form
            customIdForm.reset();
            locationField.style.display = 'none';
            locationInput.removeAttribute('required');
        });
    }

    // 7. Scroll-Reveal Animation using IntersectionObserver
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null, // Viewport
            rootMargin: '0px',
            threshold: 0.1 // Triggers when 10% of element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Once revealed, no need to track it further
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for older browsers: show elements immediately
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }
});
