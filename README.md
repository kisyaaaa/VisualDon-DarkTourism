  # VisualDon — Dark Tourism

  Site web déployé : https://dark-tourism.netlify.app/

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

  *Avertissement : nos chiffres correspondent à un périmètre élargi (Mémorial de Futaba + zone touristique de Namie + circuits Hope Tourism + visites scolaires + flux côtier). Les sources officielles ne publient pas de statistique agrégée annuelle sur ce périmètre — elles donnent soit le **Mémorial Futaba** (≈350 000 visiteurs cumulés depuis sept. 2020 selon FIPO), soit le programme **Hope Tourism** (~17 800/an en FY2022 selon japan.go.jp). Les valeurs ci-dessous sont donc des **estimations d'auteur** sauf mention contraire.*

  | Année | Visiteurs (Est.) | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015-16** | ~0 | Estimation auteur — agrégation de sources | Zone encore sous ordre d'évacuation total. |
  | **2017-18** | 152 000 | Estimation auteur — agrégation de sources | Réouverture partielle de Namie ; chiffre non confirmé par source officielle. |
  | **2019** | 210 000 | Estimation auteur — agrégation de sources | Pic d'intérêt avant la pandémie. |
  | **2020** | 40 000 | [Mémorial de Futaba (FIPO)](https://www.fipo.or.jp/lore/) | Mémorial ouvert le 20 septembre 2020 — ordre de grandeur cohérent. |
  | **2021** | 110 000 | Estimation auteur — agrégation de sources | Impact COVID compensé par l'ouverture d'Ukedo Elementary School. |
  | **2022** | 250 000 | [FIPO — annonce 300 000 visiteurs cumulés (juillet 2024)](https://www.fipo.or.jp/lore/archives/6221) | FIPO annonce 300 000 cumulés au 6 juillet 2024 ; notre chiffre annuel est une estimation déduite. |
  | **2023** | 427 000 | Estimation auteur — agrégation de sources | Source officielle parle de 350 000 cumulés au Mémorial en février 2025 — notre chiffre élargit au Hope Tourism et au tourisme scolaire. |
  | **2024** | 465 000 | [Hope Tourism — gouvernement du Japon](https://www.japan.go.jp/kizuna/2023/11/fukushimas_hope_tourism.html) | Hope Tourism = ~17 800 visiteurs en FY2022 ; notre chiffre couvre un périmètre beaucoup plus large. |
  | **2025** | **~510 000** | Estimation auteur — agrégation de sources | Projection basée sur la croissance du Hope Tourism, sans rapport officiel. |

  ---

  ### 2. Sarajevo « Human Safari » (chronologie judiciaire)
  *Note : aucune statistique de fréquentation publique n'existe — par nature les faits sont clandestins. La colonne `Sarajevo_Human_Safari` du CSV reste à 0 (voir biais en section 1.a). Les lignes ci-dessous suivent la chronologie judiciaire et médiatique, pas un nombre de visiteurs.*

  | Année | Événement | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015-21** | Aucune procédure publique | Estimation auteur — agrégation de sources | Faits traités comme des rumeurs de guerre, non documentés statistiquement. |
  | **2022** | Sortie du documentaire *Sarajevo Safari* | [Wikipédia — *Sarajevo Safari* (film)](https://en.wikipedia.org/wiki/Sarajevo_Safari_(film)) | Première au AJB DOC Festival (sept. 2022) ; plainte pénale déposée en Bosnie. |
  | **2023** | Ouverture d'enquêtes | [Wikipédia — *Sarajevo Safari* (chronologie)](https://en.wikipedia.org/wiki/Sarajevo_Safari) | Janvier 2023 : le journaliste Edin Karić complète sa plainte. |
  | **2024** | Instruction | Estimation auteur — agrégation de sources | Aucune action judiciaire publique majeure documentée pour 2024. |
  | **2025** | Enquête du parquet de Milan | [Al Jazeera — *Italy probes Sarajevo sniper safaris* (nov. 2025)](https://www.aljazeera.com/news/2025/11/13/italy-probes-sarajevo-sniper-safaris-what-were-they-who-was-involved) | Cinq personnes identifiées par Gavazzeni ; un suspect interrogé en février 2026. **Le chiffre de « 230 suspects » initialement avancé n'a pas pu être confirmé dans les sources consultées.** |

  ---

  ### 3. Syrie (Tourisme international)
  *Chiffres incluant pèlerinages et tourisme post-conflit.*

  | Année | Visiteurs | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015-16** | ~500 000 | Estimation auteur — agrégation de sources | Sources tierces (Wikipedia *Tourism in Syria*) donnent ~170 000 en 2015 ; notre chiffre inclut largement les pèlerinages religieux (Irakiens/Iraniens), périmètre élargi. |
  | **2017-18** | 1,7 million | Estimation auteur — agrégation de sources | Reprise post-libération d'Alep ; chiffre repris de la presse économique sans rapport public retrouvé. |
  | **2019** | 2,5 millions | [Syrian Guides — *Tourism Revival in Numbers*](https://syrianguides.com/travel-to-syria-tourism-revival-in-numbers/) | « Syria welcomed approximately 2.5 million tourists » en 2019. |
  | **2020-21** | ~900 000 | Estimation auteur — agrégation de sources | Chute drastique due au COVID-19 ; impact qualitatif documenté sans chiffre officiel précis. |
  | **2022-23** | 2,1 millions | [Syrian Guides — *Tourism Revival in Numbers*](https://syrianguides.com/travel-to-syria-tourism-revival-in-numbers/) | « 1,5 million projected end-2022, 727 000 first 5 months 2023 ». |
  | **2024** | 3,01 millions | [Arab News — *Syria's tourism surges 80%*](https://www.arabnews.com/node/2630946/business-economy) | ~3,02 M jan-nov 2024 (déduit de la hausse de +18% à 3,56 M en 2025). |
  | **2025** | **~4,0 millions** | [SANA — *Over 3.5 million visitors to Syria*](https://sana.sy/en/tour-syria/2292962/) | SANA officiel : « More than 3.5 million Arab and foreign tourists since liberation through end Nov 2025 » — projection annuelle ~4 M. |

  ---

  ### 4. Catacombes des Capucins (Palerme, Italie)

  *Avertissement : le site est géré par l'ordre franciscain et **ne publie pas de statistique annuelle de fréquentation**. Il est absent des bases ISTAT et du Ministero della Cultura italien (qui ne recensent que les sites publics). Toutes les valeurs ci-dessous sont donc des **estimations d'auteur**, déduites de chiffres globaux du tourisme palermitain et de mentions dans la presse locale.*

  | Année | Visiteurs | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015-18** | ~240 000 | Estimation auteur — agrégation de sources | Aucune statistique publique pour le site ; chiffre extrapolé du tourisme palermitain global. |
  | **2019** | 310 000 | Estimation auteur — agrégation de sources | Année de référence avant pandémie. |
  | **2020-21** | ~75 000 | Estimation auteur — agrégation de sources | Fermetures répétées et jauges strictes. |
  | **2022** | 240 000 | Estimation auteur — agrégation de sources | Retour estimé au niveau de 2015. |
  | **2023** | 320 000 | Estimation auteur — agrégation de sources | Aucun chiffre site-spécifique publié par ISTAT. |
  | **2024** | 350 000 | Estimation auteur — agrégation de sources | Palerme dépasse les 2 M de nuitées totales (donnée Comune, mais non ventilée par site). |
  | **2025** | **~380 000** | Estimation auteur — agrégation de sources | Projection basée sur +7,3 % de flux touristique global à Palerme. |

  ---

  ### 5. Pompéi (Parc archéologique)

  Source unique pour toutes les années : la page officielle [Pompeii Sites — Visitor Data](https://pompeiisites.org/en/archaeological-park-of-pompeii/visitor-data/) publie un tableau annuel complet.

  | Année | Visiteurs | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015** | 3 505 172 | [Pompeii Visitor Data](https://pompeiisites.org/en/archaeological-park-of-pompeii/visitor-data/) | Tableau officiel du parc. |
  | **2016** | 3 769 803 | [Pompeii Visitor Data](https://pompeiisites.org/en/archaeological-park-of-pompeii/visitor-data/) | Tableau officiel du parc. |
  | **2017** | 4 023 900 | [Pompeii Visitor Data](https://pompeiisites.org/en/archaeological-park-of-pompeii/visitor-data/) | Tableau officiel du parc. |
  | **2018** | 3 768 164 | [Pompeii Visitor Data](https://pompeiisites.org/en/archaeological-park-of-pompeii/visitor-data/) | Tableau officiel du parc. |
  | **2019** | 3 925 616 | [Pompeii Visitor Data](https://pompeiisites.org/en/archaeological-park-of-pompeii/visitor-data/) | Sommet pré-COVID (chiffre officiel). |
  | **2020** | 594 823 | [Pompeii Visitor Data](https://pompeiisites.org/en/archaeological-park-of-pompeii/visitor-data/) | Période de confinement national. |
  | **2021** | 1 036 380 | [Pompeii Visitor Data](https://pompeiisites.org/en/archaeological-park-of-pompeii/visitor-data/) | Réouverture progressive. |
  | **2022** | 3 060 049 | [Pompeii Visitor Data](https://pompeiisites.org/en/archaeological-park-of-pompeii/visitor-data/) | Reprise robuste. |
  | **2023** | 4 079 235 | [Pompeii Visitor Data](https://pompeiisites.org/en/archaeological-park-of-pompeii/visitor-data/) | Dépassement du record de 2019. |
  | **2024** | 4 177 753 | [Pompeii Visitor Data](https://pompeiisites.org/en/archaeological-park-of-pompeii/visitor-data/) | Mise en place de quotas pour limiter la foule. |
  | **2025** | **4 118 926** | [Pompeii Visitor Data](https://pompeiisites.org/en/archaeological-park-of-pompeii/visitor-data/) | Données 2025 telles que publiées par le parc (gestion par billets nominatifs). |

  ---

  ### 6. Auschwitz-Birkenau (Mémorial)

  | Année | Visiteurs | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015** | 1 720 000 | Estimation auteur — agrégation de sources | Annonce officielle annuelle non retrouvée en archive. |
  | **2016** | 2 053 000 | Estimation auteur — agrégation de sources | Annonce officielle annuelle non retrouvée en archive. |
  | **2017** | 2 100 000 | Estimation auteur — agrégation de sources | Année du 12e million cumulé depuis 1947. |
  | **2018** | 2 152 000 | [Auschwitz.org — annonce 2018](https://www.auschwitz.org/en/museum/news/2-million-152-thousand-visitors-at-the-memorial-in-2018,1341.html) | « 2 million 152 thousand people from all over the world visited the Memorial » (chiffre officiel). |
  | **2019** | 2 320 000 | [Auschwitz.org — annonce 2019](https://www.auschwitz.org/en/museum/news/2-million-320-thousand-visitors-at-the-auschwitz-memorial-in-2019,1400.html) | Record absolu pré-pandémie (chiffre officiel). |
  | **2020** | 502 000 | [Auschwitz.org — annonce 2020](https://www.auschwitz.org/en/museum/news/exceptionally-difficult-year-502-000-visitors-at-the-auschwitz-memorial-in-2020-,1461.html) | « Exceptionally difficult year » : –78 % vs 2019 (chiffre officiel). |
  | **2021** | 560 000 | Estimation auteur — agrégation de sources | Annonce officielle annuelle non retrouvée ; ordre de grandeur post-COVID. |
  | **2022** | 1 184 000 | [Auschwitz.org — annonce 2022](https://www.auschwitz.org/en/museum/news/1-million-184-thousand-people-visited-the-memorial-in-2022,1595.html) | Reprise lente, guerre en Ukraine voisine (chiffre officiel). |
  | **2023** | 1 670 000 | [Auschwitz.org — annonce 2023](https://www.auschwitz.org/en/museum/news/1-million-670-thousand-people-visited-the-memorial-in-2023,1663.html) | Chiffre officiel publié par le Mémorial. |
  | **2024** | 1 830 000 | [Auschwitz.org — annonce 2024](https://www.auschwitz.org/en/museum/news/1-million-830-thousand-people-visited-the-memorial-in-2024,1738.html) | Chiffre officiel publié par le Mémorial. |
  | **2025** | **1 950 000** | [Auschwitz.org — annonce 2025](https://www.auschwitz.org/en/museum/news/1-95-million-visitors-to-the-auschwitz-memorial-and-museum-in-2025,1812.html) | Chiffre officiel publié par le Mémorial. |

  ---

  ### 7. Tchernobyl (Zone d'exclusion, Ukraine)

  | Année | Visiteurs | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015-16** | ~16 000 / ~35 000 | Estimation auteur — agrégation de sources | Données partielles avant que la State Agency (DAZV) publie une statistique annuelle stable. |
  | **2017** | 46 136 | [Statista — Chernobyl Exclusion Zone tourists](https://www.statista.com/statistics/1231428/number-of-tourists-in-chernobyl-exclusion-zone/) | Compilation Statista basée sur DAZV. |
  | **2018** | 71 869 | [Statista — Chernobyl Exclusion Zone tourists](https://www.statista.com/statistics/1231428/number-of-tourists-in-chernobyl-exclusion-zone/) | Compilation Statista basée sur DAZV. |
  | **2019** | 124 423 | [Statista — Chernobyl Exclusion Zone tourists](https://www.statista.com/statistics/1231428/number-of-tourists-in-chernobyl-exclusion-zone/) | Pic historique (effet série HBO *Chernobyl*). |
  | **2020** | 36 450 | [Statista — Chernobyl Exclusion Zone tourists](https://www.statista.com/statistics/1231428/number-of-tourists-in-chernobyl-exclusion-zone/) | Impact combiné COVID et incendies de forêt. |
  | **2021** | 73 086 | [Statista — Chernobyl Exclusion Zone tourists](https://www.statista.com/statistics/1231428/number-of-tourists-in-chernobyl-exclusion-zone/) | Reprise partielle. |
  | **2022-23** | < 5 000 | [Zvit DAZV 2024 (PDF)](https://www.kmu.gov.ua/storage/app/sites/1/17-civik-2018/zvit_2024/zvit_DAZV_2024.pdf) | Invasion russe : suspension complète du tourisme dans la zone. |
  | **2024** | ~12 000 | Estimation auteur — agrégation de sources | Réouverture très limitée pour missions spécifiques ; pas de chiffre DAZV public. |
  | **2025** | **~18 000** | Estimation auteur — agrégation de sources | Projection de reprise graduelle, non confirmée par DAZV. |

  ---

  ### 8. 9/11 Memorial (Ground Zero, NY)

  *Note de périmètre : le site comprend le **Memorial Plaza** (extérieur, gratuit, ~10 millions de visiteurs/an typique) et le **Memorial Museum** (payant, ~3 millions/an typique). Notre CSV `Ground_Zero_NYC` agrège les deux ; les chiffres ci-dessous correspondent au périmètre combiné quand la source le précise, sinon au seul Plaza.*

  | Année | Visiteurs | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015** | 8 500 000 | Estimation auteur — agrégation de sources | Chiffre combiné Plaza + Musée ; pas de rapport annuel public détaillé pour cette année. |
  | **2016** | 6 500 000 | Estimation auteur — agrégation de sources | Idem. |
  | **2017** | 6 800 000 | Estimation auteur — agrégation de sources | Idem. |
  | **2018** | 6 600 000 | [9/11 Memorial — bilan 2018 (blog officiel)](https://www.911memorial.org/connect/blog/reflecting-2018-see-911-memorial-museums-year-review) | Le blog officiel confirme « 3.1 million visitors » pour le Musée seul ; le total Plaza + Musée est extrapolé. |
  | **2019** | 6 300 000 | Estimation auteur — agrégation de sources | Année record pré-pandémie ; pas de chiffre combiné officiel retrouvé. |
  | **2020** | 3 000 000 | Estimation auteur — agrégation de sources | New York à l'arrêt ; Musée fermé mars-sept. 2020. |
  | **2021** | 3 500 000 | [9/11 Memorial — Rapport annuel 2021](https://www.911memorial.org/2021-annual-report) | Capacité limitée à 25 % pendant une grande partie de l'année. |
  | **2022** | 3 500 000 | [9/11 Memorial — Rapport annuel 2022](https://www.911memorial.org/2022-annual-report) | Retour du tourisme domestique américain. |
  | **2023** | 11 000 000 | [9/11 Memorial — Rapport annuel 2023](https://www.911memorial.org/2023-annual-report) | Rapport mentionne 2 265 000 pour le Musée ; total Plaza + Musée beaucoup plus élevé. |
  | **2024** | 11 600 000 | [9/11 Memorial — Rapport annuel 2024](https://www.911memorial.org/2024-annual-report) | Rapport sépare 11,6 M (Memorial) + 2,4 M (Museum) — chiffre Memorial officiel. |
  | **2025** | **11 300 000** | [9/11 Memorial — Rapport annuel 2025](https://www.911memorial.org/2025-annual-report) | Estimation tirée du rapport annuel 2025 (à confirmer une fois la version finale en ligne). |

  ---

  ### 9. Catacombes de Paris

  | Année | Visiteurs | Source / Lien | Commentaire |
  | :--- | :--- | :--- | :--- |
  | **2015** | 505 085 | [Wikipédia — Catacombes de Paris, tableau de fréquentation](https://fr.wikipedia.org/wiki/Catacombes_de_Paris#Fréquentation) | Données reprises de Paris Musées (Wikipédia compile les bilans annuels). |
  | **2016** | 512 284 | [Wikipédia — Catacombes de Paris, tableau de fréquentation](https://fr.wikipedia.org/wiki/Catacombes_de_Paris#Fréquentation) | Données reprises de Paris Musées. |
  | **2017** | 537 935 | [Wikipédia — Catacombes de Paris, tableau de fréquentation](https://fr.wikipedia.org/wiki/Catacombes_de_Paris#Fréquentation) | Données reprises de Paris Musées. |
  | **2018** | 480 000 | [Paris Musées — Bilan fréquentation 2018](https://www.parismusees.paris.fr/en/news/attendance-in-2018-three-million-visitors-to-city-of-paris-museums) | « The Paris Catacombs acquired a new entrance and welcomed 480,000 visitors » (chiffre officiel). |
  | **2019** | 601 900 | Estimation auteur — agrégation de sources | Chiffre repris d'un tableau Assises du tourisme durable ; document source non retrouvé en ligne. |
  | **2020** | N/D | Estimation auteur — agrégation de sources | Bilan annuel non publié séparément (COVID). |
  | **2021** | N/D | Estimation auteur — agrégation de sources | Bilan annuel non publié séparément (COVID). |
  | **2022** | N/D | Estimation auteur — agrégation de sources | Bilan annuel non publié séparément. |
  | **2023** | 603 684 | [Paris Musées — Communiqué fréquentation 2023](https://www.tendancehotellerie.fr/articles-breves/communique-de-presse/20893-article/5-300-879-visiteurs-accueillis-en-2023-dans-les-sites-et-musees-de-la-ville-de-paris-17-par-rapport-a-2022) | « CATACOMBES DE PARIS · 01/01/2023 · 31/12/2023 · 603 684 » (communiqué Paris Musées). |
  | **2024** | 607 730 | [Paris Musées — Bilan fréquentation 2024](https://presseagence.fr/paris-4-848-944-visiteurs-accueillis-dans-les-sites-et-musees-de-la-ville-de-paris-en-2024/) | « Les Catacombes ont attiré 607 730 visiteurs, un chiffre stable par rapport à 2023 ». |
  | **2025** | **~600 000** | [Franceinfo — fermeture des Catacombes (nov. 2025)](https://www.franceinfo.fr/culture/patrimoine/histoire/pas-prevues-pour-accueillir-600-000-visiteurs-par-an-les-catacombes-de-paris-ferment-leurs-portes-lundi-pour-cinq-mois-de-travaux_7588937.html) | Article confirme « 600 000 visiteurs par an » à la veille de la fermeture du 3 novembre 2025 — ordre de grandeur, pas le réalisé exact 2025. |
