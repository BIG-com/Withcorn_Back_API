const express = require("express");
const serverConnectMid = require('./controller/serverConnect_controller');

const router = express.Router();

// 미들웨어에 무엇이 들어가는지 종류

//FCM 토큰 저장
router.post('/saveFCMToken', serverConnectMid.saveFCMToken);


//채팅 메세지 저장
router.post('/saveMessage', serverConnectMid.saveMessage);


// 다른 파일에서 쓸 수 있도록
module.exports = router;