package com.deepak.grocery_delivery.repository;

import com.deepak.grocery_delivery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {


    Optional<User> findByEmail(Integer integer);

    boolean existsByEmail(String email);

    boolean existsByPhone(String username);

    Optional<User> findByEmail(String email);
}
