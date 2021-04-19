import { transporter } from '../shared/smtp'

export const sendEmailResetPassword = async (receiverEmail: string, restPasswordTokenLink: string) => {
  try {
    const mailOptions = {
      from: 'ontherisedev@enouvo.com',
      to: receiverEmail,
      subject: 'On the rise - Reset your password',
      html: `<p>Click this link to reset your password <a href=${restPasswordTokenLink} target="_blank">Click here</a></p>`
    }
    return await transporter.sendMail(mailOptions)
  } catch (err) {
    console.log(err)
    throw err
  }
}
