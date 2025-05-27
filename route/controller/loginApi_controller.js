/* 
## Api 순서  ##
1. 회원가입
2. 아이디 중복 확인
3. 닉네임 중복 확인
4. 아이디 찾기
5. 비밀번호 찾기
6. 비밀번호 재설정
7. AUTO 로그인
8. 로그인
9. 회원탈퇴
10. 로그아웃
11. 아이디로 회원정보 조회
*/

const pool = require('../../dbConnect/dbPool');
const generateHashedWithcornPw = require('../../sessionId/createSessionId');
const resMessage = require('../../resMessage/loginApi_ResMessage');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* 
## 함수 기능 1 ##
 - 회원가입 요청을 받아 bcrypt를 통해 비밀번호를 해싱 후, DB에 회원 정보를 저장한다.
*/
exports.register = (req, res) => {
    const { id, pw, number_P, name, name_N, gender, birth_Y, birth_M, birth_D } = req.body;
    console.log(`${id} / ${pw} / ${number_P} / ${name} / ${name_N} / ${gender} / ${birth_Y} / ${birth_M} / ${birth_D}`);

    pool.getConnectionPool((conn) => {
        const param = [id, pw, number_P, name, name_N, gender, birth_Y, birth_M, birth_D];
        const sql = 'INSERT INTO user (id, pw, number_P, name, name_N, gender, birth_Y, birth_M, birth_D) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?)';

        bcrypt.hash(param[1], saltRounds, (error, hash) => {
            // 혹시 bcrypt.hash()에서 에러 발생하면?
            if (error) {
                console.log(error);
                res.send(resMessage.login_ResultMessage[0][0]); // "회원가입 요청 실패"
                return;
            }

            param[1] = hash;

            conn.query(sql, param, (err, results) => {
                if (err) {
                    console.log(err);
                    res.send(resMessage.login_ResultMessage[0][0]); 
                    conn.release();
                    return;
                }
                res.send(resMessage.login_ResultMessage[1][0]); // "회원가입 요청 성공"
                conn.release();
            });
        });
    });
};

/* 
## 함수 기능 2 ##
 - 아이디(id) 중복 여부를 확인한다.
*/
exports.idDuplicationConfirm = (req, res) => {
    const { id } = req.body;
    console.log(id);

    pool.getConnectionPool((conn) => {
        const param = [id];
        const sql = 'SELECT id FROM user WHERE id = ?';

        conn.query(sql, param, (err, results) => {
            if (err) {
                console.log(err);
                res.send(resMessage.login_ResultMessage[2][0]); // "id 중복 확인 고장"
                conn.release();
                return;
            }

            // 검색 결과가 없는 경우
            if (!results[0]) {
                res.send(resMessage.login_ResultMessage[3][0]); // "id가 중복되지 않음"
                conn.release();
                return;
            }

            // 검색 결과가 있는 경우
            res.send(resMessage.login_ResultMessage[4][0]); // "id가 중복됨"
            conn.release();
        });
    });
};

/* 
## 함수 기능 3 ##
 - 닉네임(name_N) 중복 여부를 확인한다.
*/
exports.name_NDuplicationConfirm = (req, res) => {
    const { name_N } = req.body;
    console.log(name_N);

    pool.getConnectionPool((conn) => {
        const param = [name_N];
        const sql = 'SELECT name_N FROM user WHERE name_N = ?';

        conn.query(sql, param, (err, results) => {
            if (err) {
                console.log(err);
                res.send(resMessage.login_ResultMessage[5][0]); // "name_N 중복 확인 고장"
                conn.release();
                return;
            }

            if (!results[0]) {
                res.send(resMessage.login_ResultMessage[6][0]); // "name_N이 중복되지 않음"
                conn.release();
                return;
            }

            res.send(resMessage.login_ResultMessage[7][0]); // "name_N이 중복됨"
            conn.release();
        });
    });
};

/* 
## 함수 기능 4 ##
 - 사용자의 이름과 전화번호(number_P)를 통해 아이디(id)를 찾는다.
*/
exports.findId = (req, res) => {
    const { name, number_P } = req.body;
    console.log(`${name} / ${number_P}`);

    pool.getConnectionPool((conn) => {
        const param = [name, number_P];
        const sql = 'SELECT id FROM user WHERE name = ? AND number_P = ?';

        conn.query(sql, param, (err, results) => {
            if (err) {
                console.log(err);
                res.send(resMessage.login_ResultMessage[8][0]); // "id 반환 고장"
                conn.release();
                return;
            }

            if (!results[0]) {
                res.send(resMessage.login_ResultMessage[9][0]); // "일치하는 ID가 없습니다."
                conn.release();
                return;
            }

            const foundId = Object.values(results[0]);
            console.log(foundId);

            const successMsg = {
                success: true,
                message: `${foundId}`
            };

            res.send(successMsg); // return id
            conn.release();
        });
    });
};

