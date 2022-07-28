## Pré-requis

Node.js doit être préalablement installé

## Installation de l'API Piiquante

### 1) Installation des dépendances du projet

À la racine du projet, lancez simplement cette commande, elle instalera toutes les dépendances necessaires
> npm install

### 2) Configuration de la variable d'environnement `.env`

Ouvrez le fichier .env insérez-y les identifiants MongoDB ainsi que la clé secrete pour les token JSON (Vous pouvez choisir une clé à d'un générateur de mot de passe comme [ici](https://www.lastpass.com/fr/features/password-generator))
<blockquote>
MONGODB_USERNAME=`Identifiant à insérer`</br>
MONGODB_PASSWORD=`Identifiant à insérer`</br>
JWT_SECRET_KEY=`Clé à insérer`
</blockquote>

### 3) Créer le dossier `uploadDirectory` s'il n'est pas déjà présent

### 4) Lancez l'API avec la commande
> node server