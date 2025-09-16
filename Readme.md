cahier des endpoints

1- Authentification
| **Méthode** | **Endpoint**         | **Description**                                        |
| ----------- | -------------------- | ------------------------------------------------------ |
| `POST`      | `/register` | Créer un compte utilisateur                            |
| `POST`      | `/login`    | Connexion avec email/password → JWT                    |
| `POST`      | `/forgot`   | Demander un reset password (OTP/email)                 |
| `POST`      | `/reset`    | Réinitialiser le mot de passe                          |
| `GET`       | `/me`       | Retourne le profil de l’utilisateur connecté (via JWT) |

2-gestion des user
| **Méthode** | **Endpoint**     | **Description**                             |
| ----------- | ---------------- | ------------------------------------------- |
| `GET`       | `/users`     | Liste des utilisateurs (Admin only)         |
| `GET`       | `/users/:id` | Détails d’un utilisateur                    |
| `PUT`       | `/users/:id` | Modifier infos basiques (role, email, etc.) |
| `DELETE`    | `/users/:id` | Supprimer un utilisateur (Admin only)       |

| **Méthode** | **Endpoint**           | **                                       |
| ----------- | ---------------------- | --------------------------------------------------------------------------------- |
| `POST`      | `/api/profiles`        | Créer/mettre à jour son profil                                                    |
| `GET`       | `/api/profiles/:id`    | Voir un profil public                                                             |
| `PUT`       | `/api/profiles/:id`    | Modifier un profil (si owner ou admin)                                            |
| `GET`       | `/api/profiles/search` | Rechercher profils par critères (skills, disponibilités, préférences, IA ranking) |

4-Matching(IA-pairing intelligent)
| **Méthode** | **Endpoint**                | **Description**                                    |
| ----------- | --------------------------- | -------------------------------------------------- |
| `GET`       | `/api/matchings/suggest`    | L’IA propose des pairs pour l’utilisateur connecté |
| `POST`      | `/api/matchings/:id/accept` | Accepter une suggestion                            |
| `POST`      | `/api/matchings/:id/reject` | Refuser une suggestion                             |
| `GET`       | `/api/matchings`            | Liste des pairings (acceptés, en attente, rejetés) |
| `GET`       | `/api/matchings/:id`        | Détails d’un pairing                               |
| `POST`      | `/api/matchings/manual`     | Créer un pairing manuel (admin ou premium)         |

5-feedback
| **Méthode** | **Endpoint**            | **Description**                     |
| ----------- | ----------------------- | ----------------------------------- |
| `POST`      | `/api/feedback`         | Laisser un feedback sur un pairing  |
| `GET`       | `/api/feedback/:userId` | Voir les feedbacks d’un utilisateur |
| `GET`       | `/api/feedback`         | (Admin) Liste de tous les feedbacks |

6-souscription
| **Méthode** | **Endpoint**                 | **Description**                             |
| ----------- | ---------------------------- | ------------------------------------------- |
| `GET`       | `/api/subscriptions`         | Voir l’état de son abonnement               |
| `POST`      | `/api/subscriptions/upgrade` | Passer en PREMIUM                           |
| `POST`      | `/api/subscriptions/cancel`  | Annuler un abonnement                       |
| `GET`       | `/api/subscriptions/plans`   | Liste des plans (FREE, PREMIUM, ENTERPRISE) |

7- Admin (monitoring & gestion)

| **Méthode** | **Endpoint**             | **Description**                                                       |
| ----------- | ------------------------ | --------------------------------------------------------------------- |
| `GET`       | `/api/admin/users`       | Voir tous les utilisateurs                                            |
| `GET`       | `/api/admin/matchings`   | Voir tous les matchings                                               |
| `GET`       | `/api/admin/metrics`     | Stats IA (ex. taux de réussite des pairings, satisfaction, % premium) |
| `POST`      | `/api/admin/ban/:id`     | Bannir un utilisateur                                                 |
| `POST`      | `/api/admin/promote/:id` | Donner rôle ADMIN ou PREMIUM                                          |
