# Projet Web

> Fait par Teiva TESSON et Wissem CHEDLY

## Configurer le projet

Dupliquer le fichier ```.env.example``` et le renommer ```.env``` puis mettre les valeurs souhaitées aux variables.

## Lancer le projet

1. Installer Docker (ou Docker Desktop qui contient Docker) et le lancer.
2. Ouvrir un terminal dans le dossier du projet.
3. Lancer la commande suivante:

```bash
docker compose up -d --build
```

> Sur Linux, si l'utilisateur n'est pas dans le groupe ```docker```, utiliser ```sudo```

4. Aller sur [http://localhost:4173/](http://localhost:4173/) dans votre navigateur.
5. Pour fermer l'application, lancer :

```bash
docker compose down
```

## Tester le projet

Vous pouvez tester le projet avec les identifiants de test :

- Employé
  - username: emp
  - password: emp
- Utilisateur
  - username: user
  - password: user
