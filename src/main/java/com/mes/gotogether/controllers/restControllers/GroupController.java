package com.mes.gotogether.controllers.restControllers;

import com.mes.gotogether.domains.requests.GroupUser;
import com.mes.gotogether.domains.responses.GroupSearchResponse;
import com.mes.gotogether.security.jwt.JWTUtil;
import com.mes.gotogether.security.service.SecurityUserLibraryUserDetailsService;
import com.mes.gotogether.services.domain.GroupService;
import com.mes.gotogether.services.domain.UserService;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@PreAuthorize("hasAnyRole('ADMIN', 'USER', 'GUEST')")
public class GroupController {

    private final UserService userService;
    private final GroupService groupService;
    private final JWTUtil jwtUtil;
    private final SecurityUserLibraryUserDetailsService securityUserService;
    private final PasswordEncoder passwordEncoder;

    public GroupController(UserService userService, GroupService groupService,
                                           JWTUtil jwtUtil, PasswordEncoder passwordEncoder,
                                           SecurityUserLibraryUserDetailsService securityUserService) {
        this.userService = userService;
        this.groupService = groupService;
        this.jwtUtil = jwtUtil;
        this.securityUserService = securityUserService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/groups")
    @ResponseStatus(HttpStatus.OK)
    public Flux<GroupSearchResponse> getGroupsByOriginAndDestinationWithinRadius(@RequestParam("origin") String origin,  @RequestParam("destination") String destination,
    							           @RequestParam("originRange") double originRadius, @RequestParam("destinationRange") double destRadius,
                                                                                                                                                        @RequestParam("page") int page, @RequestParam("size") int size)
    {   	
    	return groupService.findGroupsByOriginAndDestinationAddress(origin, destination, 
                                                                                                                               originRadius, destRadius, 
                                                                                                                               PageRequest.of(page, size))
                                                     .log("Source GET GEROUPS")
                                                      .checkpoint("In get groups")
                                                     .map(group-> new GroupSearchResponse(group));
    }
    
    @DeleteMapping("/groups/members")
    @ResponseStatus(HttpStatus.OK)
    public Mono<GroupSearchResponse> deleteGroupMember(@RequestParam("groupId") String groupId,  @RequestParam("userId") String userId)
    {   	
         log.info("Request is: groupId:" + groupId + " userID: " + userId);
         log.info("New object ID is: " + new ObjectId(groupId));
          return groupService.deleteMemberByUserId(new ObjectId(groupId), userId)
                                           .map(group-> new GroupSearchResponse(group));
    }
    
    @PutMapping("/groups/waitingList")
    @ResponseStatus(HttpStatus.OK)
    public Mono<GroupSearchResponse> addToWaitingList(@RequestBody GroupUser groupUser)
    {   	
         // TODO: Create implementation for addting user to the group waiting list   
          return groupService.addUserToWaitingList(new ObjectId(groupUser.getGroupId()), groupUser.getUserId())
                                           .map(group-> new GroupSearchResponse(group));
    }
    
    @DeleteMapping("/groups/waitingList")
    @ResponseStatus(HttpStatus.OK)
    public Mono<GroupSearchResponse> deleteFromWaitingList(@RequestParam("groupId") String groupId,  @RequestParam("userId") String userId)
    {   	
         // TODO: Create implementation for addting user to the group waiting list
          return groupService.deleteUserFromWaitingList(new ObjectId(groupId), userId)
                                           .map(group-> new GroupSearchResponse(group));
    }
    
    @DeleteMapping("/groups/invitesList")
    @ResponseStatus(HttpStatus.OK)
    public Mono<GroupSearchResponse> deleteFromInviteList(@RequestBody GroupUser groupUser)
    {   	
         log.info("Request is: groupId:" + groupUser.getGroupId() + " userID: " + groupUser.getUserId());
         log.info("New object ID is: " + new ObjectId(groupUser.getGroupId()));
         // TODO: Create implementation for addting user to the group waiting list
          return groupService.deleteUserFromWaitingList(new ObjectId(groupUser.getGroupId()), groupUser.getUserId())
                                           .map(group-> new GroupSearchResponse(group));
    }
    
    @PutMapping("/groups/invitesList")
    @ResponseStatus(HttpStatus.OK)
    public Mono<GroupSearchResponse> addToInvitesList(@RequestBody GroupUser groupUser)
    {   	
         log.info("Request is: groupId:" + groupUser.getGroupId() + " userID: " + groupUser.getUserId());
         log.info("New object ID is: " + new ObjectId(groupUser.getGroupId()));
         // TODO: Create implementation for addting user to the group waiting list   
          return groupService.addUserToWaitingList(new ObjectId(groupUser.getGroupId()), groupUser.getUserId())
                                           .map(group-> new GroupSearchResponse(group));
    }
    

    
}
