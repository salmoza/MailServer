package com.example.backend.repo;

import com.example.backend.entities.Contact;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ContactsRepo extends JpaRepository<Contact,Long> {
    List<Contact> findByOwnerId(Long ownerId, Sort sort);
    List<Contact> findByOwnerIdAndNameContainingOrOwnerIdAndEmail(
            Long ownerId,String name,Long ownerId2,String email,Sort sort
    );
}
