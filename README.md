# 🌸 Neku — Page de présentation

Petite page web personnelle (kinks, personnages favoris, ERP-IRL), au style sombre néon violet / cyan.
Tout le contenu est dans un fichier `data.json` : pas besoin de toucher au HTML pour modifier la page.

> 🔞 **Contenu NSFW — réservé aux adultes (18+).**

---

## 📁 Structure du projet

```
.
├── README.md
├── app.js           # Lit data.json et construit la page
├── data.json        # ⭐ Tout le contenu personnalisable
├── index.html       # Squelette de la page + balises Open Graph (aperçu Discord / X)
├── og_preview.jpg   # Image d'aperçu quand on partage le lien (1200×630)
├── style.css        # Tout le style (couleurs, grilles, animations)
└── images/          # Images des personnages (à créer, voir plus bas)
    ├── hatsune-miku.jpg
    ├── loona.jpg
    └── ...
```

---

## ✏️ Personnaliser le contenu (`data.json`)

Le fichier est découpé en 5 blocs :

| Bloc | Contenu |
|---|---|
| `profil` | Titre de la page, emoji, nom, pseudo, avertissement NSFW, footer |
| `navigation` | Liens du menu du haut (`label` affiché, `cible` = id de la section) |
| `kinks` | Titre, intro, **liste des kinks**, note importante |
| `personnages` | Titre + liste des **sources** (séries / jeux) et leurs personnages |
| `erp` | Titre, acronyme, texte et lien du bouton |

### Ajouter ou retirer un kink

Dans `kinks.liste`, ajoute ou supprime une ligne :

```json
"liste": [
  "BDSM",
  "Latex",
  "Mon nouveau kink"
]
```

### Ajouter un personnage à une source existante

```json
{
  "nom": "Pokémon",
  "couleurs":
{
  "accent": "#facc15",
  "texte": "#fde68a",
  "fond": "#3c5aa6"
},
  "personnages": [
    {
      "nom": "Sylveon",
      "image": "images/sylveon.jpg"
    },
    {
      "nom": "Mon nouveau perso",
      "image": "images/mon-perso.jpg"
    }
  ]
}
```

### Ajouter une nouvelle source (série, jeu…)

Copie un bloc complet dans `personnages.sources` :

```json
{
  "nom": "Ma série",
  "couleurs":
{
  "accent": "#00ff00",
  "texte": "#bbf7d0",
  "fond": "#052e16"
},
  "personnages": [
    {
  "nom": "Perso",
  "image": "images/perso.jpg"
    }
  ]
}
```

### Les 3 couleurs d'une source

| Clé | Utilisée pour |
|---|---|
| `accent` | Bordure de la pastille + trait coloré sous chaque carte (**la plus visible**) |
| `texte` | Couleur du nom de la série |
| `fond` | Côté sombre du dégradé de la pastille |

Toutes les couleurs sont en hexadécimal à 6 caractères (`#rrggbb`).

---

## 🖼️ Images des personnages

1. Crée un dossier `images/` à côté de `index.html`.
2. Dépose-y tes images, avec **exactement** le nom écrit dans `data.json`.

Conseils :
- **Format paysage** d'environ 400×260 px : les images sont recadrées automatiquement (`object-fit: cover`, hauteur 100–140 px).
- **JPG ou WebP**, 400–600 px de large suffisent. Il y a 26 images, garde-les légères.
- ⚠️ **GitHub Pages est sensible à la casse** : `Loona.jpg` et `loona.jpg` sont deux fichiers différents. Utilise des minuscules, sans espaces ni accents.
- Si tes images sont en `.png` ou `.webp`, change simplement l'extension dans `data.json`.

---

## 🚀 Publier sur GitHub Pages

1. Pousse tous les fichiers à la **racine** du dépôt.
2. Sur GitHub : **Settings → Pages**.
3. *Source* : **Deploy from a branch**, choisis `main` et le dossier `/ (root)`, puis **Save**.
4. Après une minute environ, le site est en ligne sur :
   `https://<utilisateur>.github.io/<nom-du-depot>/`

À chaque modification de `data.json` (ou d'un autre fichier), fais un commit + push : le site se met à jour tout seul. Si tu ne vois pas le changement, force le rechargement (`Ctrl + Shift + R`) : le navigateur garde `data.json` en cache.

---

## 🔗 Aperçu Discord / X (Open Graph)

Quand tu partages le lien, Discord et X affichent une carte avec titre, description et image. Ces infos viennent des balises `<meta>` **dans `index.html`** (et non de `data.json`, car Discord et X ne lisent pas le JavaScript).

Si tu changes ton nom, ton pseudo ou ton titre, mets aussi à jour dans `index.html` : `og:title`, `og:description`, `og:site_name`, `twitter:title`, `twitter:description`.

### ⚠️ Passer l'image en URL absolue

Les balises `og:image` et `twitter:image` utilisent aujourd'hui un chemin relatif (`og_preview.jpg`). **Discord et X exigent une URL complète**, sinon l'image n'apparaît pas. Une fois ton site en ligne, remplace dans `index.html` :

```html
<meta property="og:image"  content="https://<utilisateur>.github.io/<nom-du-depot>/og_preview.jpg">
<meta name="twitter:image" content="https://<utilisateur>.github.io/<nom-du-depot>/og_preview.jpg">
```

Pour tester, colle ton lien dans un message Discord. S'il affiche l'ancien aperçu, Discord l'a mis en cache : ajoute `?v=2` à la fin du lien pour le forcer à relire la page.

---

## 💻 Tester en local

Ouvrir `index.html` en double-clic **ne fonctionne pas** : le navigateur bloque la lecture de `data.json` sur un fichier local (`file://`). Lance un petit serveur dans le dossier du projet :

```bash
python3 -m http.server
```

Puis ouvre <http://localhost:8000>.

---

## 🛠️ Dépannage

| Symptôme | Cause probable |
|---|---|
| Encadré rouge « Impossible de charger data.json » | JSON invalide (voir ci-dessous) ou fichier absent |
| Page vide en double-clic | Normal, utilise un serveur local (voir plus haut) |
| Image cassée sur une carte | Nom du fichier différent de celui de `data.json` (majuscules, extension…) |
| Modification pas visible en ligne | Cache du navigateur (`Ctrl + Shift + R`) ou déploiement Pages pas terminé |
| Pas d'image dans l'aperçu Discord | `og:image` pas en URL absolue, ou aperçu en cache |

**Erreurs JSON classiques** : virgule après le dernier élément d'une liste, guillemet oublié, guillemets `“ ”` au lieu de `" "`. En cas de doute, colle le contenu dans un validateur comme [jsonlint.com](https://jsonlint.com).

---

## ⚙️ Détails techniques

- HTML / CSS / JavaScript pur : aucune dépendance, aucun outil de build.
- Le texte de `data.json` est inséré via `textContent` : du HTML écrit dans le JSON s'affiche tel quel, sans risque.
- Les images se chargent en différé (`loading="lazy"`).
- Mise en page responsive, avec une grille à 2 colonnes sur mobile.

---

## 📬 Contact

**Neku** — @Nathanfurry_lax

*Contenu NSFW — Réservé aux adultes consentants.*
