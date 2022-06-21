import { EmailProvider, EmailRequest, MultiProviderStrategy, Options, Provider, Request } from 'notifme-sdk';
import * as dotenv from "dotenv";
dotenv.config();

/*
 * `providers` is an array containing all the instances that were
 * created from your configuration.
 */
const customStrategy: MultiProviderStrategy = (providers: any) => async (request: Request) => {
    // Choose one provider using your own login
    const provider = providers[Math.floor(Math.random() * providers.length)];
  
    try {
      const id = await provider.send(request)
      return {id, providerId: provider.id}
    } catch (error: any) {
      error.providerId = provider.id
      throw error
    }
}

//this provider is only for development
const loggerProvider: Provider = {
    type: 'logger'
}

//these are for production
//email providers
const smtpProvider: EmailProvider = {
    type: 'smtp',
    host: 'smtp.example.com',
    port: 465,
    secure: true,
    auth: {
      user: 'xxxxx',
      pass: 'xxxxx'
    }
}

const sendmailProvider: EmailProvider = {
    type: 'sendmail',
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
}

const mailgunProvider: EmailProvider = {
    type: 'mailgun',
    apiKey: 'xxxxx',
    domainName: 'example.com'
}

const mandrillProvider: EmailProvider = {
    type: 'mandrill',
    apiKey: 'xxxxx'
}

const sendgridProvider: EmailProvider = {
    type: 'sendgrid',
    apiKey: 'xxxxx'
}

const sparkpostProvider: EmailProvider = {
    type: 'sparkpost',
    apiKey: 'xxxxx'
}

const sesProvider: EmailProvider = {
    type: 'ses',
    region: 'xxxxx',
    accessKeyId: 'xxxxx',
    secretAccessKey: 'xxxxx',
    sessionToken: 'xxxxx' // optional
}

const customeProvider: EmailProvider = {
    type: 'custom',
    id: 'my-custom-email-provider...',
    send: async (request: EmailRequest) => {
      // Send email

      return 'id...'
    }
}

export const config: Options = {
    useNotificationCatcher: true, //use true if you want to catch the notification on notification catcher (package must be installed). If true then channel option will be ignored so only use in development
    channels: {
        email: {
            multiProviderStrategy: 'fallback', //can be fallback, no-fallback, roundrobin
            providers: [] //choose the providers to use
        }
    }
}