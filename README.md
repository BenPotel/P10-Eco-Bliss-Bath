# Eco-Bliss-Bath

Eco Bliss Bath est une start-up de 20 personnes, spécialisée dans la vente de produits de beauté écoresponsables dont le produit principal est un savon solide.

La boutique prépare un site de vente en ligne.

# Prérequis

Pour faire lancer et faire fonctionner le projet, vous aurez besoin de Docker, Node.js, NPM (ou autre gestionnaire de paquets tel que yarn), Cypress et votre navigateur préféré (Chrome et/ou Firefox recommandés)

# Pour lancer le projet

Lancer Docker desktop

Lancer votre terminal de commande dans le dossier racine du projet et saisir la commande "docker-compose up" afin de lancer le back-end

Saisir "docker-compose down" afin de stopper le back-end

Vous pouvez désormais consulter le site à l'adresse suivante :

Http://localhost:8080

# Pour les tests

Installer la librairie Cypress en saisissant la commande suivante dans votre terminal (toujours à la racine du projet) : npm install cypress --save-dev

Pour accéder à l'interface Cypress, saisir la commande : npx cypress open

Pour lancer tous les tests présents dans le dossier Cypress sans lancer l'interface, saisir la commande : npx cypress run

# Infos login

Identifiant: test2@test.fr

Mot de passe : testtest

# Infos API

Le swagger du projet se trouve à l'adresse suivante :

http://localhost:8081/api/doc
