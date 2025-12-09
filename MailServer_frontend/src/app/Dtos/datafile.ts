export interface Datafile{
  attachmentMetadata:attachment[];
  body:string;
  date:string;
  deletedAt:string;
  isRead:boolean;
  mailId:string;
  priority:number;
  receiverEmails:string[];
  senderEmail:string;
  userId:string;
  subject:string;
}
interface attachment{
  fileName: string;
  fileType: string;
  fileSize:string;
  attachmentId:string;
}
