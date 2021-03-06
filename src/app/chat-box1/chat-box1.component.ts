import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { Mentor } from '../classes/mentor';
import { ChatMessage } from '../classes/chat-message';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { AppComponent } from '../app.component';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { MentorService } from '../services/mentor.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { MentorChat } from '../classes/mentor-chat';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component1.html',
  styleUrls: ['./chat-box.component1.scss']
})
export class ChatBox1Component implements OnInit {
  // @ViewChild('mentorListNav') mentorListNav : TemplateRef <any>;
  @ViewChild('chatArea') chatArea : ElementRef;
  allMentors : MentorChat[] = [];
  allDBMentors : Mentor[] = [];
  onlineUsers : string[] = [];
  // mentorName: string = "";
  // selectedMentorId : string = "";
  selectedMentor : MentorChat = new MentorChat("",null,"","",0,"",[],[]);
  allMessages: ChatMessage[] = [];

  persConvUsers : any[] = [];
  userId = AppComponent.appUser.userId;
  profilePic =  AppComponent.appUser.profilePic;
  personalMessage : string = "";

  perMsgFrm = new FormGroup(
    {
      persMsg : new FormControl()
    }
  );

  constructor(private socket : Socket, private longinSrv : MentorService) { }

  ngOnInit(): void {

    // $(".heading-compose").click(function() {
    //   $(".side-two").css({
    //     "left": "0"
    //   });
    // });

    // $(".newMessage-back").click(function() {
    //   $(".side-two").css({
    //     "left": "-100%"
    //   });
    // });

    this.socket.once('updateOnlineUser', (onlineUsers) => {
      if(onlineUsers !== null && onlineUsers !== undefined && onlineUsers.length > 0)
      {
        for(let i = 0; i < onlineUsers.length; i++)
        {
          //userId status
          let oneUser = onlineUsers[i];
          if (oneUser.status == "online")
          {
            // let findMentor = this.allMentors.find(x => x.mentorId === oneUser.userId);
            // findMentor.userOnline = true;
            this.onlineUsers.push(oneUser.userId);
          }
        }
      }
    });
    this.loginUser(AppComponent.appUser.userId, AppComponent.appUser.userName, "");
  }
ngOnDestroy() : void {
    this.logoutUser();
  }
  updateOnlineUserListener()
  {
    
  }


