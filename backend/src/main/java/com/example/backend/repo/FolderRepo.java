package com.example.backend.repo;

import com.example.backend.entities.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepo extends JpaRepository<Folder, String> {
    Folder findByFolderIdAndUserUserId(String folderId, String userId);
    Folder findByFolderId (String folderId) ;
    List<Folder> findByUserUserId(String userId);
}
