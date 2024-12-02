// Model https://github.com/marmelab/react-admin/blob/master/packages/ra-language-french/src/index.ts

export default {
  app: {
    description: 'A Mastodon-compatible app that saves all data in your Pod',
    action: {
      edit_profile: 'Edit profile',
      edit_public_profile: 'Edit public profile',
      edit_private_profile: 'Edit private profile',
      follow: 'Follow',
      unfollow: 'Unfollow',
      send: 'Send',
      reply: 'Reply',
      boost: 'Boost',
      like: 'Like',
      sendDirectMessage: 'Send a direct message',
      message: 'Message'
    },
    page: {
      my_inbox: 'My inbox',
      my_outbox: 'My outbox',
      followers: 'Followers',
      following: 'Following',
      posts: 'Posts',
      posts_and_replies: 'Posts & Replies'
    },
    card: {
      find_user: 'Find user'
    },
    block: {},
    input: {
      message: 'Your message',
      reply: 'Your reply'
    },
    helper: {
      find_user: 'To find another fediverse member, enter their handle and hit enter.'
    },
    message: {
      early_dev_warning:
        'This application is in early development. Use it for tests only, and please report issues you find on',
      actor_boosted: '%{actor} boosted',
      no_result: 'No result'
    },
    notification: {
      activity_send_error: 'Error while posting the activity: %{error}',
      message_sent: 'Your message has been sent',
      post_boosted: 'The post has been boosted',
      post_liked: 'The post has been starred',
      post_like_removed: 'The post has been unstarred',
      actor_followed: 'You are now following this actor',
      actor_unfollowed: 'You are not following this actor anymore',
      image_upload_error: 'Uploading picture failed'
    },
    validation: {},
    visibility: {
      public: 'Public',
      followersOnly: 'Followers',
      mentionsOnly: 'Specific people'
    }
  }
};
