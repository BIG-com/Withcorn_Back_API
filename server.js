const express = require("express");
const session = require("express-session");
const fileStore = require("session-file-store")(session);
const dotenv = require('dotenv');

// sessionConfig 경로 객체화
const sessionConfig = require('./authSession/sessionConfig');

// imapConfig 경로 객체화
const imap = require('./authSession/imapConfig');

// loginApiRouter 경로 객체화
const loginApiRouter = require('./route/loginApi_middleware');
// identifiedSessionAuthApiRouter 경로 객체화
const identifiedSessionAuthApiRouter = require('./route/identifiedSessionAuthApi_middleware');

// chatRoomListRouter 경로 객체화
const chatRoomApiRouter = require('./route/chatRoomApi_middleware');

// chatRoomListRouter 경로 객체화
const serverConnectRouter = require('./route/serverConnect_middleware');


// express 객체화
const app = express();

dotenv.config({ path: './server.env' });

//body-parser(json파일을 body에 넣어서 req.body.id 형식으로 사용가능)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 서버 연결 확인 (withcorn.store/)
app.get('/',(req,res) => {
    res.send("Right connection 200")
});

// imap 설정 적용
imap.connect();

// session 설정 적용
app.use(sessionConfig);

// router 사용 선언 
app.use('/loginApi',loginApiRouter);
// router 사용 선언 
app.use('/identifiedSessionAuthApi',identifiedSessionAuthApiRouter);
// router 사용 선언 
app.use('/chatRoomApi',chatRoomApiRouter);
// router 사용 선언 
app.use('/serverConnect',serverConnectRouter);



// 포트 6895 http 서버 신호 감지

const port = process.env.PORT;
app.listen(port);