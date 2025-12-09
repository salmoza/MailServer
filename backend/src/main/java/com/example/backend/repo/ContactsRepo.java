package com.example.backend.repo;

import com.example.backend.entities.Contact;
import com.example.backend.entities.Mail;
import com.example.backend.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface ContactsRepo extends JpaRepository<Contact, String> {

    Page<Contact> findByOwner(User owner, Pageable pageable);
    List<Contact> findByOwner(User owner);

    Page<Contact> findByOwnerAndNameContainingIgnoreCase(User owner, String name, Pageable pageable);

    @Query("""
        SELECT DISTINCT c FROM Contact c 
        LEFT JOIN c.emailAddresses e
        WHERE c.owner = :owner
          AND (
                LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(c.notes) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(c.phoneNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(e) LIKE LOWER(CONCAT('%', :query, '%'))
          )
        """)
    Page<Contact> searchContacts(@Param("owner") User owner,
                                 @Param("query") String query,
                                 Pageable pageable);

}
