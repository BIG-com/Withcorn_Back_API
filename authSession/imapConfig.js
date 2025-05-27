const Imap = require('imap');

const imap = new Imap({
    user: "page961112@gmail.com", // 서비스에 맞게 변경
    password: "hmuakyyappfetrxd", // 서비스에 맞게 변경
    host: "imap.gmail.com", // 서비스에 맞게 변경
    port: 993, // 서비스에 맞게 변경
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false  // 인증서 검증을 무시합니다.
    }
});

imap.once("ready", function () {
    console.log("imap ready");
});

imap.once('error', function(err) {
    console.error('IMAP 연결 에러:', err);
});

imap.once('end', function() {
    console.log('IMAP 연결 종료');
});

module.exports = imap;


//이메일에서 휴대폰 번호 가져오기, verification 작성
