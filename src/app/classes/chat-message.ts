export class ChatMessage {
    authorId: string;
    authorName: string;
    receiverId: string;
    receiverName: string;
    chatMsg: string;
    chatTime: Date;

    constructor(authId: string, authName: string, receiverId : string, receiverName: string,
        chatMsg: string, chatTime : Date)
        {
            this.authorId = authId;
            this.authorName = authName;
            this.receiverId = receiverId;
            this.receiverName = receiverName;
            this.chatMsg = chatMsg;
            this.chatTime = chatTime;
        }
}
