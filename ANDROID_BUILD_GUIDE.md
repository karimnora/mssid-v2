# 📱 Guide d'Exportation et Déploiement Mobile Android (Google Play Store)

> **Mssid DZ (مَسِيد)** — Application Mobile Éducative pour le Primaire Algérien (1AP - 5AP)  
> Ce guide vous explique étape par étape comment transformer cette application Web React en une **Application Android Native (.APK / .AAB)** avec **Capacitor**, la démarrer en local sur un émulateur ou téléphone, et la publier sur le **Google Play Store**.

---

## 📋 Table des Matières

1. [Prérequis pour le Développement Android](#1-prérequis-nécessaires)
2. [Structure du Projet Mobile](#2-structure-du-projet-mobile)
3. [Installation & Synchronisation Capacitor](#3-installation--synchronisation)
4. [Tester l'Application en Local sur Android](#4-tester-lapplication-en-local)
5. [Configuration du Backend API pour le Mobile](#5-configuration-de-lapi-backend)
6. [Génération du Fichier APK / AAB (Build de Production)](#6-génération-du-fichier-apk--aab)
7. [Guide de Publication sur Google Play Console](#7-publication-sur-google-play-store)

---

## 🛠️ 1. Prérequis Nécessaires

Avant de commencer sur votre machine locale (PC Windows, Mac ou Linux), assurez-vous d'avoir installé :

1. **Node.js** (v18 ou v20+) et **npm**
2. **Android Studio** (Dernière version recommandée: Ladybug / Koala)
   - Téléchargement : [https://developer.android.com/studio](https://developer.android.com/studio)
3. **Android SDK & Build Tools** (SDK Platform 34 / 35)
4. **Java Development Kit (JDK 17 ou 21)** (Configuré dans Android Studio)

---

## 📁 2. Structure du Projet Mobile

Le projet utilise **Capacitor** (par Ionic Framework), qui emballe l'application web React/Vite dans un WebView natif ultra-performant avec accès aux APIs Android.

```text
mssid-dz/
├── capacitor.config.json     # Configuration Capacitor (App ID: dz.mssid.app)
├── dist/                     # Fichiers Web compilés (HTML/JS/CSS)
├── android/                  # Projet Android Studio généré
│   ├── app/
│   │   ├── src/main/AndroidManifest.xml
│   │   └── res/              # Icônes de l'application et écran de démarrage (Splash)
│   └── build.gradle
└── package.json              # Scripts npm mobile
```

---

## 🔄 3. Installation & Synchronisation

Dans votre terminal à la racine du projet :

```bash
# 1. Compiler les assets Web React
npm run build

# 2. Initialiser le dossier Android (si ce n'est pas déjà fait)
npx cap add android

# 3. Synchroniser les fichiers web vers le projet Android
npm run cap:sync
```

*(Note : `npm run cap:sync` compile automatiquement React avec `vite build` puis copie les fichiers optimisés dans le sous-dossier `android/`)*.

---

## 📱 4. Tester l'Application en Local

### Option A : Lancer via Android Studio (Recommandé)

1. Ouvrez le projet Android dans Android Studio :
   ```bash
   npm run cap:open
   ```
   *Ou ouvrez manuellement Android Studio -> Open -> Sélectionnez le dossier `android/` du projet.*

2. Attendez que le projet Gradle termine la synchronisation (`Gradle Sync`).
3. Connectez un smartphone Android en **Mode Débogage USB** OU lancez un **Émulateur Android (AVD)**.
4. Cliquez sur le bouton vert ▶️ **Run 'app'** dans la barre d'outils d'Android Studio.

---

## 🌐 5. Configuration de l'API Backend pour Mobile

En mode web local, l'application pointe sur `http://localhost:3000`. Sur un téléphone Android physique ou un émulateur :
* `localhost` sur un émulateur Android fait référence à l'émulateur lui-même.
* Pour se connecter à votre serveur local depuis l'émulateur, utilisez l'adresse IP spéciale : `http://10.0.2.2:3000`
* Pour une utilisation en production, pointez vers votre serveur en ligne (ex: Cloud Run) : `https://ais-dev-cn6r24pirofwe5zr5sgwa2-491498094363.europe-west2.run.app`

Modifiez la variable dans le fichier `.env` :
```env
VITE_SPRING_BOOT_URL=https://votre-backend-en-ligne.com/api
```
Puis réexécutez `npm run cap:sync`.

---

## 📦 6. Génération du Fichier APK / AAB (Production Build)

Pour soumettre votre application sur le Google Play Store ou la partager directement sous forme de fichier `.apk` :

### Étape 1 : Créer la Clé de Signature (Keystore)
Dans votre terminal :
```bash
keytool -genkey -v -keystore mssid-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mssid-key
```

### Étape 2 : Générer le Bundle Android App (.aab) ou APK
1. Dans **Android Studio**, allez dans le menu supérieur :  
   `Build` ➡️ `Generate Signed Bundle / APK...`
2. Choisissez **Android App Bundle (.aab)** *(Recommandé par Google Play)* ou **APK**.
3. Sélectionnez le fichier `mssid-release-key.jks` généré précédemment.
4. Choisissez le mode **Release** et validez.
5. Android Studio générera le fichier `.aab` prêt dans `android/app/release/app-release.aab`.

---

## 🚀 7. Publication sur Google Play Store

1. Connectez-vous à la **[Google Play Console](https://play.google.com/console)**.
2. Cliquez sur **Créer une application**.
3. Renseignez les informations de base :
   - **Nom de l'application :** `Mssid DZ - مسيد`
   - **Langue par défaut :** Arabe / Français
   - **Type :** Application / Gratuite
4. Remplissez la fiche du magasin :
   - **Icône de l'app :** 512x512 px (PNG)
   - **Graphique de promotion :** 1024x500 px
   - **Captures d'écran :** Au moins 2 captures téléphone et tablette
5. Téléversez le fichier **`app-release.aab`** dans la section **Production** ou **Test Interne**.
6. Remplissez le questionnaire de contenu et la politique de confidentialité.
7. Soumettez pour examen (Validation sous 24h à 72h).

---

🎉 **Votre application Mssid DZ est prête pour les élèves et enseignants algériens sur Android !**
