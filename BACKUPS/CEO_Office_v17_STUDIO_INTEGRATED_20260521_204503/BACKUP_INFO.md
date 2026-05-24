# v17 — NEXT-GEN STUDIO + AUTONOMES MARKETING-COCKPIT

**Stand:** 2026-05-21 22:42 (Europe/Berlin) · Commit `052a938` · Tag `v17-studio-integration`

## Was ist neu in v17

### Studio-Sektion komplett umgebaut
- **5 KPI-Karten** (Videos · Tools · Rollen · Pipelines · Prompts)
- **13 AI-Tools** als klickbare Tiles mit Status-Pills:
  - VIDEO AI: Runway ML · Kling AI · Veo (Google) · Higgsfield AI
  - IMAGE AI: Leonardo AI · Midjourney · Adobe Firefly
  - VOICE AI: ElevenLabs
  - MUSIC AI: Suno AI · Udio
  - AUTOMATION: N8N · Make.com · Buffer/Later · Remotion · FFmpeg
- **Status-Pills**: ✓ Aktiv (grün) · ✓ Bereit · ⟳ Setup (gelb) · ○ Geplant
- **Filter-Pills**: Alle · 🎬 Video · 🎨 Image · 🎙 Voice · 🎵 Music · ⚙ Auto
- **Hero-Buttons**: AI Marketing OS Vollbild · Leonardo Studio · Lucy Studio-Brief · Pipeline starten
- **Modal-Iframe**: AI Marketing OS und Leonardo Studio öffnen sich inline (Esc/✕ schließt)
- **Video-Previews** mit Hover-Autoplay + "Variante briefen" Button

### Marketing-Sektion: autonome Strategie
- **Marketing Intel Panel** (live KW-Pulse, Best-Time-Slots)
- **4 strategische Lucy-Buttons**:
  - 🛰 Marketing Opportunity Scan (Top-Themen, Quick-Wins, Risiken)
  - 📡 Trend-Watch (5 KW-Trends mit Wave-Bite-Anknüpfung)
  - 🗓 7-Tage-Plan (taktisch, Tabelle)
  - 🎯 Competitor-Move-Analyse (Locaboat, Boatsclub, etc.)

### Lucy-Hooks (8 neue Funktionen)
- `lucyToolPrompt(id)` — tool-spezifischer Prompt-Generator (jedes Tool hat einen tailored Prompt)
- `lucyStudioBrief()` — CEO-Content-Briefing für heute
- `lucyVideoConcept(label)` — Video-Konzept mit Hooks/Shots/VO/Music/Caption
- `runStudioPipeline()` — Standard 60s Reel Pipeline (Moodboard → Live)
- `lucyMarketingScan()` — autonomer Marketing-Strategie-Scan
- `lucyTrendWatch()` — KW-aktueller Trend-Watch
- `lucyCompetitorMove()` — Wettbewerber-Lessons
- `lucyContentPlan()` — 7-Tage Content-Plan

Alle Hooks nutzen die existierende Anthropic-Bridge (`callClaude` via Apps Script Sonnet 4.5).

## Bestehende Features unverändert
- Premium Risiko-Matrix (v16) · 6 Risiken · 4-Quadrant-Heatmap · Scan-Line
- Wasserlage 1:1 Detail-Sync (v14/v15) · 12 Pegelstationen · calcAmpel
- Section-Toggle Fix (v12) · stopPropagation
- Hyperspace Header-Animation · Lucy XL
- Tracking Dashboard Button korrekt verlinkt

## Live-Validation
- HTTP 200 · `last-modified: Thu, 21 May 2026 20:42:41 GMT`
- Live HTML 610 074 Bytes
- HTML-Balance: 13/13 Scripts · 1/1 html · 1/1 body · 23/23 sections
- JS-Syntax: alle 10 inline Scripts mit `node --check` validiert (0 Errors)
- Live-Marker-Count: NEXT-GEN STUDIO×4 · STUDIO_TOOLS×5 · 8 Lucy-Funktionen present
