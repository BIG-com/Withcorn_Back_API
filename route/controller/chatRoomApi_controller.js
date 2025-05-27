const pool = require('../../dbConnect/dbPool');
const resMessage = require('../../resMessage/chatRoomApi_ResMessage');

/* 
## 함수 기능 1 ##
 - chatRoomRegister:
   클라이언트에서 받은 채팅방 정보를 DB(chatRooms 테이블)에 등록한다.
   만약 name_N에 해당하는 유저가 존재하지 않으면 에러 메시지를 보낸다.
*/
exports.chatRoomRegister = (req,res) => {

    var{roomMaster_N, roomID, name_N, id, chatRoomName, restaurantName, restaurantAddress, restaurantPhone, roomMaxMember, meetingDate, meetingTime} = req.body;

    console.log(roomMaster_N + " / " + roomID +" / "+ name_N +" / "+ id +" / "+ chatRoomName + " / " + restaurantName + " / " + restaurantAddress  + " / "  + restaurantPhone + " / " + roomMaxMember + " / " + meetingDate + " / " + meetingTime);

    pool.getConnectionPool((conn) => {
        const sql = `INSERT INTO chatRooms (roomMaster_N, roomID, name_N, id, chatRoomName, restaurantName, restaurantAddress, restaurantPhone, roomMaxMember, meetingDate, meetingTime, FCMAlert) SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1 WHERE EXISTS (SELECT 1 FROM user WHERE name_N = ?);`;

        const params = [roomMaster_N, roomID, name_N, id, chatRoomName, restaurantName, restaurantAddress, restaurantPhone, roomMaxMember, meetingDate, meetingTime, name_N];

        conn.query(sql, params, (err, results) => {
            if (err) {
                console.error("[DB Insert Error]:", err);
                console.log("해당 유저(name_N)가 존재하지 않습니다.")
                res.send(resMessage.chatRoom_ResultMessage[0][0]); // "해당 유저(name_N)가 존재하지 않습니다."
            } else {
                console.log("채팅방 리스트와 채팅멤버 데이터를 데이터 베이스에 저장을 성공하였습니다.")
                res.send(resMessage.chatRoom_ResultMessage[1][0]); // "채팅방 리스트와 채팅멤버 데이터를 데이터 베이스에 저장을 성공하였습니다."
            }
            conn.release();
        });
    });
}

/* 
## 함수 기능 2 ##
 - loadChatRoomDataList:
   특정 유저(name_N)가 소속된 채팅방 목록을 불러오고, 
   최근 메시지 시간(recent_Message_Time)을 기준으로 내림차순 정렬하여 반환한다.
*/
exports.loadChatRoomDataList = (req,res) => {

    var{name_N} = req.body;

    console.log(name_N);

    pool.getConnectionPool((conn)=>{
    
        const param = [name_N];
        const sql = 'SELECT * FROM chatRooms WHERE name_N = ? ORDER BY recent_Message_Time DESC';

        conn.query(sql, param, (err,results) => {

            if(err) {
                console.log(err);
                res.send(resMessage.chatRoom_ResultMessage[2][0]); // "채팅방 데이터를 데이터 베이스에서 검색을 실패하였습니다."
            }

            const successMsg = {
                success : true,
                data : results
            }
            
            res.send(successMsg); // return results

        });
        conn.release();
    });
}

/* 
## 함수 기능 3 ##
 - deleteChatRoomDataList:
   특정 유저(name_N)와 roomID가 일치하는 채팅방을 DB에서 삭제한다.
*/
exports.deleteChatRoomDataList = (req,res) => {

    var{name_N, roomID} = req.body;

    console.log(name_N, roomID);

    pool.getConnectionPool((conn)=>{
    
        const param = [name_N, roomID];
        const sql = 'DELETE FROM chatRooms WHERE name_N = ? AND roomID = ?;';

        conn.query(sql, param, (err,results) => {

            if(err) {
                console.log(err);
                res.send(resMessage.chatRoom_ResultMessage[3][0]); // "닉네임, 룸ID와 일치하는 채팅방 삭제에 실패하였습니다."
            }

            res.send(resMessage.chatRoom_ResultMessage[4][0]); // "닉네임, 룸ID와 일치하는 채팅방 삭제에 성공하였습니다."

        });
        conn.release();
    });
}

/* 
## 함수 기능 4 ##
 - loadAllChatMembers:
   특정 방(roomID)에 속한 모든 멤버의 닉네임(name_N)을 조회해 반환한다.
*/
exports.loadAllChatMembers = (req,res) => {

    var {roomID} = req.body;

    console.log("roomID : " + roomID);

    pool.getConnectionPool((conn)=>{
    
        const param = [roomID];
        const sql = 'SELECT name_N FROM chatRoomMembers WHERE roomID = ?;';

        conn.query(sql, param, (err,results) => {

            if(err) {
                console.log(err);
                return;
            }

            // 결과가 없을 경우 빈 배열로 처리
            const name_N_list = results.map(row => ({name_N: row.name_N}));

            const successMsg = {
                success: true,
                data: name_N_list // ✅ 객체 배열로 보냄
            };

            console.log("위 : " + successMsg);
            res.send(successMsg); // return name_N
            console.log("아래 : " + successMsg);

        });
        conn.release();
    });
}

/* 
## 함수 기능 5 ##
 - enterChatRoomWithInviteCode:
   채팅 룸 코드를 이용 하여 채팅방 리스트에 등록하는 기능 (name_N, id)
*/
exports.enterChatRoomWithInviteCode = (req,res) => {

    var{name_N, roomID, id} = req.body;

    console.log(name_N, roomID, id);

    pool.getConnectionPool((conn)=>{
    
        const param = [name_N, id, roomID];
        const sql = `
        INSERT INTO chatRooms (
            roomMaster_N, name_N, id, chatRoomName,
            restaurantName, restaurantAddress, restaurantPhone,
            roomMaxMember, meetingDate, meetingTime, FCMAlert
        )
        SELECT 
            roomMaster_N, ?, ?, chatRoomName,
            restaurantName, restaurantAddress, restaurantPhone,
            roomMaxMember, meetingDate, meetingTime, true
        FROM chatRooms
        WHERE roomID = ?
    `;

        conn.query(sql, param, (err,results) => {

            if(err) {
                console.log(err);
                res.send(resMessage.chatRoom_ResultMessage[5][0]); // "채팅방 진입 성공."
            }

            res.send(resMessage.chatRoom_ResultMessage[6][0]); // "채팅방 진입 실패."

        });
        conn.release();
    });
}

exports.chatRoomFCMAlert = (req,res) => {

    var{roomID, name_N, FCMAlert} = req.body;

    console.log(roomID +" / "+ name_N +" / 알람 : " + FCMAlert);

    pool.getConnectionPool((conn) => {

        const sql = `UPDATE chatRooms SET FCMAlert = ? WHERE name_N = ? AND roomID = ?`;

        const params = [FCMAlert, name_N, roomID];

        conn.query(sql, params, (err, results) => {
            if (err) {
                console.error("[DB Insert Error]:", err);
                console.log("채팅방 알람 업데이트 실패.")
                res.send(resMessage.chatRoom_ResultMessage[7][0]); // "채팅방 알람 업데이트 실패."
            } else {
                console.log("채팅방 알람을 업데이트 했습니다.")
                res.send(resMessage.chatRoom_ResultMessage[8][0]); // "채팅방 알람을 업데이트 했습니다."
            }
            conn.release();
        });
    });
}


