export interface Datafile{
  receiverEmails: string[];
  attachmentMetadata:attachment[];
  body:string;
  date:string;
  deletedAt:string;
  isRead:boolean;
  mailId:string;
  priority:number;
  receivers:string[];
  sender:string;
  userId:string;
  subject:string;
  senderDisplayName:string;
  attachments:attachment[];
}
export interface attachment{
  fileName: string;
  filetype: string;
  fileSize:string;
  attachmentId:string;
}
export interface CustomFolderData{
  folderId:string;
  folderName:string;
  User:string;
  mails:Datafile[]
}
