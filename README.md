# Javanizr

Application mobile de traduction d'argots français codés — javanais classique, langue de feu, et variantes personnalisées.

## 🧩 Fonctionnalités

- Encodage et décodage en javanais classique (`av`)
- Encodage et décodage en langue de feu
- Variantes personnalisées (syllabe libre)
- Gestion des cas spéciaux : e muet, groupes de voyelles, sons composés, ponctuation

## 📁 Structure du projet
```
javanizr/
├── packages/
│   ├── core/     ← Moteur d'encodage/décodage (TypeScript)
│   └── app/      ← Application mobile (Expo)
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

## 📱 Lancer l'app

```bash
cd packages/core && npm run build   # compiler le core (requis)
cd ../app && npx expo start         # lancer Metro
```

Scanne le QR code avec Expo Go (Android/iOS) ou appuie sur `w` pour le navigateur.

## 🗺️ Roadmap

- [x] Core Engine — encodage/décodage (41 tests)
- [x] App mobile Expo — mode texte (javanais, langue de feu, variante custom)
- [ ] Mode audio (TTS + STT)
- [ ] Mode photo (OCR)
- [ ] Monétisation (freemium ou open source, TBD)

## 📄 Licence

MIT
