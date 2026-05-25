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

    // 6. Custom ID Request - Form Submit to Instagram Prefill Formatter
    const customIdForm = document.getElementById('custom-id-form');

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

            // Construct Message Template
            let message = `🔥 NEW CUSTOM ID REQUEST 🔥\n\n`;
            message += `👤 Customer Name: ${name}\n`;
            message += `📱 Contact WhatsApp: ${whatsapp}\n`;
            message += `💰 Budget Range: ₹${budget}\n`;
            message += `⭐ Account Level: ${level}\n`;
            message += `🤝 Deal Mode: ${dealMode}\n`;
            
            if (dealMode === 'Offline Meeting in Patna' && location) {
                message += `📍 Meeting Location (Patna): ${location}\n`;
            }
            
            if (requirements) {
                message += `🔫 Requirements/Rare Items: ${requirements}\n`;
            } else {
                message += `🔫 Requirements: Any good account in budget\n`;
            }
            
            message += `\nSubmitted via Thilak Store Web Store.`;

            // Open Instagram DM with copied details
            const instagramDmUrl = 'https://ig.me/m/thilak.store';
            handleInstagramRedirect(message, instagramDmUrl);

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

    // 7. Toast Notification & Clipboard Instagram Redirection System
    function showToast(message, isSuccess = true) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${isSuccess ? 'toast-success' : ''}`;
        
        const iconName = isSuccess ? 'check-circle' : 'copy';
        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }

    function handleInstagramRedirect(message, redirectUrl) {
        navigator.clipboard.writeText(message)
            .then(() => {
                showToast('Details copied to clipboard! Paste them in the DM chat.', true);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                showToast('Redirecting to Instagram DM...', false);
            });

        window.open(redirectUrl, '_blank');
    }

    // 8. Reusable functions for Instagram DM Order Flow
    function generateInstagramOrderMessage(product) {
        let message = `Hello, I want to buy this Free Fire ID.\n\n`;
        message += `ID Name: ${product.title}\n`;
        message += `Price: ₹${product.price}\n`;
        message += `Level: ${product.level}\n`;
        message += `Rank: ${product.rank}\n`;
        message += `Skins: ${product.skins}\n`;
        message += `Product Image: ${product.absoluteImage}\n`;
        message += `Product Link: ${product.url}\n\n`;
        message += `Please share more details.`;
        return message;
    }

    function generateInstagramDMLink(product) {
        const instagramUsername = "thilak.store";
        if (product && product.title) {
            // Clean up title to be a valid ref payload (alphanumeric and underscores only, max 2083 chars)
            const cleanRef = product.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 100);
            return `https://ig.me/m/${instagramUsername}?ref=${cleanRef}`;
        }
        return `https://ig.me/m/${instagramUsername}`;
    }

    // Initialize Instagram Business order modal elements and state
    const orderModal = document.getElementById('instagram-order-modal');
    const copyMsgBtn = orderModal ? orderModal.querySelector('.copy-order-msg-btn') : null;
    const openChatBtn = orderModal ? orderModal.querySelector('.open-instagram-chat-btn') : null;
    let currentOrderMessage = '';
    let currentProduct = null;

    // Click handler for all Buy/Checkout buttons (.buy-now-btn)
    const buyButtons = document.querySelectorAll('.buy-now-btn');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Extract account details from the button data-attributes
            const title = btn.getAttribute('data-title');
            const price = btn.getAttribute('data-price');
            const level = btn.getAttribute('data-level');
            const rank = btn.getAttribute('data-rank');
            const skins = btn.getAttribute('data-skins');
            const imageFile = btn.getAttribute('data-image') || 'assets/sakura.png';
            const productLinkFile = btn.getAttribute('data-product-link') || 'index.html';

            // Construct absolute URLs for images and redirection pages
            const pathname = window.location.pathname;
            const dir = pathname.substring(0, pathname.lastIndexOf('/'));
            const absoluteImageUrl = window.location.origin + dir + '/' + imageFile;
            const absoluteProductLink = window.location.origin + dir + '/' + productLinkFile;

            const product = { 
                title, 
                price, 
                level, 
                rank, 
                skins, 
                image: imageFile, 
                absoluteImage: absoluteImageUrl,
                url: absoluteProductLink 
            };
            currentProduct = product;
            currentOrderMessage = generateInstagramOrderMessage(product);

            // Populate the modal dynamically
            if (orderModal) {
                document.getElementById('order-modal-img').src = imageFile;
                document.getElementById('order-modal-img').alt = title;
                document.getElementById('order-modal-title').textContent = title;
                document.getElementById('order-modal-price').textContent = `₹${price}`;
                document.getElementById('order-modal-level').textContent = level;
                document.getElementById('order-modal-rank').textContent = rank;
                document.getElementById('order-modal-skins').textContent = skins;
                document.getElementById('order-modal-message-text').textContent = currentOrderMessage;

                // Show modal
                orderModal.showModal();
            }
        });
    });

    // Modal action: Copy message
    if (copyMsgBtn) {
        copyMsgBtn.addEventListener('click', () => {
            if (currentOrderMessage) {
                navigator.clipboard.writeText(currentOrderMessage)
                    .then(() => {
                        // Change button text and style dynamically
                        const originalHTML = copyMsgBtn.innerHTML;
                        copyMsgBtn.innerHTML = `<i data-lucide="check"></i> Copied!`;
                        copyMsgBtn.style.borderColor = 'var(--clr-success)';
                        copyMsgBtn.style.color = 'var(--clr-success)';
                        
                        // Add glow highlight to the Open Chat button
                        if (openChatBtn) {
                            openChatBtn.classList.add('btn-glow');
                        }

                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }

                        showToast('Order details copied! Paste them in the chat.', true);

                        // Reset button style after 3 seconds
                        setTimeout(() => {
                            copyMsgBtn.innerHTML = originalHTML;
                            copyMsgBtn.style.borderColor = '';
                            copyMsgBtn.style.color = '';
                            if (typeof lucide !== 'undefined') {
                                lucide.createIcons();
                            }
                        }, 3000);
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                        showToast('Failed to copy. Please select and copy text manually.', false);
                    });
            }
        });
    }

    // Modal action: Open Instagram Chat
    if (openChatBtn) {
        openChatBtn.addEventListener('click', () => {
            // Automatically copy to clipboard in case they skipped step 1
            if (currentOrderMessage) {
                navigator.clipboard.writeText(currentOrderMessage)
                    .then(() => {
                        showToast('Order details copied! Paste them in the chat.', true);
                    })
                    .catch(err => {
                        console.error('Auto-copy failed: ', err);
                    });
            }
            const instagramLink = generateInstagramDMLink(currentProduct);
            window.open(instagramLink, '_blank');
        });
    }

    // Support, chat, and offline booking buttons redirection
    const instagramOfflineBtn = document.querySelector('.instagram-offline-btn');
    if (instagramOfflineBtn) {
        instagramOfflineBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = `Hi Thilak Store, I want to book a face-to-face offline deal in Patna.`;
            handleInstagramRedirect(msg, generateInstagramDMLink({ title: 'Offline_Deal' }));
        });
    }

    const instagramChatBtns = document.querySelectorAll('.instagram-chat-btn');
    instagramChatBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = `Hi Thilak Store, I want to buy a Free Fire ID.`;
            handleInstagramRedirect(msg, generateInstagramDMLink({ title: 'General_Chat' }));
        });
    });

    const instagramSupportBtns = document.querySelectorAll('.instagram-support-btn');
    instagramSupportBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = `Hi, I need help securing my Free Fire account.`;
            handleInstagramRedirect(msg, generateInstagramDMLink({ title: 'Support_Help' }));
        });
    });

    // 9. Scroll-Reveal Animation using IntersectionObserver
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

