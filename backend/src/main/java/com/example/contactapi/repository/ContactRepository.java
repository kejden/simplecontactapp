package com.example.contactapi.repository;

import com.example.contactapi.model.Contact;
import com.example.contactapi.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContactRepository extends JpaRepository<Contact, String> {
    Optional<Contact> findById(String id);
    Page<Contact> findAllByUser(User user, Pageable pageable);
}
