/* 
## 서버 코드 설명 ##
 - DB 접속을 위한 pool, 메시지 응답 메시지, FCM(Push 알림) 사용을 위한 firebase_admin을 불러온다.
 - 사용자 FCM 토큰 저장 기능과, 채팅 메시지 저장 및 오프라인 사용자 푸시 알림 기능을 제공한다.
*/
const pool = require('../../dbConnect/dbPool');
const resMessage = require('../../resMessage/serverConnect_ResMessage');
const admin = require('../../firebase_admin/firebase'); // firebase-admin 초기화

/* 
## 함수 기능 1 ##
 - 사용자 이름(name_N)을 기준으로 DB에 FCM 토큰(fcm_token)을 저장한다.
*/
exports.saveFCMToken = (req, res) => {
    const { name_N, fcm_token } = req.body;
    console.log(name_N + " / " + fcm_token );

    pool.getConnectionPool((conn) => {
        const sql = `UPDATE user SET fcm_token = ? WHERE name_N = ?;`;
        const params = [fcm_token, name_N];

        conn.query(sql, params, (err, results) => {
            if (err) {
                console.error("[DB Insert Error]:", err);
                console.log("FCM 토큰 저장에 실패하였습니다.");
                res.send(resMessage.serverConnect_ResultMessage[2][0]); 
            } else {
                console.log("FCM 토큰 저장에 성공하였습니다." + "/" + name_N + "/" + fcm_token);
                res.send(resMessage.serverConnect_ResultMessage[3][0]); 
            }
            conn.release();
        });
    });
};

/* 
## 함수 기능 2 ##
 - 채팅 메시지를 DB(message 테이블)에 저장하고, 
   해당 방(roomId)에 속하면서 오프라인 상태인 사용자들에게 FCM 푸시 알림을 전송한다.
*/
exports.saveMessage = (req, res) => {
    const { username, roomId, message, chatRoomName, onlineUsers = [] } = req.body;
    console.log(username + " / " + roomId + " / " + message + " / " + chatRoomName);

    pool.getConnectionPool((conn) => {
        const sql = `INSERT INTO message (name_N, roomID, message_TEXT) VALUES (?, ?, ?);`;
        const params = [username, roomId, message];

        conn.query(sql, params, (err, results) => {
            if (err) {
                console.error("[DB Insert Error]:", err);
                console.log("메세지가 저장에 실패하였습니다.");
                res.send(resMessage.serverConnect_ResultMessage[0][0]); 
            } else {
                console.log("메세지 저장에 성공하였습니다.");

                // 오프라인 사용자 조회
                const selectSQL = `
                    SELECT 
                        u.name_N, 
                        u.fcm_token,
                        r.chatRoomName
                    FROM chatRoomMembers c 
                    JOIN user u ON c.name_N = u.name_N 
                    JOIN chatRooms r ON c.roomID = r.roomID
                    WHERE c.roomID = ? 
                    AND c.name_N != ?
                `;
                conn.query(selectSQL, [roomId, username], async (err2, rows) => {
                    if (err2) {
                        console.error("[DB Select Error]:", err2);
                        // 저장 자체는 성공했지만 푸시 알림은 실패한 상태
                        res.send(resMessage.serverConnect_ResultMessage[1][0]); 
                        conn.release();
                        return; 
                    }

                    // 오프라인 사용자만 필터링
                    const offlineUsers = rows.filter(user => !onlineUsers.includes(user.name_N));
                    const tokens = offlineUsers.map(u => u.fcm_token);

                    // 쿼리 결과에서 chatRoomName 가져오기 (첫 번째 행의 chatRoomName 사용)
                    const roomName = rows.length > 0 ? rows[0].chatRoomName : chatRoomName;


                    console.log("offlineUsers Token : " + tokens);

                    if (tokens.length === 0) {
                        console.log("📭 오프라인 사용자 없음. 푸시 생략");
                        res.send(resMessage.serverConnect_ResultMessage[4][0]); 
                        conn.release();
                        return; 
                    }

                    // FCM 메시지 구성
                    const fcmMessage = {
                        notification: {
                            title: `${roomName}`,
                            body: `${username}님의 메시지를 보냈습니다`,
                        },
                        data: {
                            roomId,
                            sender: username,
                        },
                        tokens
                    };

                    try {
                        const response = await admin.messaging().sendEachForMulticast(fcmMessage);
                        console.log(`📨 FCM 푸시 전송 완료: ${response.successCount}건`);
                        res.send(resMessage.serverConnect_ResultMessage[5][0]); 
                    } catch (pushErr) {
                        console.error("[FCM Error]:", pushErr);
                        res.send(resMessage.serverConnect_ResultMessage[6][0]); 
                    }
                    conn.release();
                });
            }
        });
    });
};
