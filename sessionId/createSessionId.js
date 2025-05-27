const crypto = require('crypto');

const withcornPw = "https://withcorn.store/";

/* 
## 함수 기능 1 ##
 - randomBytes를 통해 랜덤한 64바이트 버퍼를 생성하고 base64로 인코딩하여 소금을 반환한다.
*/
const createSalt = () => new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
        if (err) reject(err);
        resolve(buf.toString('base64'));
    });
});

/* 
## 함수 기능 2 ##
 - 평문 비밀번호를 받아 createSalt 함수로 소금을 생성한 뒤, PBKDF2를 사용하여 해시된 비밀번호를 생성해 반환한다.
*/
const createHashedPassword = (plainPassword) => new Promise(async (resolve, reject) => {
    const salt = await createSalt(); // 소금 만들어서 대입
    crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
        if (err) reject(err);
        resolve(key.toString('base64'));
    });
}); 

/* 
## 함수 기능 3 ##
 - 상수 withcornPw를 해싱한 결과를 반환한다.
*/
const generateHashedWithcornPw = async () => {
    return await createHashedPassword(withcornPw);
};

// => 최종적으로 암호화된 비밀번호화 / 소금을 반환한다.
// 소금도 반환하는 이유는, 각 유저의 비밀번호 암호화하는데 사용된 소금 종류가 다르기 때문에, 각 유저마다 소금을 가지고있어야 비교가 가능하다.
 
module.exports = generateHashedWithcornPw;
