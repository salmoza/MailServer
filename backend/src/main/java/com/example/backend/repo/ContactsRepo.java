package com.example.backend.repo;

import com.example.backend.entities.Contact;
import com.example.backend.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface ContactsRepo extends JpaRepository<Contact, String> {

    Page<Contact> findByOwner(User owner, Pageable pageable);

    Page<Contact> findByOwnerAndNameContainingIgnoreCase(User owner, String name, Pageable pageable);

    @Query("SELECT c FROM Contact c JOIN c.emailAddresses e " +
            "WHERE c.owner = :owner AND e LIKE %:email%")
    Page<Contact> findByOwnerAndEmailAddressContaining(
            User owner,
            String email,
            Pageable pageable
    );
}