document.addEventListener('DOMContentLoaded', () => {
    // Init Lucide
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const WA_PHONE = '918102098935';

    // ── Navbar scroll ──
    const navHeader = document.getElementById('navHeader');
    const heroSection = document.querySelector('.hero');

    function onScroll() {
        if (window.scrollY > 60) {
            navHeader.classList.add('scrolled');
        } else {
            navHeader.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── Burger menu ──
    const burger = document.getElementById('burger');
    const mobMenu = document.getElementById('mobMenu');
    const mobLinks = document.querySelectorAll('.mob-link');

    if (burger && mobMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            mobMenu.classList.toggle('open');
            document.body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
            // When mobile menu opens, force scrolled style on nav
            if (mobMenu.classList.contains('open')) {
                navHeader.classList.add('scrolled');
            } else {
                onScroll();
            }
        });

        const closeMob = () => {
            burger.classList.remove('open');
            mobMenu.classList.remove('open');
            document.body.style.overflow = '';
            onScroll();
        };

        mobLinks.forEach(l => l.addEventListener('click', closeMob));
    }

    // ── Filters ──
    const chips = document.querySelectorAll('.chip');
    const cards = document.querySelectorAll('.p-card[data-category]');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const f = chip.dataset.filter;
            cards.forEach(card => {
                if (f === 'all' || card.dataset.category === f) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ── Modal helpers ──
    const customModal = document.getElementById('customModal');
    const productModal = document.getElementById('productModal');

    function openModal(modal) {
        if (modal) modal.showModal();
    }

    function closeModal(modal) {
        if (modal) modal.close();
    }

    // Close on backdrop
    [customModal, productModal].forEach(m => {
        if (!m) return;
        m.addEventListener('click', e => {
            const r = m.getBoundingClientRect();
            if (e.clientY < r.top || e.clientY > r.bottom || e.clientX < r.left || e.clientX > r.right) {
                m.close();
            }
        });
    });

    // Custom modal triggers
    const openCustomBtns = [
        document.getElementById('openCustomSearch'),
        document.getElementById('mobCustomSearch'),
        ...document.querySelectorAll('.open-custom-btn')
    ].filter(Boolean);

    openCustomBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Close mobile menu if open
            if (mobMenu && mobMenu.classList.contains('open')) {
                burger.classList.remove('open');
                mobMenu.classList.remove('open');
                document.body.style.overflow = '';
                onScroll();
            }
            openModal(customModal);
        });
    });

    document.getElementById('closeCustom')?.addEventListener('click', () => closeModal(customModal));
    document.getElementById('cancelCustom')?.addEventListener('click', () => closeModal(customModal));
    document.getElementById('closeProduct')?.addEventListener('click', () => closeModal(productModal));

    // ── Deal type toggle ──
    const dealRadios = document.querySelectorAll('input[name="deal_type"]');
    const locField = document.getElementById('locationField');
    const locInput = document.getElementById('user-location');

    dealRadios.forEach(r => {
        r.addEventListener('change', () => {
            if (r.value === 'Offline Meeting in Patna') {
                if (locField) locField.style.display = 'flex';
                if (locInput) locInput.required = true;
            } else {
                if (locField) locField.style.display = 'none';
                if (locInput) { locInput.required = false; locInput.value = ''; }
            }
        });
    });

    // ── Toast ──
    function toast(msg, ok = true) {
        const box = document.getElementById('toastBox');
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerHTML = `<i data-lucide="${ok ? 'check-circle' : 'copy'}"></i><span>${msg}</span>`;
        box.appendChild(t);
        if (typeof lucide !== 'undefined') lucide.createIcons();
        setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 3000);
    }

    // ── Clipboard + WhatsApp redirect ──
    function goWA(msg, url) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(msg)
                .then(() => toast('Copied to clipboard!'))
                .catch(() => toast('Redirecting...', false));
        } else {
            toast('Redirecting...', false);
        }
        setTimeout(() => window.open(url, '_blank'), 800);
    }

    function waLink(msg = '') {
        return msg ? `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}` : `https://wa.me/${WA_PHONE}`;
    }

    // ── Custom form submit ──
    const customForm = document.getElementById('customForm');
    if (customForm) {
        customForm.addEventListener('submit', e => {
            e.preventDefault();
            const n = document.getElementById('user-name').value.trim();
            const w = document.getElementById('user-whatsapp').value.trim();
            const b = document.getElementById('user-budget').value;
            const l = document.getElementById('user-level').value;
            let d = 'Online Delivery';
            dealRadios.forEach(r => { if (r.checked) d = r.value; });
            const loc = locInput ? locInput.value.trim() : '';
            const req = document.getElementById('user-requirements').value.trim();

            let m = `🔥 CUSTOM ID REQUEST 🔥\n\n`;
            m += `👤 ${n}\n📱 ${w}\n💰 ₹${b}\n⭐ Level: ${l}\n🤝 ${d}\n`;
            if (d === 'Offline Meeting in Patna' && loc) m += `📍 ${loc}\n`;
            m += req ? `🔫 ${req}\n` : `🔫 Any good account\n`;
            m += `\nvia thilak.store`;

            goWA(m, waLink(m));
            closeModal(customModal);
            customForm.reset();
            if (locField) locField.style.display = 'none';
            if (locInput) locInput.required = false;
        });
    }


    // ── Contact form ──
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const n = document.getElementById('name').value.trim();
            const c = document.getElementById('city').value.trim();
            const s = document.getElementById('service').value;
            const m = document.getElementById('message').value.trim();

            const msg = `Hello thilak.store,\n\nName: ${n}\nCity: ${c}\nService: ${s}\nDetails: ${m}\n\nvia thilak.store`;
            goWA(msg, waLink(msg));
            contactForm.reset();
        });
    }

    // ── Scroll reveal ──
    const fadeEls = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
        fadeEls.forEach(el => obs.observe(el));
    } else {
        fadeEls.forEach(el => el.classList.add('visible'));
    }

    // ── Random entry fee generation for event cards ──
    const feeSpans = document.querySelectorAll('.rand-fee');
    feeSpans.forEach(span => {
        const fee = Math.floor(Math.random() * 1001) + 500; // ₹500‑₹1500
        span.textContent = `Entry: ₹${fee}`;
    });

    // ── FAQ Accordion ──
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close other items
            faqItems.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-answer').style.maxHeight = '';
            });
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ── Sell Banner Appraisal CTA ──
    const sellCTABtn = document.getElementById('sellCTABtn');
    if (sellCTABtn) {
        sellCTABtn.addEventListener('click', () => {
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                serviceSelect.value = 'Sell Account';
            }
        });
    }

    // ── Counter animation ──
    const statNums = document.querySelectorAll('.stat-num[data-count]');
    if ('IntersectionObserver' in window) {
        const counterObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const target = parseInt(e.target.dataset.count);
                    let current = 0;
                    const step = Math.max(1, Math.floor(target / 60));
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) { current = target; clearInterval(timer); }
                        e.target.textContent = current.toLocaleString();
                    }, 20);
                    counterObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });
        statNums.forEach(el => counterObs.observe(el));
    }

    // ── Fallback Click Redirect to WhatsApp Channel ──
    document.addEventListener('click', e => {
        const btn = e.target.closest('.buy-now-btn') || e.target.closest('.open-wa-btn') || e.target.closest('#buyWA');
        if (btn) {
            e.preventDefault();
            window.location.href = 'https://whatsapp.com/channel/0029Vb7mj918qIzzuWZLDc3T';
        }
    });
});