/* 
## 함수 기능 5 ##
 - 아이디(id)와 전화번호(number_P)를 통해 비밀번호가 존재하는지 확인한다.
*/
exports.findPw = (req, res) => {
    const { id, number_P } = req.body;
    console.log(`${id} / ${number_P}`);

    pool.getConnectionPool((conn) => {
        const param = [id, number_P];
        const sql = 'SELECT pw FROM user WHERE id = ? AND number_P = ?';

        conn.query(sql, param, (err, results) => {
            if (err) {
                console.log(err);
                res.send(resMessage.login_ResultMessage[10][0]); // "findPw 쿼리문 고장"
                conn.release();
                return;
            }

            if (results[0]) {
                res.send(resMessage.login_ResultMessage[11][0]); // "일치하는 Pw가 있습니다."
                conn.release();
                return;
            }

            res.send(resMessage.login_ResultMessage[12][0]); // "일치하는 Pw가 없습니다."
            conn.release();
        });
    });
};

/* 
## 함수 기능 6 ##
 - 비밀번호 재설정을 위한 API로, 기존 비밀번호 해시와 비교 후 달라야 새 비밀번호로 업데이트한다.
*/
exports.resetPw = (req, res) => {
    const { pw, number_P } = req.body;
    console.log(`${pw} / ${number_P}`);

    pool.getConnectionPool((conn) => {
        const param = [number_P];
        const sql = 'SELECT pw FROM user WHERE number_P = ?';

        // 1) 기존 비밀번호 해시 가져오기
        conn.query(sql, param, async (err, hashedPw) => {
            if (err) {
                console.log(err);
                res.send(resMessage.login_ResultMessage[13][0]); // "resetPw 쿼리 고장"
                conn.release();
                return;
            }

            // 2) 입력한 비밀번호와 기존 해시 비교
            const duplicationCheckBooleon = await bcrypt.compare(pw, hashedPw[0].pw);

            // 3) 같지 않으면 → 새 비밀번호로 업데이트
            if (!duplicationCheckBooleon) {
                const updateParam = [pw, number_P];
                const updateSql = 'UPDATE user SET pw = ? WHERE number_P = ?';

                // 새 비밀번호 해시
                bcrypt.hash(updateParam[0], saltRounds, (error, hash) => {
                    if (error) {
                        console.log(error);
                        res.send(resMessage.login_ResultMessage[14][0]); // "업데이트 고장"
                        conn.release();
                        return;
                    }

                    updateParam[0] = hash;

                    // DB 업데이트
                    conn.query(updateSql, updateParam, (err2, updateResult) => {
                        if (err2) {
                            console.log(err2);
                            res.send(resMessage.login_ResultMessage[14][0]);
                            conn.release();
                            return;
                        }

                        res.send(resMessage.login_ResultMessage[15][0]); // "비밀번호가 재설정되었습니다."
                        conn.release();
                    });
                });
            } else {
                // 3-1) 기존 해시와 같으면 → 그냥 종료
                res.send(resMessage.login_ResultMessage[16][0]); // "hashedPw가 pw와 일치합니다."
                conn.release();
            }
        });
    });
};

/* 
## 함수 기능 7 ##
 - 클라이언트에서 전달된 session_ID를 통해 자동 로그인을 처리한다.
*/
exports.autoLogin = (req, res) => {
    const { session_ID } = req.body;
    console.log(session_ID);

    pool.getConnectionPool((conn) => {
        const param = [session_ID];
        const sql = 'SELECT id FROM session WHERE session_ID = ?';

        conn.query(sql, param, async (err, dbId) => {
            if (err) {
                console.log(err);
                res.send(resMessage.login_ResultMessage[17][0]); // "dbSessionId 고장"
                conn.release();
                return;
            }

            if (dbId[0]) {
                const foundId = Object.values(dbId[0]);
                console.log(`id : ${foundId}`);

                const successMsg = {
                    success: true,
                    message: `${foundId}`
                };

                res.send(successMsg); // "자동 로그인 성공"
                conn.release();
                return;
            }

            res.send(resMessage.login_ResultMessage[23][0]); // "자동 로그인 실패"
            conn.release();
        });
    });
};

