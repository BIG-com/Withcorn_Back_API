/* 
## 함수 기능 1 ##
 - userVerifyOnEmail:
   IMAP 서버의 "INBOX" 메일박스에서 특정 문자열(verify_body)이 메일 본문에 포함된 이메일을 검색하고,
   검색된 메일의 "From" 헤더값을 파싱하여 발신자 번호(fromPhone)와 도메인을 확인한다.
   허용된 도메인(vmms.nate.com, ktfmms.magicn.com, lguplus.com)이 아니면 에러를 반환하고,
   올바른 도메인일 경우 해당 발신 번호를 resolve()로 반환한다.
*/
const imap = require('../authSession/imapConfig'); // IMAP 설정 불러오기

const userVerifyOnEmail = (verify_body) => {
    /* 
    ## 함수 내부 설명 ##
    - Promise를 반환한다. 
    - openBox("INBOX")를 통해 메일박스를 열고, imap.search()로 verify_body가 본문에 포함된 메일을 검색한다.
    - 검색 결과가 없으면 reject("No matching emails...")로 처리한다.
    - 검색 결과가 있으면 fetch()로 이메일 헤더를 가져오고, "From" 헤더를 정규식으로 분석해 발신 번호와 도메인을 추출한다.
    - 허용되지 않은 도메인이면 reject("Invalid domain") 처리한다.
    - 모든 과정이 정상적으로 끝나면 발신 번호(fromPhone)를 resolve()한다.
    */
    return new Promise((resolve, reject) => {
        // 1) INBOX 열기 (읽기 전용)
        imap.openBox("INBOX", true, (err, box) => {
            if (err) {
                console.error("Error opening mailbox:", err);
                return reject(err);
            }

            // 2) 메일 검색: BODY에 verify_body가 포함된 메일 탐색
            imap.search(["ALL", ["BODY", verify_body]], (err, results) => {
                console.log(results);
                if (err) {
                    console.error("Search error:", err);
                    return reject(err);
                }
                // 2-1) 검색된 결과가 없으면 에러 처리
                if (results.length === 0) {
                    console.error("No matching emails found with body.");
                    return reject("No matching emails found with body.");
                }

                // 3) 검색된 메일을 Fetch: 헤더의 FROM 필드를 가져온다
                let f = imap.fetch(results, { bodies: "HEADER.FIELDS (FROM)" });
                
                // 3-1) 메일을 순회하며 처리
                f.on("message", (msg, seqno) => {
                    let buffer = "";

                    // 3-2) 메일의 body(헤더 내용)을 받음
                    msg.on("body", (stream, info) => {
                        stream.on("data", (chunk) => {
                            buffer += chunk.toString("utf8");
                        });

                        // 3-3) body 데이터 수신이 끝나면 'From' 헤더 파싱
                        stream.once("end", () => {
                            const fromMatch = buffer.match(/From:\s*(.*)/i);
                            if (!fromMatch || fromMatch.length < 2) {
                                console.error("Failed to parse 'From' header.");
                                return reject("Failed to parse 'From' header.");
                            }

                            // 예: From: "01012345678" <01012345678@vmms.nate.com>
                            const fromAddress = fromMatch[1].trim();
                            const phoneMatch = fromAddress.match(/<(\d+)@/);
                            const domainMatch = fromAddress.match(/@([\w.-]+)>/);

                            if (!phoneMatch || !domainMatch) {
                                console.error("Invalid 'From' header format.");
                                return reject("Invalid 'From' header format.");
                            }

                            // 추출된 전화번호와 도메인
                            const fromPhone = phoneMatch[1];
                            const fromDomain = domainMatch[1];

                            // 허용 도메인인지 검사
                            if (
                                fromDomain !== "vmms.nate.com" && 
                                fromDomain !== "ktfmms.magicn.com" && 
                                fromDomain !== "lguplus.com"
                            ) {
                                console.error("Invalid domain:", fromDomain);
                                return reject("Invalid domain");
                            }

                            // 모든 조건 통과 시 발신자 번호 반환
                            resolve(fromPhone);
                        });
                    });
                });

                // 4) Fetch 실행 중 에러 처리
                f.once("error", (err) => {
                    console.error("Fetch error:", err);
                    reject(err);
                });

                // 5) Fetch 완료 시 로그
                f.once("end", () => {
                    console.log("Search and fetch complete.");
                });
            });
        });
    });
};

/* 
## 함수 기능 2 ##
 - userverifyOnEmailCheack:
   userVerifyOnEmail 함수를 module.exports로 노출하기 위해 연결해주는 변수
*/
userverifyOnEmailCheack = userVerifyOnEmail;

module.exports = userverifyOnEmailCheack;
