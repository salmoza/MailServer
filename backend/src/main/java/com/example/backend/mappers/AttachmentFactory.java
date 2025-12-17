package com.example.backend.mappers;

import com.example.backend.dtos.AttachmentDto;
import com.example.backend.model.Attachment;
import org.springframework.stereotype.Component;

@Component
public class AttachmentFactory {
    /*public  Attachment toEntity(AttachmentDto dto){
        if(dto == null){
            return null;
        }
        Attachment att = new Attachment();
        att.setFiletype(dto.getFiletype());
        att.setFilePath(dto.getFilePath());
        return att;
    }*/
    public AttachmentDto toDTO(Attachment entity) {
        if (entity == null) {
            return null;
        }
        AttachmentDto dto = new AttachmentDto();
        dto.setId(entity.getAttachmentId());
        dto.setFiletype(entity.getFiletype());
        dto.setFileName(entity.getFilename());
        dto.setFileSize(entity.getFilesize());

        if (entity.getMail() != null) {
            dto.setMailId(entity.getMail().getMailId());
        }

        return dto;
    }
}
