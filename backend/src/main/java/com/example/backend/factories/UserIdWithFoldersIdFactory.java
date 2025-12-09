package com.example.backend.factories;

import com.example.backend.dtos.UserIdWithFoldersIdDto;

public class UserIdWithFoldersIdFactory {


    public static UserIdWithFoldersIdDto create (String userId , String inboxId ,String sentId ,String trashId ,String draftsId ){
        UserIdWithFoldersIdDto userIdWithFoldersIdDto = new UserIdWithFoldersIdDto() ;
        userIdWithFoldersIdDto.setUserId(userId);
        userIdWithFoldersIdDto.setInboxId(inboxId);
        userIdWithFoldersIdDto.setSentId(sentId);
        userIdWithFoldersIdDto.setTrashId(trashId);
        userIdWithFoldersIdDto.setDraftsId(draftsId);
        return userIdWithFoldersIdDto;
    }
}
