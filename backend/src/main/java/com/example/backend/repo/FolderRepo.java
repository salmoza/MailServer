package com.example.backend.repo;

import com.example.backend.entities.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepo extends JpaRepository<Folder, String> {
    Folder findByFolderNameAndUserUserId(String folderName, String userId);
    Folder findByFolderIdAndUserUserId(String folderId, String userId);
    Optional<Folder> findByFolderId (String folderId) ;
    List<Folder> findByUserUserId(String userId);
    Folder findByFolderName (String folderNmae) ;
}
