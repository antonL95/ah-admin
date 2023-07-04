// @ts-ignore
import {getAbsoluteAdminUrl} from "@strapi/utils";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({strapi}) {
    strapi.db.lifecycles.subscribe({
      models: ['admin::user'],
      async afterCreate(event) {
        const {result} = event;
        const {registrationToken} = result;
        if (!registrationToken) {
          return;
        }

        const emailSettings = strapi.plugin('email').service('email').getProviderSettings();
        const defaultFrom = emailSettings?.settings?.defaultFrom || 'Strapi <no-reply@strapi.io>';
        const defaultReplyTo = emailSettings?.settings?.defaultReplyTo || 'Strapi <no-reply@strapi.io>';
        const userPermissionService = strapi.plugin('users-permissions').service('users-permissions')
        const inviteLink = `${getAbsoluteAdminUrl(strapi.config)}/auth/register?registrationToken=${registrationToken}`;


        const emailTemplate = {
          subject: 'Welcome <%= USER.firstname %>',
          html: `<p>Hi <%= USER.firstname %>!</p>
<p>You've been invited to a workspace. Please click on the link below to create your account.</p>
<p><%= URL %></p>
<p>Thanks.</p>`,
        }


        emailTemplate.html = await userPermissionService.template(emailTemplate.html, {
          URL: inviteLink,
          USER: result,
        });

        strapi
        .plugin('email')
        .service('email')
        .send({
          to: result.email,
          from: defaultFrom,
          replyTo: defaultReplyTo,
          subject: emailTemplate.subject,
          text: emailTemplate.html,
          html: emailTemplate.html,
        })
        .catch((err) => {
          strapi.log.error(err);
        });
      },
    });
  },
};
