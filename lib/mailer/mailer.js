var nconf = require('nconf');
var nodemailer = require('nodemailer'),
    fs = require("fs"),
    transporter = nodemailer.createTransport({
	    service: nconf.get('MAIL_SERVICE'),
        auth: {
            user: nconf.get('MAIL_AUTH_USER'),
            pass: nconf.get('MAIL_AUTH_PASSWORD')
        }
    }),
    fromMail = nconf.get('MAIL_FROM'),
    fromName = nconf.get('MAIL_NAME'),
    mailReplyTo = nconf.get('MAIL_REPLY_TO');

module.exports = {
    sendMail: function(content, subject, mailTo, nameTo, callback) {
        var debug = nconf.get('DEBUG');
        var debugMail = nconf.get('DEBUG_MAIL');
        var mailOptions = {
            from: fromName + '<' + fromMail + '>',
            to: nameTo + '<' + mailTo + '>',
            subject: subject,
            html: content,
            replyTo: mailReplyTo
        };

        if(debug && debug === 'true') {
            mailOptions.to = debugMail + '<' + debugMail + '>';
        }
        
        transporter.sendMail(mailOptions, function(error, info){
	        console.log(error);
            callback(error, info);
        });
    },
    sendValidationEmail: function(user, callback) {
        var confirmationMailTemplate = fs.readFileSync("lib/mailer/template/confirmation_mail.html", {encoding : "utf8"});
        var confirmationMail = JSON.parse(JSON.stringify(confirmationMailTemplate));
        confirmationMail = confirmationMail.replace(/{validationToken}/g, user.validationToken);
        this.sendMail(confirmationMail, "[FaceAct] Validation de votre inscription", user.email, user.firstName + " " + user.lastName, callback);        
    },
    sendValidationEmailUpdated: function(user, callback) {
        var confirmationMailTemplate = fs.readFileSync("api/templates/confirmation_updated_mail.html", {encoding : "utf8"});
        var confirmationMail = JSON.parse(JSON.stringify(confirmationMailTemplate));
        var confirmationLink = sails.config.api.url +  "/login?code=" + user.emailVerificationCode + "&user=" + user.id;
        confirmationMail = confirmationMail.replace(/{confirmation_link}/g, confirmationLink);
        confirmationMail = confirmationMail.replace("{first_name}", user.firstName);
        confirmationMail = confirmationMail.replace("{last_name}", user.lastName);
        this.sendMail(confirmationMail, "[FaceAct] Confirmation de votre changement d'identifiant", user.email, user.firstName + " " + user.lastName, callback);
    },
    sendResetPasswordEmail: function(user, password, callback) {
        var resetPasswordMailTemplate = fs.readFileSync("lib/mailer/template/reset_password_mail.html", {encoding : "utf8"});
        var resetPasswordMail = JSON.parse(JSON.stringify(resetPasswordMailTemplate));
        resetPasswordMail = resetPasswordMail.replace("{password}", password);
        resetPasswordMail = resetPasswordMail.replace("{first_name}", user.firstName);
        resetPasswordMail = resetPasswordMail.replace("{last_name}", user.lastName);
        this.sendMail(resetPasswordMail, "[FaceAct] Réinitialisation de votre mot de passe", user.email, user.firstName + " " + user.lastName, callback);
    }
};