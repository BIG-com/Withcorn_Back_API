const express = require("express");
const chatRoomApiMid = require('./controller/chatRoomApi_controller');

console.log(chatRoomApiMid.chatRoomRegister);

const router = express.Router();

// 미들웨어에 무엇이 들어가는지 종류

//채팅방 리스트
router.post('/chatRoomRegister', chatRoomApiMid.chatRoomRegister);

router.post('/loadChatRoomDataList', chatRoomApiMid.loadChatRoomDataList);

router.post('/deleteChatRoomDataList', chatRoomApiMid.deleteChatRoomDataList);

router.post('/loadAllChatMembers', chatRoomApiMid.loadAllChatMembers);

router.post('/enterChatRoomWithInviteCode', chatRoomApiMid.enterChatRoomWithInviteCode);

router.post('/chatRoomFCMAlert', chatRoomApiMid.chatRoomFCMAlert);


// 다른 파일에서 쓸 수 있도록
module.exports = router;