/* 
## 함수 기능 8 ##
 - 로그인 요청을 받아 bcrypt로 비밀번호를 확인 후, 로그인 성공 시 세션(session_ID)을 발급한다.
*/
exports.login = (req, res) => {
    const { id, pw } = req.body;
    console.log(`${id} / ${pw}`);

    pool.getConnectionPool((conn) => {
        const idToDBPwParam = [id];
        const sql = 'SELECT pw FROM user WHERE id = ?';

        // 1) DB에서 기존 비밀번호 해시 가져옴
        conn.query(sql, idToDBPwParam, async (err, hashedPw) => {
            if (err) {
                console.log(err);
                res.send(resMessage.login_ResultMessage[19][0]); // "hashedPw 쿼리 고장"
                conn.release();
                return;
            }

            // 2) 아이디가 없는 경우
            if (!hashedPw[0]) {
                res.send(resMessage.login_ResultMessage[20][0]); // "아이디가 일치하지 않습니다."
                conn.release();
                return;
            }

            // 3) 비밀번호 일치하는지 확인
            const duplicationCheckBooleon = await bcrypt.compare(pw, hashedPw[0].pw);
            if (!duplicationCheckBooleon) {
                res.send(resMessage.login_ResultMessage[21][0]); // "비밀번호가 일치하지 않습니다."
                conn.release();
                return;
            }

            // 4) 로그인 성공 → 세션 발급
            const sId = await generateHashedWithcornPw();
            const sessionIdParam = [id, sId];
            const insertSql = 'INSERT INTO session (id, session_ID) VALUE (?, ?)';

            conn.query(insertSql, sessionIdParam, async (err2, sessionResult) => {
                if (err2) {
                    console.log(err2);
                    res.send(resMessage.login_ResultMessage[22][0]); // "sessionIdToDB 고장"
                    conn.release();
                    return;
                }

                const successMsg = {
                    success: true,
                    message: `${sId}`
                };

                res.send(successMsg);
                conn.release();
            });
        });
    });
};

/* 
## 함수 기능 9 ##
 - 회원탈퇴 요청을 받아 DB에서 해당 사용자 정보를 삭제한다.
*/
exports.resign = (req, res) => {
    const { id } = req.body;
    console.log(id);

    pool.getConnectionPool((conn) => {
        const param = [id];
        const sql = 'DELETE FROM user WHERE id = ?';

        conn.query(sql, param, async (err, results) => {
            if (err) {
                console.log(err);
                res.send(resMessage.login_ResultMessage[24][0]); // 회원탈퇴 실패
                conn.release();
                return;
            }

            res.send(resMessage.login_ResultMessage[25][0]); // 회원탈퇴 성공
            conn.release();
        });
    });
};

/* 
## 함수 기능 10 ##
 - 로그아웃 요청을 받아 DB의 session 테이블에서 해당 사용자의 세션 정보를 삭제한다.
*/
exports.logout = (req, res) => {
    const { id } = req.body;
    console.log(id);

    pool.getConnectionPool((conn) => {
        const param = [id];
        const sql = 'DELETE FROM session WHERE id = ?';

        conn.query(sql, param, async (err, results) => {
            if (err) {
                console.log(err);
                res.send(resMessage.login_ResultMessage[26][0]); // 로그아웃 실패
                conn.release();
                return;
            }

            res.send(resMessage.login_ResultMessage[27][0]); // 로그아웃 성공
            conn.release();
        });
    });
};

/* 
## 함수 기능 11 ##
 - 아이디(id)로 회원 정보를 조회하여 결과를 반환한다.
*/
exports.memberInfoInquiry = (req, res) => {
    const { id } = req.body;
    console.log("아이디이거ㅓㅓㅓ : " + id);

    pool.getConnectionPool((conn) => {
        const param = [id];
        const sql = 'SELECT id, number_P, name, name_N, gender, birth_Y, birth_M, birth_D FROM user WHERE id = ?';

        conn.query(sql, param, (err, results) => {
            if (err) {
                console.log(err);
                res.send(resMessage.login_ResultMessage[28][0]); // "회원조회 고장"
                conn.release();
                return;
            }

            // 검색 결과가 없는 경우
            if (!results) {
                res.send(resMessage.login_ResultMessage[29][0]); // "해당 id의 회원정보가 없음"
                conn.release();
                return;
            }

            // 검색 결과가 있는 경우
            res.json({
                success: true,
                data: results
            });

            conn.release();
        });
    });
};
