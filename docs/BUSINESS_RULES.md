# Business Rules

- **Identité unique** — email et username sont uniques ; les doublons sont rejetés.
- **Rôles** — rôles Admin et User ; un nouvel utilisateur est User par défaut.
- **Présence** — l’activité d’un device met à jour la présence de l’utilisateur/profil.
- **Amitié** — impossible de s’auto-inviter ; une demande en attente est unique par paire ; seul le destinataire accepte/refuse.
- **Chat membership** — seul un membre peut envoyer un message ; un membre a un rôle (Owner/Admin/Member) pour les droits du salon.
- **Chats privés** — exactement deux membres ; les groupes peuvent en avoir plusieurs.
- **Notifications** — créées pour nouveaux messages et demandes d’ami ; marquage lu/non-lu.
- **Sessions** — les refresh tokens expirent après la durée configurée ; un token expiré/invalidé est refusé.
- **Pièces jointes** — stockées en métadonnées (URL + infos de contenu) ; la propriété est tracée.
- **Réactions** — un utilisateur a une seule réaction par message ; réagir à nouveau met à jour la précédente.
