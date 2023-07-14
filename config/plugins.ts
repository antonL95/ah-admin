module.exports = ({env}) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: 'info@artistshero.com',
        defaultReplyTo: 'info@artistshero.com',
      },
    },
  },
  upload: {
    config: {
      provider: "strapi-provider-cloudflare-r2",
      providerOptions: {
        accessKeyId: env("CF_ACCESS_KEY_ID"),
        secretAccessKey: env("CF_ACCESS_SECRET"),
        endpoint: env("CF_ENDPOINT"),
        region: env('CF_REGION'),
        params: {
          Bucket: env("CF_BUCKET"),
        },
        cloudflarePublicAccessUrl: env("CF_PUBLIC_ACCESS_URL"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  'preview-button': {
    config: {
      injectListViewColumn: false,
      openTarget: '_blank',
      contentTypes: [
        {
          uid: 'api::artist.artist',
          draft: {
            url: env('PREVIEW_URL'),
            query: {
              id: '{id}',
              secret: env('PREVIEW_SECRET'),
              endpoint: 'artists',
              locale: '{locale}',
            },
          },
          published: {
            url: env('PUBLISH_URL') + `{locale}/gallery/artists/{id}`,
            endpoint: 'artists',
          },
        },
        {
          uid: 'api::product.product',
          draft: {
            url: env('PREVIEW_URL'),
            query: {
              id: '{id}',
              secret: env('PREVIEW_SECRET'),
              endpoint: 'products',
              locale: '{locale}',
            },
          },
          published: {
            url: env('PUBLISH_URL') + `{locale}/gallery/artists/{id}`,
          },
        },
      ],
    },
  },
});
