# 🌊 Wasserlage: Desktop ≠ Mobile Einschätzung — Root-Cause & Fix

## Root-Cause (gefunden im Live-Stand `https://voigtcarsten4-rgb.github.io/wasserlage/`)

In `wasserlage_index.html` Zeile ~2636:
```js
let userType = 'all', tiefgang = 80;
```

**Beide Werte werden NICHT in localStorage persistiert.** Auswirkung:
- Desktop: User wählt "Hausboot · 100 cm" → Einschätzung A
- Mobile: User öffnet, Default ist "all · 80 cm" → Einschätzung B
- Beide Geräte zeigen unterschiedliche `baStatus`, `baHint`, `tgPill`-Werte

## Minimalinvasiver Fix (3 Stellen patchen)

### 1) Initialisierung mit localStorage-Read

Ersetze:
```js
let userType = 'all', tiefgang = 80;
```
durch:
```js
let userType = localStorage.getItem('wl_userType') || 'all';
let tiefgang = parseInt(localStorage.getItem('wl_tiefgang') || '80', 10);
```

### 2) `setType()` — auf gespeicherten Wert sichern

In `function setType(type, btn) { ... }` direkt nach `userType = type;` einfügen:
```js
try { localStorage.setItem('wl_userType', type); } catch(_){}
```

### 3) `onTiefgang()` — auf gespeicherten Wert sichern

In `function onTiefgang(v) { ... }` direkt nach `tiefgang = parseInt(v);` einfügen:
```js
try { localStorage.setItem('wl_tiefgang', String(tiefgang)); } catch(_){}
```

### 4) Auf Load: UI-State aus localStorage in DOM spiegeln (am Ende von `init()` oder beim DOMContentLoaded)

```js
// V21.4-Fix: Persistierten userType + tiefgang in UI spiegeln
(function syncStateFromStorage(){
  try {
    // Tiefgang-Slider
    var slider = document.getElementById('tgSlider');
    var val = document.getElementById('tgVal');
    if (slider) slider.value = tiefgang;
    if (val) val.textContent = tiefgang;
    // userType-Tab aktivieren
    document.querySelectorAll('.utab').forEach(function(b){
      if (b.dataset && b.dataset.type === userType) b.classList.add('on');
      else b.classList.remove('on');
    });
    // Context-Area ein-/ausblenden
    ['all','motorboat','paddler','hausboot','segler','police'].forEach(function(t){
      var el = document.getElementById('ctx-'+t);
      if (el) el.classList.toggle('ctx-hidden', t!==userType);
    });
    var ctxArea = document.getElementById('ctxArea');
    if (ctxArea) ctxArea.style.display = userType==='all' ? 'none' : 'block';
  } catch(_){}
})();
```

## Auswirkung nach Patch
- **Gleicher Browser**: Desktop ↔ Mobile zeigen IDENTISCHE Einschätzung (über localStorage persistiert)
- **Verschiedene Geräte/Browser**: brauchen Cloud-Sync (z.B. Apps Script Bridge), das ist eine spätere Erweiterung. Für jetzt: gleicher Wert wenn gleicher Browser

## Optional: Cloud-Sync (V21.5+)
Wenn Desktop + Mobile = unterschiedliche Browser sind, dann via Apps-Script-Bridge persistieren:
```js
function setType(type, btn) {
  userType = type;
  localStorage.setItem('wl_userType', type);
  fetch(BRIDGE_URL + '?action=wl_state&userType='+type+'&tiefgang='+tiefgang).catch(()=>{});
  // ... rest
}
```

## Verifikation
1. Desktop: Hausboot wählen, Tiefgang 120 → Refresh → Werte bleiben
2. Mobile (gleicher Browser, gleiche Domain): Page öffnen → Hausboot + 120 sollten aktiv sein
3. `baStatus`, `baHint`, `bcPegelVal` zeigen IDENTISCHE Werte

## Push (im Wasserlage-Repo)
```bash
cd path/to/wasserlage-repo
git add wasserlage_index.html
git commit -m "Fix: userType + tiefgang in localStorage persistieren (Desktop/Mobile Sync)"
git push origin main
```

GitHub Pages braucht ~60-90s Deploy. Danach https://voigtcarsten4-rgb.github.io/wasserlage/ neu laden (`Ctrl+F5`).
