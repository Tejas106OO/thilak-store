# Thilak Store - Trusted Free Fire ID Agency Homepage

A modern, high-fidelity gaming-themed landing page designed to sell Free Fire accounts securely across Bihar (online) and Patna (offline).

## Features

- **Gaming Style UI:** Sleek dark background (`#07060b`) with energetic neon orange (`#ff5100`), neon purple (`#9d4edd`), and neon blue (`#00b4d8`) glows and micro-animations.
- **Interactive Account Catalog:** Real-time filter system allowing users to search by category (Budget, Rank Pushers, Rare Items, Premium Elite).
- **Legitimacy & Trust Sections:** High-visibility trust points (verified accounts, legal compliance, safe handovers, anti-recovery guarantee).
- **Patna Offline Service Section:** Clear information about secure, face-to-face cash deals in popular Patna areas (Maurya Lok, Boring Road, Eco Park, Danapur) with safety verification.
- **Custom ID Request Form:** Built using the native HTML5 `<dialog>` component. Automatically formats requirements and redirects users to WhatsApp to complete deals in one tap.
- **Fully Mobile Responsive:** Tailored layouts for small screens, mobile device navigation menus, and grid adjustments.
- **Performance Optimized:** Built with semantic HTML, modern CSS custom properties, and vanilla JS (using `IntersectionObserver` for animations), ensuring high Lighthouse scores and fast loads.

## File Structure

- `index.html`: Web page markup with structural HTML5 tags, CDNs for Lucide icons and fonts, and the modal dialog.
- `style.css`: Core design system, layout rules, neon accents, card styles, and animations.
- `app.js`: Script for catalog filters, drawer toggles, conditional forms, modal interactions, and WhatsApp message formatting.

## Running Locally

Simply open the `index.html` file in any modern web browser, or use a local static server:

```bash
# Using python:
python3 -m http.server 8000

# Using node (if installed):
npx -y serve ./
```
