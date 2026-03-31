# CLAUDE.md — Contexte du projet Javanizr

## 🎯 Projet

Application mobile de traduction d'argots français codés.
Repo : https://github.com/quidam213/javanizr

### Description
Javanizr permet d'encoder et décoder du texte, de l'audio et des photos en argots français codés — javanais classique, langue de feu, et variantes personnalisées.

### Roadmap
- [x] Core Engine — javanais, langue de feu, variante custom
- [x] Tests unitaires (41 tests)
- [ ] App Expo — UI mode texte
- [ ] Mode audio (TTS + STT)
- [ ] Mode photo (OCR)
- [ ] Monétisation (freemium ou open source, pas encore décidé)

### Idées bonus
- Mode battle (deux utilisateurs s'envoient des messages en argot)
- Historique et favoris
- Mode apprentissage
- Partage social (WhatsApp, Instagram...)

### Argots supportés

**Javanais classique (`av`)** — insertion de `av` avant chaque voyelle ou groupe de voyelles.
```
bonjour → bavonjavour
ami     → avamavi
tarte   → tavarte     (e muet final ignoré)
moyen   → mavoyaven   (y semi-consonne)
```

**Langue de feu (`feu`)** — chaque syllabe est répétée avec sa consonne initiale remplacée par `f`.
```
bonjour → bonfonjourfour
école   → éfécolefole
chat    → chatfat       (son composé ch → f)
trésor  → tréfrésorfor  (cluster tr → fr, on garde le r)
```

**Variante custom** — même algo que le javanais classique mais avec la syllabe choisie par l'utilisateur.
```
bonjour + "og" → bogonjogoour
```

### Règles métier importantes
- Le `e` muet final n'est pas encodé (`tarte` → `tavarte` pas `tavartave`)
- Le `y` suivi d'une voyelle est traité comme une consonne
- Les groupes de voyelles (`ou`, `ai`, `eau`...) ne sont pas séparés
- Les sons composés (`ch`, `ph`, `gn`, `qu`) sont remplacés entièrement par `f` en langue de feu
- Les clusters distincts (`tr`, `br`...) gardent la deuxième consonne en langue de feu
- Le décodage de la langue de feu utilise un algo de recherche de paires, pas `splitIntoSyllables`

---

## 🔧 Technique

### Stack

| Élément | Choix |
|---|---|
| Monorepo | npm workspaces |
| Langage core | TypeScript 5 |
| Tests | Jest + ts-jest |
| App mobile | React Native + Expo (à venir) |
| Plateformes cibles | iOS + Android (+ Web plus tard) |

### Structure du projet
```
javanizr/
├── packages/
│   ├── core/                  ← Moteur TypeScript pur
│   │   ├── src/
│   │   │   ├── syllables.ts   ← Utilitaires partagés (isVowel, encodeWithSyllable...)
│   │   │   ├── index.ts       ← Export public
│   │   │   └── variants/
│   │   │       ├── types.ts   ← Interface Variant
│   │   │       ├── jav.ts     ← Javanais classique
│   │   │       ├── feu.ts     ← Langue de feu
│   │   │       └── index.ts   ← Registre + orchestrateur encode/decode
│   │   └── tests/
│   │       ├── basics.test.ts
│   │       ├── jav/
│   │       ├── feu/
│   │       └── personnalized/
│   └── app/                   ← App Expo (pas encore commencé)
├── package.json               ← Monorepo npm workspaces
├── LICENSE
└── README.md
```

### Architecture du Core
```
encode(text, syllable)
        ↓
split en tokens (mots / ponctuation / espaces)
        ↓
pour chaque mot → variant.encodeSyllable(mot)
        ↓
javanais : encodeWithSyllable() lettre par lettre
feu      : splitIntoSyllables() puis encodage par paire
custom   : encodeWithSyllable() avec syllabe dynamique
```

### Conventions de code
- Indentation : 4 espaces
- Commentaires : en français
- Tests : un fichier par variant et par opération (encode/decode)
- Principe YAGNI : ne pas anticiper ce dont on n'a pas besoin
