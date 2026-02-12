package com.example.backend.services.filter;

import com.example.backend.model.MailFilter;

public class CriteriaFactory {

    public static MailCriteria from(MailFilter filter) {
        switch (filter.getField().toLowerCase()) {
            case "sender":
                return new SenderCriteria(filter.getFilterValue());

            case "subject":
                return new SubjectCriteria(filter.getFilterValue());

            case "body":
                return new BodyCriteria(filter.getFilterValue());

            default:
                throw new IllegalArgumentException("Unsupported filter field");
        }
    }
}