  pushMentorRecords()
  {
    try 
    {
      let conv = this.socket.emit('getPersonalConversation', (convResp) =>
      {
       
        for (let i = 0; (convResp !== null && i < convResp.length); i++) {
          const element = convResp[i];
          if (element._id !== this.userId) {
            let mentorObj : MentorChat = new MentorChat(element._id, "", "", "", 0, 
            "", [], []);
            this.allMentors.push(mentorObj);

            this.longinSrv.getUserData(element._id).subscribe(response =>
              {
                if(response.statusCode == 200)
                {
                  let userData = response.content.users[0];
                  
                  // let mentorObj : Mentor = new Mentor(element._id, "", userData.fullName, userData.jobTitle, 0, 
                  // userData.jobDescription, userData.languages, userData.interestedTopics);
                  mentorObj.mentorName = userData.fullName;
                  mentorObj.jobTitle = userData.jobTitle;
                  mentorObj.jobDesc = userData.jobDescription;
                  mentorObj.langKnown = userData.languages;
                  mentorObj.topics = userData.interestedTopics;

                  if(userData.profileImage !== undefined && userData.profileImage !== "default.png")
                  {
                    this.longinSrv.getUserFile(userData.profileImage).subscribe(response => {

                      let data = response.blob.data;
                      if (response.blob.data != null)
                      {
                          mentorObj.avatarImg = this.longinSrv.convertProfilePic(response.blob.data);
                      }
                    }, (err: HttpErrorResponse) => 
                    {
                      console.log(err.message);
                    }
                    );
                  }
                  // this.allMentors.push(mentorObj);

                }
              });
  
          }
        }

        //Enroll for online-offline status of the people
        this.updateOnlineStatus();

        this.pushDBMentors();
        this.getUnreadMessages();

        // this.longinSrv.getAllMentor().subscribe(response =>
        //   {
        //     if(response.statusCode == 200)
        //     {
        //         let mentorsArr = response.content;
        //         if (mentorsArr.length > 0)
        //         {
        //           for(let i = 0; i < mentorsArr.length; i++)
        //           {
        //             let oneMentor = mentorsArr[i];
        //             if (oneMentor._id !== this.userId)
        //             {
        //               //This mentor not been added before
        //               let findMentor = this.allMentors.find(x => x.mentorId === oneMentor._id);
        //               if (findMentor === undefined)
        //               {
  
        //                 let mentorObj : MentorChat = new MentorChat(oneMentor._id, "", oneMentor.fullName, oneMentor.jobTitle, 4, oneMentor.jobDescription, 
        //                 oneMentor.languages, oneMentor.interestedTopics);
  
        //                 if(oneMentor.profileImage !== undefined && oneMentor.profileImage !== "default.png")
        //                 {
        //                   this.longinSrv.getUserFile(oneMentor.profileImage).subscribe(response => {
  
        //                     let data = response.blob.data;
        //                     if (response.blob.data != null)
        //                     {
        //                         mentorObj.avatarImg = this.longinSrv.convertProfilePic(response.blob.data);
        //                     }
        //                   }, (err: HttpErrorResponse) => 
        //                   {
        //                     console.log(err.message);
        //                   }
        //                   );
        //                 }
        //                 this.allMentors.push(mentorObj);
        //               }
        //             }
        //           }
        //         }
        //     }
        //     else
        //     {
        //       console.debug("getAllMentor returned " + response.statusCode + " status code");
        //     }

        //     this.getUnreadMessages();
      
        //   });
  
      });




    }
    catch
    {
      console.debug("ERror in loadMentorsCarousel");
    }
  }

  pushDBMentors()
  {
    this.longinSrv.getAllMentor().subscribe(response =>
      {
        if(response.statusCode == 200)
        {
            let mentorsArr = response.content;
            if (mentorsArr.length > 0)
            {
              for(let i = 0; i < mentorsArr.length; i++)
              {
                let oneMentor = mentorsArr[i];
                if (oneMentor._id !== this.userId)
                {
                  //This mentor not been added before
                  let findMentor = this.allMentors.find(x => x.mentorId === oneMentor._id);
                  if (findMentor === undefined)
                  {

                    let mentorObj : Mentor = new Mentor(oneMentor._id, "", oneMentor.fullName, oneMentor.jobTitle, 4, oneMentor.jobDescription, 
                    oneMentor.languages, oneMentor.interestedTopics);

                    // if(oneMentor.profileImage !== undefined && oneMentor.profileImage !== "default.png")
                    // {
                    //   this.longinSrv.getUserFile(oneMentor.profileImage).subscribe(response => {

                    //     let data = response.blob.data;
                    //     if (response.blob.data != null)
                    //     {
                    //         mentorObj.avatarImg = this.longinSrv.convertProfilePic(response.blob.data);
                    //     }
                    //   }, (err: HttpErrorResponse) => 
                    //   {
                    //     console.log(err.message);
                    //   }
                    //   );
                    // }
                    this.allDBMentors.push(mentorObj);
                  }
                }
              }
            }
        }
        else
        {
          console.debug("getAllMentor returned " + response.statusCode + " status code");
        }

  
      });

  }

