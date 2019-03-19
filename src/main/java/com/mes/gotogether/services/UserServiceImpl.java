package com.mes.gotogether.services;

import com.mes.gotogether.domains.User;
import com.mes.gotogether.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Mono<User> findUserById(ObjectId id) {
        return userRepository.findById(id);
    }

    @Override
    public Mono<List<User>> findAllUsers() {
        return userRepository.findAll().collectList();
    }

    @Override
    public Mono<User> findByUserId(String userId) {

        // Check if user exists
        Mono<User> users = userRepository
                .findByUserId(userId);

        return users;
    }

    @Override
    public Mono<User> createUser(User user) {

        return userRepository.save(user);
    }

    @Override
    public Mono<User> saveOrUpdateUser(User user) {
        System.out.println("IS repository null: " + userRepository.getClass());
        // Check if new user is null
        if(user != null){
            // Check if the user exists (By email and oauthId)
            // Check if user exists, if so, update. Otherwise create
            User userInDb = userRepository
                    .findByUserId(user.getUserId()).block();

            if (userInDb != null){
                System.out.println("Update the user");
                user.setId(userInDb.getId());
                System.out.println("USER in repository: " + userInDb);
                return userRepository.save(user);
            }else{
                System.out.println("Creating a new User");
                return this.createUser(user);
            }
            // TODO: CREATE SUCCESS HANDLER AND CONNECT ON SUCCSES CASE
            // TODO: CREATE AN ERROR HANDLER AND CONNECT ON ERROR CASE
        }else{
            System.out.println("A Null user data is entered. Do not process!");
            // TODO: CREATE ERROR HANDLERS
        }

        return Mono.empty();
    }

    @Override
    public Mono<Void> deleteUserById(ObjectId id) {
        return userRepository.deleteById(id);
    }

    @Override
    public Mono<Void> deleteAll() {
        return userRepository.deleteAll();
    }
}
