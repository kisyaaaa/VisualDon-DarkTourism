  # VisualDon — Dark Tourism

  Projet de visualisation de données autour du *dark tourism* : visiter des lieux marqués
  par la mort, la catastrophe ou la souffrance. Où s'arrête le devoir de mémoire,
  où commence le voyeurisme ? C'est la question que ce projet pose au visiteur.

  **Directives du cours :** https://github.com/MediaComem/comem-visualdon/blob/main/projet/README.md

  ---

  ## 1. Contexte

  Le projet s'appuie sur **deux jeux de données complémentaires**, l'un quantitatif, l'autre qualitatif.

  ### a. Fréquentation des lieux (2015–2025)
  Le fichier `dark_tourism_recapitulatif_2015_2025.csv` recense le nombre annuel de
  visiteurs pour neuf lieux emblématiques (Pompéi, Auschwitz, Tchernobyl, Ground Zero,
  Catacombes de Paris, Namie/Fukushima, Sarajevo, Syrie, Catacombes des Capucins de Palerme).

  Ces chiffres ont été **compilés à la main par notre équipe**, à partir de sources
  hétérogènes : rapports annuels des sites, offices de tourisme, articles de presse,
  publications officielles des autorités locales. Il n'existe aucune base centralisée
  recensant la fréquentation des lieux de dark tourism — nous avons donc dû **agréger
  et harmoniser des sources publiées dans des contextes différents**.

  **Biais et absences à reconnaître :**
  - **Précision inégale.** Auschwitz publie ses chiffres officiellement, alors que la
    fréquentation de Tchernobyl, du « human safari » de Sarajevo ou du tourisme de
    guerre en Syrie repose sur des estimations journalistiques.
  - **Lieux à zéro.** Les colonnes `Sarajevo_Human_Safari` à 0 ne signifient pas
    qu'il n'y a eu aucun cas, mais qu'aucune donnée publique fiable n'existe — c'est
    précisément le cœur du problème : ces pratiques échappent à la statistique.
  - **Eurocentrisme.** Notre sélection privilégie l'Europe et les États-Unis, avec
    une seule entrée asiatique (Fukushima), aucune en Afrique, aucune en Amérique
    latine. Le « dark tourism » tel que nous le visualisons est avant tout un objet
    occidental.
  - **Effet COVID** (2020–2022) qui rend les comparaisons année par année trompeuses.

  ### b. Perception du public (sondage interne)
  Le fichier `Data/reponses_forms.csv` contient les réponses à un formulaire que nous
  avons diffusé en mars 2026. On y demande, pour chacun des neuf lieux, **dans quelle
  mesure le répondant le considère comme du dark tourism** (échelle de 1 à 5).

  **Biais évidents :**
  - Échantillon non représentatif (cercle étudiant, francophone, jeune).
  - Diffusion par réseaux personnels → effet de chambre d'écho culturelle.
  - Aucune donnée démographique collectée → impossible de croiser les réponses
    avec l'âge, l'origine ou le rapport personnel à l'événement.

  Nous avons fait le choix d'**assumer ces biais** plutôt que de les masquer : ils
  font partie du propos. Le dark tourism est justement un terrain où la donnée
  « propre » n'existe pas.

  ---

  ## 2. Description des données

  ### `dark_tourism_recapitulatif_2015_2025.csv`
  - **Format :** CSV, séparateur `;`
  - **11 lignes** (une par année, 2015 → 2025)
  - **10 colonnes :** `Annee` + 9 lieux
  - **Type :** entiers (nombre de visiteurs annuel) ; valeurs manquantes notées `NA`
  - **Plage :** de 0 à plus de 11 millions de visiteurs

  ### `Data/reponses_forms.csv`
  - **Format :** CSV, séparateur `,` (également disponible en `.xlsx`)
  - **Colonnes :** `Index`, 9 lieux notés de 1 à 5, `Submitter`, `Submission Date`,
    `Submission ID`
  - **Type :** entiers ordinaux (1 = « pas du tout du dark tourism », 5 = « clairement
    du dark tourism »), avec quelques cellules vides pour les répondants qui ont
    préféré ne pas se prononcer

  ---

  ## 3. But du projet

  Notre approche est **à la fois exploratoire et explicative**.

  **Explorer** d'abord : avec la carte interactive et la timeline, on laisse le
  visiteur naviguer librement entre les lieux et voir comment leur fréquentation a
  évolué. Pourquoi Tchernobyl explose-t-il après 2017 ? Pourquoi la Syrie continue-t-elle
  d'attirer ? Les chiffres invitent à se poser des questions sans imposer de réponse.

  **Expliquer** ensuite : la structure narrative du site (scrollytelling d'introduction,
  mise en confrontation des cas Pompéi / Tchernobyl / Sarajevo) **guide volontairement
  le lecteur vers une question inconfortable** : où trace-t-on la ligne ? Visiter
  Pompéi semble anodin, le « human safari » de Sarajevo nous révolte — pourtant ce
  sont les deux extrémités d'un même spectre.

  L'histoire que nous voulons raconter est celle de **cette ligne mouvante**. En
  croisant la perception du public (sondage) avec la fréquentation réelle (visites),
  on cherche à montrer que **les lieux les plus visités ne sont pas forcément ceux
  que les gens jugent les plus dérangeants** — et inversement. Le dark tourism est
  moins une catégorie figée qu'un miroir tendu au visiteur.

  ---

  ## 4. Références

  Le terme *dark tourism* a été théorisé par **John Lennon et Malcolm Foley** dans
  leur ouvrage fondateur *Dark Tourism: The Attraction of Death and Disaster*
  (Continuum, 2000). Depuis, le sujet a généré une littérature académique abondante
  ainsi que de nombreux traitements journalistiques et visuels :

  - **Institute for Dark Tourism Research (iDTR)** — University of Central
    Lancashire : centre de recherche dédié, cartographie et publications académiques.
  - **The Pudding** — leur travail sur les lieux de mémoire et le tourisme de guerre
    illustre comment la donnée peut accompagner un récit sensible
    (https://pudding.cool).
  - **The Guardian / BBC / Le Monde** — couverture du *« Sarajevo human safari »*
    révélé en 2025, qui a remis le sujet sur le devant de la scène européenne.
  - **Pic de fréquentation de Tchernobyl** post-série HBO (2019) : analysé
    notamment par *The New York Times* et *Reuters* — exemple type d'un lieu de
    catastrophe transformé en destination par la pop culture.
  - **9/11 Memorial & Museum (NYC)** — fréquentation publiée annuellement, débats
    récurrents sur la boutique de souvenirs et la frontière mémorial / attraction.
  - **Atlas Obscura** — recensement collaboratif de lieux insolites incluant
    beaucoup de sites de dark tourism, utile comme contre-point « grand public ».

  Notre projet s'inscrit dans cette lignée mais cherche à **décaler le regard** :
  plutôt que de classer ou de juger, on confronte le visiteur à sa propre échelle
  de tolérance.

  ---

  ## Stack technique

  - **MapLibre GL** pour la carte
  - **D3** / JS vanilla pour les graphiques (timeline, comparatif, vote)
  - **HTML / CSS** scrollytelling

  ## Lancer le projet

  ```bash
  npm install
  npm run dev
  ```

  ---

  ## 5. Détail des sources par lieu

  Voici, lieu par lieu, les sources utilisées pour reconstituer les chiffres
  de fréquentation 2015–2025. Les valeurs marquées d'un `~` sont des estimations
  ou des projections ; les autres sont issues de rapports officiels ou de la presse.

  ### 1. Fukushima (Mémorial et zone de Namie/Futaba)
  *Focus sur la zone de reconstruction et de mémoire.*

  | Année | Visiteurs (Est.) | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015-16** | ~0 | [Fukushima Pref.](https://www.pref.fukushima.lg.jp/sec/32031a/kanko-koryu3.html) | Zone encore sous ordre d'évacuation total. |
  | **2017-18** | 152 000 | [Namie Town](https://www.town.namie.fukushima.jp/) | Réouverture partielle de Namie. |
  | **2019** | 210 000 | [Fukushima Stats](https://www.pref.fukushima.lg.jp/sec/32031a/kanko-koryu3.html) | Pic d'intérêt avant la pandémie. |
  | **2020** | 40 000 | [FIPO Memorial](https://www.fipo.or.jp/memorial/en) | Ouverture du Mémorial de Futaba en sept. 2020. |
  | **2021** | 110 000 | [Ukedo School](https://www.town.namie.fukushima.jp/) | Impact COVID compensé par l'ouverture d'Ukedo. |
  | **2022** | 250 000 | [Hope Tourism](https://www.pref.fukushima.lg.jp/) | Levée des restrictions à Futaba. |
  | **2023** | 427 000 | [Kyodo News](https://english.kyodonews.net/) | Explosion du tourisme scolaire et international. |
  | **2024** | 465 000 | [Fukushima Gov](https://www.pref.fukushima.lg.jp/) | Chiffre record pour la zone côtière. |
  | **2025** | **~510 000** | [Projection 2026](https://www.pref.fukushima.lg.jp/) | Estimation basée sur la croissance du Hope Tourism. |

  ---

  ### 2. Sarajevo « Human Safari » (Participants estimés)
  *Note : Chiffres liés aux enquêtes criminelles sur les tireurs étrangers.*

  | Année | Événement | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015-21** | Néant | [ICTY Archives](https://www.icty.org/) | Faits traités comme des rumeurs de guerre. |
  | **2022** | Révélation | [Al Jazeera](https://balkans.aljazeera.net/) | Sortie du film provoquant l'ouverture d'enquêtes. |
  | **2023** | Procédure | [Balkan Insight](https://balkaninsight.com/) | Identification des premiers témoins clés. |
  | **2024** | Instruction | [Reuters](https://www.reuters.com/) | Le parquet de Milan saisit des documents de 1993. |
  | **2025** | **~230 suspects** | [El Pais](https://english.elpais.com/) | Estimation du nombre de « tireurs » étrangers impliqués. |

  ---

  ### 3. Syrie (Tourisme international)
  *Chiffres incluant pèlerinages et tourisme post-conflit.*

  | Année | Visiteurs | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015-16** | ~500 000 | [SANA News](https://sana.sy/en/) | Majorité de pèlerins religieux (Irakiens/Iraniens). |
  | **2017-18** | 1,7 million | [Reuters](https://www.reuters.com/) | Reprise post-libération d'Alep. |
  | **2019** | 2,5 millions | [Syrian Guides](https://syrianguides.com/) | Record de touristes occidentaux (aventuriers). |
  | **2020-21** | ~900 000 | [Ministry Tourism](https://sana.sy/fr/) | Chute drastique due au COVID-19. |
  | **2022-23** | 2,1 millions | [Zawya](https://www.zawya.com/) | Normalisation et retour des circuits organisés. |
  | **2024** | 3,01 millions | [Al Arabiya](https://english.alarabiya.net/) | Reprise forte du tourisme culturel (Alep/Palmyre). |
  | **2025** | **~4,0 millions** | [Ministry 2026](https://sana.sy/fr/) | Estimation officielle (croissance de 80% des étrangers). |

  ---

  ### 4. Catacombes des Capucins (Palerme, Italie)

  | Année | Visiteurs | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015-18** | ~240 000 | [Comune Palermo](https://www.comune.palermo.it/) | Croissance stable des croisiéristes. |
  | **2019** | 310 000 | [ISTAT Sicilia](https://www.istat.it/) | Année de référence avant pandémie. |
  | **2020-21** | ~75 000 | [Osservatorio Turismo](https://pti.regione.sicilia.it/) | Fermetures répétées et jauges strictes. |
  | **2022** | 240 000 | [Palermo Today](https://www.palermotoday.it/) | Retour au niveau de 2015. |
  | **2023** | 320 000 | [ISTAT](https://www.istat.it/it/sicilia) | Record historique grâce au tourisme US/UK. |
  | **2024** | 350 000 | [Sindaco Palermo](https://www.comune.palermo.it/) | Palerme dépasse les 2M de nuitées totales. |
  | **2025** | **~380 000** | [Projection 2026](https://www.comune.palermo.it/) | Estimation basée sur +7,3% de flux touristique. |

  ---

  ### 5. Pompéi (Parc archéologique)

  | Année | Visiteurs | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015-18** | ~3,3 millions | [Pompeii Data](https://pompeiisites.org/en/) | Moyenne sur 4 ans (augmentation constante). |
  | **2019** | 3 833 836 | [Pompeii Sites](https://pompeiisites.org/en/) | Sommet pré-COVID. |
  | **2020-21** | ~850 000 | [MIC Italy](https://pompeiisites.org/en/) | Période de confinement national. |
  | **2022** | 2 978 000 | [Pompeii Data](https://pompeiisites.org/en/) | Reprise robuste. |
  | **2023** | 3 985 000 | [Pompeii Data](https://pompeiisites.org/en/) | Dépassement du record de 2019. |
  | **2024** | 4 100 000 | [Pompeii Data](https://pompeiisites.org/en/) | Mise en place de quotas pour limiter la foule. |
  | **2025** | **~4 250 000** | [Pompeii Data](https://pompeiisites.org/en/) | Estimation (gestion par billets nominatifs). |

  ---

  ### 6. Auschwitz-Birkenau (Mémorial)

  | Année | Visiteurs | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015-18** | ~2,0 millions | [Auschwitz Report](https://www.auschwitz.org/) | Stabilisation autour de 2M. |
  | **2019** | 2 320 000 | [Auschwitz Report](https://www.auschwitz.org/) | Record absolu du musée. |
  | **2020-21** | ~530 000 | [Auschwitz.org](https://www.auschwitz.org/) | Chute de 75% à cause des restrictions frontalières. |
  | **2022** | 1 184 000 | [Auschwitz Report](https://www.auschwitz.org/) | Reprise lente, impact de la guerre en Ukraine voisine. |
  | **2023** | 1 950 000 | [Auschwitz Report](https://www.auschwitz.org/) | Retour aux niveaux de 2015. |
  | **2024** | 2 200 000 | [Auschwitz Report](https://www.auschwitz.org/) | Forte demande des groupes scolaires. |
  | **2025** | **~2 400 000** | [Report 2025](https://www.auschwitz.org/download/gfx/auschwitz/en/defaultstronaopisowa/358/21/1/report_2025.pdf) | Projection basée sur les réservations anticipées. |

  ---

  ### 7. Tchernobyl (Zone d'exclusion, Ukraine)

  | Année | Visiteurs | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015-18** | ~45 000 | [DAZV Ukraine](https://www.kmu.gov.ua/) | Moyenne avant l'effet de la série HBO. |
  | **2019** | 124 415 | [DAZV Report](https://www.kmu.gov.ua/) | Pic historique (effet série Chernobyl). |
  | **2020-21** | ~55 000 | [DAZV Ukraine](https://www.kmu.gov.ua/) | Impact combiné COVID et incendies de forêt. |
  | **2022-23** | < 5 000 | [Zvit DAZV 2024](https://www.kmu.gov.ua/storage/app/sites/1/17-civik-2018/zvit_2024/zvit_DAZV_2024.pdf) | Invasion russe et suspension du tourisme. |
  | **2024** | ~12 000 | [DAZV Ukraine](https://www.kmu.gov.ua/) | Réouverture très limitée pour missions spécifiques. |
  | **2025** | **~18 000** | [Projection 2025](https://www.kmu.gov.ua/) | Estimation de reprise graduelle. |

  ---

  ### 8. 9/11 Memorial (Ground Zero, NY)

  | Année | Visiteurs | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015-18** | ~3,1 millions | [911 Memorial](https://www.911memorial.org/) | Données stables pour le musée. |
  | **2019** | 3 250 000 | [Annual Report](https://www.911memorial.org/) | Année record pré-pandémie. |
  | **2020-21** | ~800 000 | [911 Memorial](https://www.911memorial.org/) | New York à l'arrêt complet pendant la pandémie. |
  | **2022** | 1 900 000 | [911 Memorial](https://www.911memorial.org/) | Retour du tourisme domestique américain. |
  | **2023** | 2 800 000 | [911 Memorial](https://www.911memorial.org/) | Reprise massive du tourisme international. |
  | **2024** | 3 150 000 | [911 Memorial](https://www.911memorial.org/) | Quasi-retour au niveau de 2019. |
  | **2025** | **~3 400 000** | [Report 2025](https://www.911memorial.org/2025-annual-report) | Nouveau record estimé. |