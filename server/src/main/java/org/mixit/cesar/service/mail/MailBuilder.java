package org.mixit.cesar.service.mail;

import java.util.Optional;
import javax.swing.text.html.Option;

import com.google.common.base.Preconditions;
import org.mixit.cesar.model.security.OAuthProvider;
import org.mixit.cesar.service.AbsoluteUrlFactory;
import org.mixit.cesar.service.authentification.Credentials;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Created by ehret_g on 27/10/15.
 */
@Service
public class MailBuilder {

    @Autowired
    private AbsoluteUrlFactory urlFactory;

    public enum TypeMail {
        REINIT_PASSWORD,
        ACCOUND_NEW_VALIDATION,
        SOCIAL_ACCOUNT_VALIDATION,
        CESAR_ACCOUNT_VALIDATION
    }

    public String createHtmlMail(TypeMail typeMail, Credentials credentials, Optional<OAuthProvider> provider) {
        Preconditions.checkNotNull(typeMail, "type is required");
        Preconditions.checkNotNull(credentials, "credentials are required");

        StringBuilder message = new StringBuilder();

        message.append("<div style=\"font-family: Arial;color: #424242;margin:2em\">");
        message.append("<p>Bonjour <b>").append(credentials.getFirstname()).append(" ").append(credentials.getLastname()).append("</b></p>");
        message.append("<h2>Vos informations d'identification Mix-IT</h2>");

        //TODO i18n
        String url = String.format("%s/app/account/valid?token=%s", urlFactory.getBaseUrl(), credentials.getToken());
        switch (typeMail) {
            case REINIT_PASSWORD:
                url = String.format("%s/app/account/password?token=%s", urlFactory.getBaseUrl(), credentials.getToken());
                message.append("<p>Vous nous avez demandé de réinitialiser votre mot de passe. Pour celà veuillez suivre le lien suivant <a href=\"")
                        .append(url)
                        .append("\">")
                        .append(url)
                        .append("</a></p>");
                break;
            case ACCOUND_NEW_VALIDATION:
                message.append("<p>Vous nous avez demandé de réinitialiser votre mot de passe mais vous utilisez une connexion via le reseau social ")
                        .append(provider.orElse(OAuthProvider.TWITTER))
                        .append(". Nous ne pouvons pas changer le mot de passe. Si vous souhaitez à nouveau valider votre adresse email cliquez sur le lien suivant <a href=\"")
                        .append(url)
                        .append("\">")
                        .append(url)
                        .append("</a></p>");
                break;
            case CESAR_ACCOUNT_VALIDATION:
            case SOCIAL_ACCOUNT_VALIDATION:
                message.append("<p>Vous venez de créer un compte sur le site de <a href=\"")
                        .append(urlFactory.getBaseUrl())
                        .append("\">Mix-IT</a>. Pour le valider veuillez cliquer sur ce lien <a href=\"")
                        .append(url)
                        .append("\">")
                        .append(url)
                        .append("</a>. Vous pourrez ensuite la partie sécurisée du site.</p>");
                break;
        }

        message.append("<p>Attention, ce code n'est valable que pendant trois heures. Passé ce délai, vous devrez soumettre une nouvelle demande de modification de vos informations d'identification.</p>");
        message.append("<b>La team Mix-IT</b>");
        message.append("</div>");

        return message.toString();
    }

}
