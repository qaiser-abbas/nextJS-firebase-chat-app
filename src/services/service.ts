import AuthService from "./auth/authService";
import ChatService from "./chat/chatService";
import FcmService from "./pushNotification/fcmService";

const Api = {
  auth: {
    registerUser: AuthService.registerUser,
    loginUser: AuthService.loginUser,
    logoutUser: AuthService.logoutUser,
    getCurrentUserData: AuthService.getCurrentUserData,
    getAllUsers: AuthService.getAllUsers,
  },
  Chat: {
    sendMessage: ChatService.sendMessage,
    editMessage: ChatService.editMessage,
    deleteMessage: ChatService.deleteMessage,
    getChatId: ChatService.getChatId,
    listenToMessages: ChatService.listenToMessages,
    getUserChats: ChatService.getUserChats,
    markMessagesAsRead: ChatService.markMessagesAsRead,
  },
  PushNoti: {
    triggerPush: FcmService.triggerPush,
    saveTokenInUserDoc: FcmService.saveTokenInUserDoc,
  },
};
export { Api };
