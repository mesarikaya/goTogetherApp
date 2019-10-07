package com.mes.gotogether;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import com.mes.gotogether.security.config.oauthconfig.Properties;

@SpringBootApplication
@EnableConfigurationProperties(Properties.class)
public class GotogetherApplication {

    // private static final Logger log = LoggerFactory.getLogger(Application.class);

    public static void main(String[] args) {
        SpringApplication.run(GotogetherApplication.class, args);
        System.out.println("****Run Successful ****");
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }
}
