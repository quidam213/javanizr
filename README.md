# Javanizr

Application mobile de traduction d'argots français codés — javanais classique, langue de feu, et variantes personnalisées.

## 🧩 Fonctionnalités

- Encodage et décodage en javanais classique (`av`)
- Encodage et décodage en langue de feu
- Variantes personnalisées (syllabe libre)
- Gestion des cas spéciaux : e muet, groupes de voyelles, sons composés, ponctuation
- Historique persistant des opérations (AsyncStorage, 50 entrées max, dédupliqué) avec date/heure
- Favoris persistants — étoile directement sur le résultat ou depuis l'historique
- Copie du résultat dans le presse-papier et partage natif
- Thème entièrement personnalisable : mode clair/sombre × 5 couleurs d'accent
- Synthèse vocale (TTS) du résultat avec sélecteur de voix et slider volume
- Dictée vocale (STT) en français pour saisir le texte à la voix
- Reconnaissance de texte par photo (OCR) via ML Kit (Android) / Vision (iOS)
- Modal "À propos" avec liens vers Wikipédia et GitHub
- Icône et favicon personnalisés (flamme)

## 📁 Structure du projet
```
javanizr/
├── packages/
│   ├── core/     ← Moteur d'encodage/décodage (TypeScript)
│   └── app/      ← Application mobile (Expo)
│       ├── app/  ← Écrans (Expo Router)
│       ├── lib/  ← Thème et styles
│       └── public/
│           └── favicon.png  ← Icône app + favicon web
```

## 🚀 Installation
```bash
git clone https://github.com/quidam213/javanizr.git
cd javanizr
npm install
```

## 🧪 Tests
```bash
npm test
```

## 📖 Utilisation du Core
```ts
import { encode, decode } from "@javanizr/core"

// Javanais classique
encode("bonjour", "av")   // → "bavonjavour"
decode("bavonjavour", "av") // → "bonjour"

// Langue de feu
encode("bonjour", "feu")  // → "bonfonjourfour"
decode("bonfonjourfour", "feu") // → "bonjour"

// Variante custom
encode("bonjour", "og")   // → "bogonjogour"
decode("bogonjogoor", "og") // → "bonjour"
```

## 📱 Lancer l'app (développement)

```bash
cd packages/core && npm run build   # compiler le core (requis)
cd ../app && npx expo start         # lancer Metro
```

> Les modules natifs (TTS, STT, OCR) nécessitent un **dev build EAS** — ils ne fonctionnent pas dans Expo Go.

```bash
cd packages/app
eas build --profile development --platform android   # build APK dev
```

## 🌐 Déploiement web

```bash
cd packages/app
npx expo export -p web              # génère le dossier dist/
npx serve dist/                     # test local
```

Hébergement recommandé : **Netlify** ou **Vercel** (drag & drop du dossier `dist/`).

## 📦 Publication sur les stores

### Google Play Store
```bash
eas build --profile production --platform android   # génère un AAB signé
eas submit --platform android                        # soumet à Google Play
```
Prérequis : compte Google Play Developer (25 $ une fois).

### Apple App Store
```bash
eas build --profile production --platform ios        # génère un IPA signé
eas submit --platform ios                            # soumet à App Store Connect
```
Prérequis : compte Apple Developer (99 $/an).

## 🗺️ Roadmap

- [x] Core Engine — encodage/décodage (41 tests)
- [x] App mobile Expo — mode texte (javanais, langue de feu, variante custom)
- [x] Mode audio — TTS (synthèse vocale) + STT (dictée vocale fr-FR)
- [x] Mode photo — OCR via ML Kit (Android) / Vision (iOS)

## 📄 Licence

MIT
