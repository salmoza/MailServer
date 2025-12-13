export interface ContactDto {
    contactId?: string;
    ownerId?: string;
    name: string;
    emailAddresses: string[];
    starred: boolean;
    phoneNumber?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}