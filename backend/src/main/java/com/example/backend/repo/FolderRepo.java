package com.example.backend.repo;

import com.example.backend.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepo extends JpaRepository<Folder, String> {
    Folder findByFolderNameAndUserUserId(String folderName, String userId);
    Folder findByFolderIdAndUserUserId(String folderId, String userId);
    Optional<Folder> findByFolderId (String folderId) ;
    List<Folder> findByUserUserId(String userId);
    Folder findByFolderName (String folderNmae);
    Folder getByFolderId (String folderId);

    @Query("SELECT f FROM Folder f WHERE f.user.userId = :userId AND f.folderName NOT IN :defaultFolders")
    List<Folder> findCustomFolders(
            @Param("userId") String userId,
            @Param("defaultFolders") List<String> defaultFolders
    );
}
