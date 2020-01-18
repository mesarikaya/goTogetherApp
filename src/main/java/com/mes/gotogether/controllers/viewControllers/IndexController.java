package com.mes.gotogether.controllers.viewControllers;

import com.mes.gotogether.security.domain.AuthRequest;
import java.util.Map;
import java.util.stream.Collectors;
import javax.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import reactor.core.publisher.Mono;

@Slf4j
@Controller
public class IndexController {

    @GetMapping({"", "/", "/index", "/login/oauth2/callback/google"})
    public String getIndexPage(AuthRequest authRequest){

        log.debug("Getting Index page and directing to login page");
        return "index";
    }

    @GetMapping("/login")
    public String getLoginPage(Model model, String error, String logout) {
        if (error != null)
            model.addAttribute("error", "Your username and password is invalid.");

        if (logout != null)
            model.addAttribute("message", "You have been logged out successfully.");

        log.debug("Opening the login page");
        return "login";
    }

    public String authorizeLogin(@RequestParam AuthRequest authRequest){

        return "login";
    }



    /*
    @GetMapping({"", "/", "/index", "/login/oauth2/callback/google"})
    public String index(Model model,
                        @RegisteredOAuth2AuthorizedClient OAuth2AuthorizedClient authorizedClient,
                        @AuthenticationPrincipal OAuth2User oauth2User) {
        model.addAttribute("userName", oauth2User.getName());
        model.addAttribute("clientName", authorizedClient.getClientRegistration().getClientName());
        model.addAttribute("userAttributes", oauth2User.getAttributes());
        return "index";
    }
*/

    @GetMapping("/user")
    public String getUserPage(){

        log.debug("Getting USER page");
        return "user";
    }

    @GetMapping("/authenticated")
    public Mono<String> getAuthenticatedPage(){

        log.debug("Getting AUTHENTICATED page");
        return Mono .just(new String("authenticated"));
    }

    @PostMapping("/preprocessLogin")
    public String validateLoginInfo(Model model, @Valid AuthRequest authRequest, BindingResult bindingResult) {


        if (bindingResult.hasErrors()) {
            //Get error message
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(
                            Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage)
                    );


            System.out.println(bindingResult.getFieldErrors().toString());
            model.addAttribute("error", "Your username and password is invalid.");
        }

        model.addAttribute("userLoginForm", authRequest.getUserName());

        return "login";
    }

}
