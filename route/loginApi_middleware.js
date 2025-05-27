const express = require("express");
const loginApiMid = require('./controller/loginApi_controller');



console.log(loginApiMid.register)

const router = express.Router();

// 미들웨어에 무엇이 들어가는지 종류
router.post('/register',loginApiMid.register);

router.post('/idDuplicationConfirm',loginApiMid.idDuplicationConfirm);

router.post('/name_NDuplicationConfirm',loginApiMid.name_NDuplicationConfirm);

router.post('/findId',loginApiMid.findId);

router.post('/findPw',loginApiMid.findPw);

router.post('/resetPw',loginApiMid.resetPw);

router.post('/autoLogin',loginApiMid.autoLogin);

router.post('/login',loginApiMid.login);

router.post('/resign',loginApiMid.resign);

router.post('/logout',loginApiMid.logout);

router.post('/memberInfoInquiry',loginApiMid.memberInfoInquiry);


// 다른 파일에서 쓸 수 있도록
module.exports = router;
