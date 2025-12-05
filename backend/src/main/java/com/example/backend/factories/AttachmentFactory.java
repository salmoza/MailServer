package com.example.backend.factories;

import com.example.backend.dtos.AttatchmentDto;
import com.example.backend.entities.Attachment;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class AttachmentFactory {
    public  Attachment toEntity(AttatchmentDto dto){
        if(dto == null){
            return null;
        }
        Attachment att = new Attachment();
        att.setFiletype(dto.getFiletype());
        att.setFilePath(dto.getFilePath());
        return att;
    }
    public AttatchmentDto toDTO(Attachment entity) {
        if (entity == null) {
            return null;
        }
        AttatchmentDto dto = new AttatchmentDto();
        dto.setId(entity.getAttachmentId());
        dto.setFiletype(entity.getFiletype());

        if (entity.getMail() != null) {
            dto.setMailId(entity.getMail().getMailId());
        }

        return dto;
    }
}
