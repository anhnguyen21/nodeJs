export const config = {
  api: {
    region: process.env.REGION,
    clientWebsite: process.env.CLIENT_WEBSITE
  },
  bcrypt: {
    salt: +process.env.BCRYPT_SALT || 10
  },
  jwt: {
    secretKey: process.env.JWT_SECRET || 'secretKey',
    expiredIn: '3600s'
  },
  smtpService: {
    host: process.env.SMTP_HOST || 'mail.enouvodev.com',
    port: +process.env.SMTP_PORT || 465,
    user: process.env.SMTP_USER || 'noreply-dev@enouvodev.com',
    password: process.env.SMTP_PASS || 'C1sE(6u}2&'
  },
  sentry: {
    sentryKey: process.env.SENTRY_KEY
  }
}
