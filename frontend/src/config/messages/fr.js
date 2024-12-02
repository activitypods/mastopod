// Model https://github.com/marmelab/react-admin/blob/master/packages/ra-language-french/src/index.ts

export default {
  app: {
    description: 'Une appli compatible Mastodon qui enregistre tout dans votre Pod',
    action: {
      edit_profile: 'Éditer mon profil',
      edit_public_profile: 'Éditer le profil public',
      edit_private_profile: 'Éditer le profil privé',
      follow: 'Suivre',
      unfollow: 'Ne plus suivre',
      send: 'Envoyer',
      reply: 'Répondre',
      boost: 'Booster',
      like: 'Soutenir',
      sendDirectMessage: 'Envoyer un message direct',
      message: 'Message'
    },
    page: {
      my_inbox: 'Boîte de réception',
      my_outbox: "Boîte d'envoi",
      followers: 'Abonnés',
      following: 'Abonnements',
      posts: 'Messages',
      posts_and_replies: 'Messages & Réponses'
    },
    card: {
      find_user: 'Trouver un acteur'
    },
    block: {},
    input: {
      message: 'Votre message',
      reply: 'Votre réponse'
    },
    helper: {
      find_user: 'Pour trouver un acteur dans le fediverse, entrez son identifiant et tapez Enter.'
    },
    message: {
      early_dev_warning:
        'Cette application est en cours de développement. Utilisez-la pour des tests uniquement, et veuillez remonter les bugs que vous trouvez sur',
      actor_boosted: '%{actor} a boosté',
      no_result: 'Aucun résultat'
    },
    notification: {
      message_sent: 'Votre message a été envoyé',
      message_send_error: 'Erreur en envoyant le message: %{error}',
      post_boosted: 'Le message a été boosté',
      post_liked: 'Le message a été liké',
      post_like_removed: 'Le like du message a été enlevé',
      actor_followed: 'Vous suivez maintenant cet acteur',
      actor_unfollowed: 'Vous ne suivez plus cet acteur',
      image_upload_error: "Échec de l'upload de l'image"
    },
    validation: {},
    visibility: {
      public: 'Publique',
      followersOnly: 'Abonnés',
      mentionsOnly: 'Personnes spécifiques'
    }
  }
};