  updateOnlineStatus()
  {
    for(let i = 0; i < this.onlineUsers.length; i++)
    {
      let findMentor = this.allMentors.find(x => x.mentorId === this.onlineUsers[i]);
      if (findMentor !== undefined)
        findMentor.userOnline = true;
    }

    this.socket.on('userOnline', (onlineUser) => {
      let findMentor = this.allMentors.find(x => x.mentorId === onlineUser);
      if (findMentor !== undefined)
      {
        findMentor.userOnline = true;
        this.onlineUsers.push(onlineUser);
      }
    });
    this.socket.on('userOffline', (offlineUser) => {
      let findMentor = this.allMentors.find(x => x.mentorId === offlineUser);
      if (findMentor !== undefined)
      {
        findMentor.userOnline = false;
        let findOnlineUser = this.onlineUsers.findIndex(x => x === offlineUser)
        this.onlineUsers.splice(findOnlineUser, 1);
      }
    });

  }

  selectedNewMentorClick(selectedMentId : string)
  {
    let findMentor = this.allMentors.find(x => x.mentorId === selectedMentId);
    if (findMentor === undefined)
    {
      this.longinSrv.getMentorData(selectedMentId).subscribe(response =>
      {
        if(response.statusCode == 200)
        {
          let userData = response.content[0];

          let mentorObj : MentorChat = new MentorChat(userData._id, "", userData.fullName, userData.jobTitle, 0, 
          userData.jobDescription, userData.languages, userData.interestedTopics);

          this.allMentors.push(mentorObj);
          this.onMentorClick(selectedMentId);

          if(userData.profileImage !== undefined && userData.profileImage !== "default.png")
          {
            this.longinSrv.getUserFile(userData.profileImage).subscribe(response => {

              let data = response.blob.data;
              if (response.blob.data != null)
              {
                  mentorObj.avatarImg = this.longinSrv.convertProfilePic(response.blob.data);
              }
            }, (err: HttpErrorResponse) => 
            {
              console.log(err.message);
            }
            );
          }

        }
      });
    }

  }

  onMentorClick(mentorId: string)
  {
    this.selectedMentor = this.allMentors.find(x => x.mentorId === mentorId);
    // this.mentorName = selectedMentor.mentorName;
    // this.selectedMentorId = selectedMentor.mentorId;

    // Get all previous messages from this mentor
    this.allMessages.splice(0, this.allMessages.length)
    this.getAllMessages(this.selectedMentor.mentorId);

    // let msg = new ChatMessage(AppComponent.appUser.userId, AppComponent.appUser.userName, selectedMentor.mentorId, selectedMentor.mentorName,
    //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consequat tellus non mauris posuere, varius efficitur lacus auctor. Fusce consequat lobortis orci, non bibendum sem commodo eu. Integer pellentesque egestas ex a eleifend. Duis facilisis lacus eu libero consectetur lacinia. Ut sapien lacus, ullamcorper nec risus quis, finibus vehicula sapien.",
    //   new Date(1920, 11, 4, 16, 25, 0));
    //this.allMessages.push(msg);
    
  }

  onMsgSendClick(data)
  {
    let msg = this.perMsgFrm.get("persMsg").value;
    this.sendPersonalMessage(this.selectedMentor.mentorId, this.userId, msg)
  }

  formatMsgTime(dt: Date)
  {
    return dt.getDate() + '/' + (dt.getMonth()+1) + ' ' + dt.getHours() + ':' + dt.getMinutes();

  }

  /* ######################################################## */
    /* To Socketing to server  */
    // public sendMessage(message) {
    //   this.socket.emit('userOnline', message);
    // }
  
    public loginUser(frmid :string, frmfirstName :string, frmlastName : string) {
      let userData = {
        _id : frmid,
        firstName : frmfirstName,
        lastName : frmlastName
      }
      let resp = this.socket.emit('login', userData, (loginResp) => 
      {
        this.userId = loginResp;

        this.pushMentorRecords();
        // this.getUnreadMessages();
        this.enrollMessages();
  
      });
    }
  
    public logoutUser() {
      this.socket.emit('disconnect');
    }
  
