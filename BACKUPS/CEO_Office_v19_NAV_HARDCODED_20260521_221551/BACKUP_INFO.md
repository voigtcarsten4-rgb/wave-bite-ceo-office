# v19 — Nav hartverdrahtet + Marketing-Detail-Dashboard prominent

**Commit** `096f118` · **Tag** `v19-nav-hardcoded` · **Live** 2026-05-21 22:14 GMT

## Was v19 löst

### Problem-Report aus User:
1. "wo ist das detaildashboard marketing — kein button mit vernetzung"
2. "header navigation screenshot buttons ohne wirkung"

### Fixes
**1. STUDIO / MARKETING / MKT-OS Pills hartverdrahtet im Nav-HTML**
Vorher: per JS-Inject via `injectNavPills()` — anfällig für Cache/Reload-Probleme.
Jetzt: 3 zusätzliche Pills direkt im `<nav>` HTML zwischen RISK und TASKS — auch ohne JS sichtbar.

**2. Robuster Nav-Click-Handler via Event-Delegation**
Zusätzlich zum inline `onclick` jetzt globale Capture-Phase-Delegation auf `<nav>`. Auch wenn ein anderes Script die inline-onclick stört, fängt die Delegation den Click ab und scrollt via `data-target` Attribut zur Sektion.

**3. Service-Worker Kill direkt nach `<body>`**
`navigator.serviceWorker.getRegistrations().then(unregister)` + `caches.delete()` — räumt jeden alten Service-Worker aus dem Browser-Cache. Garantiert frische Page bei nächster Navigation.

**4. Prominenter Marketing Detail-Dashboard Hero Card**
Direkt über der Marketing-Sektion: großer violetter Card mit drei prominenten Buttons:
- ⚡ Im Dashboard öffnen (Modal-Iframe)
- ↗ Neuer Tab (volle wavebite-ai-marketing-os.html Seite)
- 🎨 Leonardo Studio (öffnet wavebite-leonardo-studio.html)

## Live-Validation
- HTTP 200 · 637 032 Bytes
- HTML-Balance: 15/15 scripts · 1/1 html · 1/1 body
- JS-Syntax: alle 12 inline Scripts node-validiert (0 Errors)
- Live-Marker: nav-pill-studio×1 · MARKETING DETAIL-DASHBOARD×1 · 🎬 STUDIO×5 · 📣 MARKETING×4 · ⚡ MKT-OS×1 · data-target="sec-studio"×2 · Service Worker Kill×1
- Visuell verifiziert: Studio rendert vollständig via URL-Hash, alle 13 Tool-Tiles, KPI-Karten, Hero-Buttons, Lucy-Avatar präsent
