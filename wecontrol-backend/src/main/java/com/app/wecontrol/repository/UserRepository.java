package com.app.wecontrol.repository;

import com.app.wecontrol.dtos.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserRepository extends MongoRepository<User, String> {
    UserDetails findByLogin(String login);
}
