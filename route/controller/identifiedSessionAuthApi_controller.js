const pool = require('../../dbConnect/dbPool');
const generateHashedWithcornPw = require('../../sessionId/createSessionId');
const userverifyOnEmailCheack = require('../../authSession/verifyOnEmail');
const resMessage = require('../../resMessage/identifiedSessionAuthApi_ResMessage');

/*
## 함수 기능 1 ##
 - 휴대폰 인증에 사용할 인증 세션(identifiedSessionId)을 생성하고, DB에 저장한다.
*/
exports.createIdentifiedSessionId = async(req,res) => {

    const identifiedSessionId = await generateHashedWithcornPw();

    const nowDate = Number(new Date());

    console.log(identifiedSessionId + " / " + nowDate);

    pool.getConnectionPool((conn) => {

        const param = [ identifiedSessionId, nowDate];

        const sql = 'INSERT INTO identifiedSession (identifiedSessionId, date) VALUES (?, ?)';

        conn.query(sql, param, async (err,results) => {
            if(err) {
                console.log(err);
                res.send(resMessage.identifiedSessionAuth_ResultMessage[0][0]);
            }
            req.session.randomString = identifiedSessionId;
            res.json({identifiedSessionId});
        });
        conn.release();
    });
}

/*
## 함수 기능 2 ##
 - 사용자가 보낸 인증 세션(identifiedSessionId)이 실제로 존재하고, 
   제한 시간(10분) 이내인지 확인한 뒤 인증 완료 처리한다.
*/
exports.phoneNumberVerify = (req,res) => {

    req.session.randomString = Object.values(req.body)[0]
    console.log("Stringify req.session.randomString : " + req.session.randomString)

    if (!req.session.randomString) {
        console.log("not recived req")
        return res.status(401);
    }

    pool.getConnectionPool((conn) => {

        const param = [ req.session.randomString, Number(new Date()) - 10 * 60 * 1000];

        const sql = 'SELECT * FROM identifiedSession WHERE identifiedSessionId = ? AND date > ? ORDER BY date DESC LIMIT 1;';

        conn.query(sql, param, async (err,results) => {
            if(err) {
                console.log(err); 
                res.send(resMessage.identifiedSessionAuth_ResultMessage[0][0]);
            }
            else if (results.length == 0) {
                console.log("DB에서 identifiedSessionId를 찾을 수 없습니다.");
                return res.send(resMessage.identifiedSessionAuth_ResultMessage[1][0]); // return timeout
            }
            userverifyOnEmailCheack(results[0].identifiedSessionId).then((phoneNumber) => {
                // 발신자 번호 특정 완료
                console.log(phoneNumber);

                const successMsg = {
                    success : true,
                    message : `${ phoneNumber }`
                }

                res.send(successMsg);
            
            }).catch((error) => {
                console.log(error);
                return res.send(resMessage.identifiedSessionAuth_ResultMessage[1][0]);
            });
        });
        conn.release();
    });
}
