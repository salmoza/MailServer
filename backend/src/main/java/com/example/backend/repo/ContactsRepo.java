package com.example.backend.repo;

import com.example.backend.entities.Contact;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactsRepo extends JpaRepository<Contact,String> {
    List<Contact> findByOwnerId(String ownerId, Sort sort);
    List<Contact> findByOwnerIdAndNameContainingOrOwnerIdAndEmail(
            String ownerId,String name,String ownerId2,String email,Sort sort
    );
}
