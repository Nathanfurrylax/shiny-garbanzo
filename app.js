/* Construit la page à partir de data.json */
(function () {
  'use strict';

  /* Crée un élément : el('div', 'classe', 'texte') — texte inséré en textContent (sûr) */
  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function $(id) { return document.getElementById(id); }
  function vider(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  /* Couleurs d'une source : texte + fond dégradé + bordure dérivés de 3 valeurs */
  function styleSource(c) {
    return 'color:' + c.texte +
      ';background:linear-gradient(135deg,' + c.accent + '28,' + c.fond + '55)' +
      ';border:1px solid ' + c.accent + '65;';
  }

  function rendreNav(nav) {
    var n = $('nav'); vider(n);
    nav.forEach(function (l) {
      var a = el('a', '', l.label);
      a.href = '#' + l.cible;
      n.appendChild(a);
    });
  }

  function rendreHero(p, nav) {
    document.title = p.titre_page;
    $('hero-emoji').textContent = p.emoji;
    $('hero-l1').textContent = p.titre_ligne1;
    $('hero-l2').textContent = p.titre_ligne2;
    $('hero-nom').textContent = p.nom;
    $('hero-pseudo').textContent = p.pseudo;
    $('hero-nsfw').textContent = p.avertissement;
    $('footer').textContent = p.footer;

    /* Pastilles : tous les liens de nav sauf "Accueil" (cible = hero) */
    var pills = $('hero-pills'); vider(pills);
    nav.filter(function (l) { return l.cible !== 'hero'; }).forEach(function (l) {
      var a = el('a', 'pill', l.label);
      a.href = '#' + l.cible;
      pills.appendChild(a);
    });
  }

  function rendreKinks(k) {
    $('kinks-titre').textContent = k.titre;
    $('kinks-sous-titre').textContent = k.sous_titre;

    var intro = $('kinks-intro'); vider(intro);
    k.intro.forEach(function (ligne, i) {
      if (i > 0) intro.appendChild(document.createElement('br'));
      intro.appendChild(document.createTextNode(ligne));
    });

    var grille = $('kinks-grille'); vider(grille);
    k.liste.forEach(function (nom) { grille.appendChild(el('div', 'kink', nom)); });

    $('note-titre').textContent = k.note.titre;
    $('note-texte').textContent = k.note.texte;
  }

  function rendrePersonnages(p) {
    $('perso-titre').textContent = p.titre;
    $('perso-sous-titre').textContent = p.sous_titre;

    var conteneur = $('perso-sources'); vider(conteneur);
    p.sources.forEach(function (s) {
      var bloc = el('div', 'source-block');

      var label = el('div', 'source-label', s.nom);
      label.setAttribute('style', styleSource(s.couleurs));
      bloc.appendChild(label);

      var grille = el('div', 'char-grid');
      s.personnages.forEach(function (perso) {
        var carte = el('div', 'char-card');

        var img = el('img', 'char-img');
        img.src = perso.image;
        img.alt = perso.nom;
        img.loading = 'lazy';
        carte.appendChild(img);

        var pied = el('div', 'char-footer');
        pied.setAttribute('style', 'border-top:2px solid ' + s.couleurs.accent + '45;');
        pied.appendChild(el('span', 'char-name', perso.nom));
        carte.appendChild(pied);

        grille.appendChild(carte);
      });
      bloc.appendChild(grille);
      conteneur.appendChild(bloc);
    });
  }

  function rendreErp(e) {
    $('erp-titre').textContent = e.titre;

    var ac = $('erp-acronyme'); vider(ac);
    e.acronyme.forEach(function (m, i) {
      var strong = el('strong', '', m.lettre);
      strong.style.color = e.couleur_lettre;
      ac.appendChild(strong);
      ac.appendChild(document.createTextNode(m.reste + (i < e.acronyme.length - 1 ? ' \u00A0 ' : '')));
    });

    var btn = $('erp-bouton');
    btn.textContent = e.bouton_texte;
    btn.href = e.bouton_lien;
  }

  function afficherErreur(err) {
    var msg = el('div', 'load-error');
    msg.appendChild(el('strong', '', 'Impossible de charger data.json'));
    msg.appendChild(el('p', '',
      window.location.protocol === 'file:'
        ? 'La page est ouverte en double-clic (file://). Le navigateur bloque la lecture du JSON dans ce cas : lance un petit serveur local (ex. « python3 -m http.server ») ou héberge le site.'
        : 'Vérifie que data.json est bien à côté de index.html et que sa syntaxe est valide.'));
    msg.appendChild(el('p', 'detail', String(err)));
    document.body.insertBefore(msg, document.body.firstChild);
  }

  fetch('data.json')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (d) {
      rendreNav(d.navigation);
      rendreHero(d.profil, d.navigation);
      rendreKinks(d.kinks);
      rendrePersonnages(d.personnages);
      rendreErp(d.erp);
    })
    .catch(afficherErreur);
})();