    public sendPersonalMessage(_sender: string, _author: string, _msg : string)
    {
      let msgData = {
        senderId : _sender,
        conversationId : _author,
        authorId : _author,
        message_body: _msg,
        message_type : 0
      }
      let resp = this.socket.emit('sendPersonalMessage', msgData, (persMsgResp) =>
      {
        let i = 0;
        this.perMsgFrm.patchValue({"persMsg": ""});
        let oneMsg : ChatMessage = new ChatMessage(this.userId, AppComponent.appUser.userName, "", "", 
          persMsgResp.message_body, new Date(persMsgResp.date));
        this.allMessages.push(oneMsg);
        setTimeout(() => {
          this.chatArea.nativeElement.scrollTop = this.chatArea.nativeElement.scrollHeight;
        }, 500);
        
      });
    }

    public getUnreadMessages()
    {
      for(let i = 0; i < this.allMentors.length; i++)
      {
        let oneMentor = this.allMentors[i];
        this.getMentorMessageData(oneMentor);
        
      }
    }
  
    public getAllMessages(oppPartyId : string)
    {
      let data =  {
        senderId: oppPartyId,
        // type: this.props.user.type, 1 - group messages
        type: 0,
        authorId: this.userId,
        message_limit: 16,
        // skip : this.state.skip
        skip: 0
      }
  
      let resp = this.socket.emit('getLastMessage', data, (getAllMsgResp) => 
      {
        //These are old messages
        if (getAllMsgResp !== null)
        {
          for(let i = 0; i < getAllMsgResp.length; i++)
          {
            let oneResp = getAllMsgResp[i];
            // let msgTime = this.formatMsgTime(new Date(oneResp.date));
            let oneMsg : ChatMessage = new ChatMessage(oneResp.author_id, oneResp.user.userName, "", "", 
              oneResp.message_body, new Date(oneResp.date))
            this.allMessages.push(oneMsg);
            
          }
          setTimeout(() => {
            this.chatArea.nativeElement.scrollTop = this.chatArea.nativeElement.scrollHeight;
          }, 500);
        }
      });
    }

    public getMentorMessageData(oneMentor : MentorChat)
    {
      let oppPartyId : string = oneMentor.mentorId;
      let data =  {
        senderId: oppPartyId,
        // type: this.props.user.type, 1 - group messages
        type: 0,
        authorId: this.userId,
        message_limit: 16,
        // skip : this.state.skip
        skip: 0
      }
  
      let resp = this.socket.emit('getLastMessage', data, (getAllMsgResp) => 
      {
        //These are old messages
        if (getAllMsgResp !== null)
        {
          //Set last message time
          oneMentor.chatTime = new Date(getAllMsgResp[getAllMsgResp.length -1].date);

          let unReadMsg : number = 0;
          let i = 0;
          for(i = getAllMsgResp.length - 1; i >= 0; i--)
          {
            let oneResp = getAllMsgResp[i];

            // let oneMsg : ChatMessage = new ChatMessage(oneResp.author_id, oneResp.user.userName, "", "", 
            //   oneResp.message_body, new Date(oneResp.date))
            if(oneResp.isSend == false)
            {
              unReadMsg++;
            }
            
          }
          oneMentor.unReadMessages = unReadMsg;
        }
      });
    }
    
  enrollMessages()
  {
      //Now enroll for real time chat messages
      this.socket.on('getMessage', (msgData) =>
      {
        let oneResp = msgData;
        // let msgTime = this.formatMsgTime(new Date(oneResp.date));
        if(this.selectedMentor !== null && this.selectedMentor.mentorId !== "")
        {
          //If this message is from the currently chatting person
          if(this.selectedMentor.mentorId == oneResp.user.userId)
          {
            let oneMsg : ChatMessage = new ChatMessage(oneResp.user.userId, oneResp.user.userName, "", "", 
              oneResp.message_body, new Date())
            this.allMessages.push(oneMsg);
            setTimeout(() => {
              this.chatArea.nativeElement.scrollTop = this.chatArea.nativeElement.scrollHeight;
            }, 500);
          }
          else
          //update time against the mentor
          {
            let reqMentor = this.allMentors.find(x => x.mentorId === oneResp.user.userId);
            reqMentor.chatTime = new Date();
          }
        }
        
      })
  }

}
