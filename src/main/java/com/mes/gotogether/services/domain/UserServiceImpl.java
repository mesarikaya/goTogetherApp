package com.mes.gotogether.services.domain;

import com.mes.gotogether.domains.User;
import com.mes.gotogether.repositories.domain.UserRepository;
import java.util.List;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final  UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Mono<User> findUserById(ObjectId id) {

        if (Objects.isNull(id)) {
            return Mono.empty();
        }

        return userRepository.findById(id);
    }

    @Override
    public Mono<List<User>> findAllUsers() {
        return userRepository.findAll().collectList();
    }

    @Override
    @PreAuthorize("isAnonymous() or isAuthenticated()")
    public Mono<User> findByUserId(String userId) {

        // Check null cases
        if (ObjectUtils.isEmpty(userId)) {
            return Mono.empty();
        }

        // Check if user exists
        return userRepository.findByUserId(userId);
    }

    @Override
    public Mono<User> createUser(User user) {

        if (Objects.isNull(user)) {
            return Mono.empty();
        }

        return userRepository.save(user);
    }

    @Override
    public Mono<User> saveOrUpdateUser(User user) {

        // Check if new user is null, empty cases
        if (!Objects.isNull(user)){
            log.debug("REQUESTING SAVE OR UPDATE with  user: " + user);
            // Check if the user exists (By email and oauthId)
            // Check if user exists, if so, update. Otherwise create
            return userRepository.findByUserId(user.getUserId())
                    .flatMap(userInDb -> {
                        log.debug("user in db is: " + userInDb);
                        log.debug("Update the user");
                        user.setId(userInDb.getId());
                        log.debug("USER in repository: " + userInDb);
                        return userRepository.save(user);
                    })
                    .switchIfEmpty(Mono.defer(() -> {
                        log.debug("Creating a new User 2");
                        return this.createUser(user);
                    }));

            // TODO: CREATE SUCCESS HANDLER AND CONNECT ON SUCCSES CASE
            // TODO: CREATE AN ERROR HANDLER AND CONNECT ON ERROR CASE
        }else{

            // TODO: CREATE ERROR HANDLERS
            log.info("A Null user data is entered. Do not process!");
            return Mono.empty();
        }
    }

    @Override
    public Mono<Void> deleteUserById(ObjectId id) {

        if (Objects.isNull(id)) {
            return Mono.empty();
        }

        return userRepository.deleteById(id);
    }

    @Override
    public Mono<Void> deleteByUserId(String userId) {

        // Check null cases
        if (ObjectUtils.isEmpty(userId)) {
            return Mono.empty();
        }

        return userRepository.deleteByUserId(userId);
    }

    @Override
    public Mono<Void> deleteAll() {
        return userRepository.deleteAll();
    }
}
