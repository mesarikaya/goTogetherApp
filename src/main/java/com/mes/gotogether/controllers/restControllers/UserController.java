package com.mes.gotogether.controllers.restControllers;

import com.mes.gotogether.domains.User;
import com.mes.gotogether.domains.responses.GroupSearchResponse;
import com.mes.gotogether.domains.responses.UserSearchResponse;
import com.mes.gotogether.security.jwt.JWTUtil;
import com.mes.gotogether.security.service.SecurityUserLibraryUserDetailsService;
import com.mes.gotogether.services.domain.GroupService;
import com.mes.gotogether.services.domain.UserService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1")
@PreAuthorize("hasAnyRole('ADMIN', 'USER', 'GUEST')")
public class UserController {

    private final UserService userService;
    private final GroupService groupService;
    private final JWTUtil jwtUtil;
    private final SecurityUserLibraryUserDetailsService securityUserService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, GroupService groupService,
                                           JWTUtil jwtUtil, PasswordEncoder passwordEncoder,
                                           SecurityUserLibraryUserDetailsService securityUserService) {
        this.userService = userService;
        this.groupService = groupService;
        this.jwtUtil = jwtUtil;
        this.securityUserService = securityUserService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/allUsers")
    @ResponseStatus(HttpStatus.OK)
    public Mono<List<User>> getAllUsers(){
        System.out.println();
        return userService.findAllUsers();
    }
    
    @GetMapping("/groups")
    @ResponseStatus(HttpStatus.OK)
    public Flux<GroupSearchResponse> getGroupsByOriginAndDestinationWithinRadius(@RequestParam("origin") String origin,  @RequestParam("destination") String destination,
    							           @RequestParam("originRange") double originRadius, @RequestParam("destinationRange") double destRadius,
                                                                                                                                                        @RequestParam("page") int page, @RequestParam("size") int size)
    {
    	/*Set<String, String> parameterMap = params.entrySet();
    	for (params.entrySet()) {
    		
    	}
    	params.entrySet().stream().forEach((e) -> System.out.println("Key: " + e.getKey() + " value: " + e.getValue()));*/
    	System.out.println("Inside the get groups function");
    	
    	return groupService.findGroupsByOriginAndDestinationAddress(origin, destination, 
                                                                                                                               originRadius, destRadius, 
                                                                                                                               PageRequest.of(page, size))
                                                     .log("Source GET GEROUPS")
                                                      .checkpoint("In get groups")
                                                     .map(group-> new GroupSearchResponse(group));
    }


    @GetMapping("/users")
    @ResponseStatus(HttpStatus.OK)
    public Flux<List<UserSearchResponse>> getUsersByOriginAndDestinationWithinRadius(@RequestParam("origin") String origin,  
                                                                                                                                            @RequestParam("destination") String destination,
    							@RequestParam("originRange") double originRadius, 
                                                                                                                                            @RequestParam("destinationRange") double destRadius,
                                                                                                                                            @RequestParam("page") int page, @RequestParam("size") int size)
    {
    	/*Set<String, String> parameterMap = params.entrySet();
    	for (params.entrySet()) {
    		
    	}
    	params.entrySet().stream().forEach((e) -> System.out.println("Key: " + e.getKey() + " value: " + e.getValue()));*/
    	System.out.println("Inside the get users function");
    	
    	return groupService.findGroupsByOriginAndDestinationAddress(origin, destination, 
                                                                                                                               originRadius, destRadius, 
                                                                                                                               PageRequest.of(page, size))
                                                     .log("Source GET GEROUPS")
                                                     .checkpoint("In get groups")
                                                     .map(group -> {
                                                         List<UserSearchResponse> response= new ArrayList<>();
                                                         group.getMembers().stream().forEach(user -> response.add(new UserSearchResponse(user)));
                                                        return response;
                                                     });
    }
}
