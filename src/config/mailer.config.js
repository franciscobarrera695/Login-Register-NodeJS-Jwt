// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import sgMail from "@sendgrid/mail";
export const sendMail = async (email, subject, html) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email, // Change to your recipient
      from: "franciscobarrera968@gmail.com", // Change to your verified sender
      subject: subject,
      text: "and easy to do anywhere, even with Node.js",
      html: html,
    };
  
    await sgMail.send(msg);
  
    console.log("Email sent");
  } catch (error) {
      console.log(error)
  }
};

export const getTemplate = (name, token) => {
  return `
        <h1>Hola Bienvenido ${name}!</h1>
        <p>para confirmar tu correo, ingresa al siguiente link</p>
        <a href=http://localhost:3000/verify/${token}>ConfirmarCuenta</a>
      `;
};

export const getTemplatePassword = (name, token) => {
  return `
        <h1>Olvido su Password ${name} ?</h1>
        <p>para cambiar su password, ingresa al siguiente link</p>
        <a href=http://localhost:3000/forget-password/${token}>Forget Password</a>
      `;
};
