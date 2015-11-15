package org.mixit.cesar.config;

import org.mixit.cesar.service.AbsoluteUrlFactory;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.context.embedded.ErrorPage;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

@Configuration
public class CesarErrorConfig {

    @Bean
    public EmbeddedServletContainerCustomizer containerCustomizer(AbsoluteUrlFactory urlFactory) {

        return (container -> {
            container.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/cerror/404"));
        });
    }


}
