package com.example.backend.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

import java.util.*;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String mailId;
    private String userId;
    @Builder.Default
    private List<String> receiverEmails  = new ArrayList<>();
    private String senderEmail;
    private int priority;
    private String subject;
    private String body;
    private Timestamp deletedAt;
    @OneToMany(mappedBy = "mail", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Attachment> attachments;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    public Timestamp date;

    @ManyToMany(mappedBy = "mails")
    @JsonIgnore
    @Builder.Default
    private Set<Folder> folders = new HashSet<>() ;

     // public String state;

    public Boolean isRead;
    @JsonProperty("attachmentMetadata")
    public List<Map<String, String>> getAttachmentMetadata() {
        if (this.attachments == null || this.attachments.isEmpty()) {
            return Collections.emptyList();
        }

        // Stream the full Attachment entities and map them to a simple list of required data.
        return this.attachments.stream()
                .map(att -> Map.of(
                        "attachmentId", att.getAttachmentId(),
                        "fileName", att.getFilename(),
                        "fileSize", String.valueOf(att.getFilesize()),
                        "fileType", att.getFiletype()
                ))
                .collect(Collectors.toList());
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Mail mail = (Mail) o;
        return Objects.equals(mailId, mail.mailId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(mailId);
    }
}
