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
  receiverDisplayNames: string[];
  attachments:attachment[];
}
export interface attachment{
  id: string;
  fileName: string;
  filetype: string;
  fileSize:number;
  attachmentId:string;
}
export interface CustomFolderData{
  folderId:string;
  folderName:string;
  User:string;
  mails:Datafile[]
}
