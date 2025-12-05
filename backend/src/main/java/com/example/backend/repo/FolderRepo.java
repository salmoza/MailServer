package com.example.backend.repo;

import com.example.backend.entities.Folder;
import com.example.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FolderRepo extends JpaRepository<Folder, String> {
    Folder findByFolderId(String folderId);
}
