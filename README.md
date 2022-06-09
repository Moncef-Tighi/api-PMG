
# Projet de plateforme E-Commerce

Ce projet vise à créer une plateforme utiliser par l'équipe E-Commerce de l'entreprise PMG pour faciliter leur travail.
Il y a trois objectifs principaux :

- Voir les informations de tout les articles depuis la base de donnée de l'entreprise
- Permettre aux employés de choisir quels articles mettre en vente facilement
- Créer une interface qui permet de gérer facilement les commandes
- Automatiser le processus de livraison en contactant les magasins qui possèdent l'article et en envoyant une requête aux prestataires de livraison via leur API


## Appendix

Cegid est l'ERP utilisé par PMG pour gérer entre autre les informations de stock et des articles.

PMG possède actuellement un site web (pmg.dz) qui fonctionne avec wooCommerce. Mais l'entreprise espère en créer un autre à l'avenir

Le projet est séparé en trois applications :

- L'API de Cegid qui a pour seul objectif d'extraire les informations de l'ERP.
- l'API de la plateforme qui gère tout l'aspect backend.
- La plateforme qui est le côté front-end et qui est utilisé comme site d'administration.

L'entreprise espère a l'avenir remplacer son site web actuelle ainsi que créer une application mobile. L'application doit donc être découplé de leur architecture actuelle.


## Run Locally

D'abord, cloner le projet

```bash
  git clone https://github.com/Moncef-Tighi/api-PMG
```

Le projet utilise nodeJS et NPM. Il faut les installer avant de commencer.


### Démarrer l'API CEGID : 

```bash
  cd ./api-cegid
```

>Installer SQL Server ainsi qu'une backup de la base de donnée de l'entreprise
OU se connecter à la base de donnée de développement

copier le fichier contenant les variables d'environnement :

```bash
  cp config.test.env config.env
```

Modifier les variables d'environnement avec un éditeur de texte

```bash
  nano config.env
```

Installer et démarer le projet : 

```bash
  npm install
  npm run start
  OU
  npm run dev
```

### Démarrer l'api de la plateforme : 

```bash
  cd ./api-plateforme
```

- Installer PostgreSQL ainsi qu'une backup de la base de donnée de l'entreprise
OU se connecter à la base de donnée de développement

- Installer WordPress avec WooCommerce et utiliser une backup des données du site pmg.dz
OU utiliser un site créé pour le développement

- Génerer des API key sur wooCommerce et les sauvgarder (voir la documentation de wooCommerce pour plus de détails)

copier le fichier contenant les variables d'environnement :

```bash
  cp config.test.env config.env
```

Modifier les variables d'environnement avec un éditeur de texte. Ajouter les informations de connexion de la DB ainsi que les clés et l'URL de wooCommerce
```bash
  nano config.env
```

Installer et démarer le projet : 

```bash
  npm install
  npm run start
  OU
  npm run dev
```


### Démarrer le site web : 

```bash
  cd plateforme
```

Installer les dépendances :

```bash
  npm install
```



* Si vous souhaitez simplement utiliser le site web sans le modifier, il faut le build tout de suite :

```bash
  npm run build
```

- Après la fin du build lancer le site : 

```bash
  serve -s build -l 3000
```

>Si vous souhaitez faire des modifications l'application React a été créé avec la toolchain create-react-app. Vous pouvez démarer un serveur de développement avec la commande : 

```bash
  npm run start
```

- Attention ! Dans le fichier src/index.js il y a deux variables d'environnement qui indique l'URL des deux API, il faudra donc les modifier.
