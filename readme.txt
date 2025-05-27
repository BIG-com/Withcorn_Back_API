안녕하세요 
읽고 사용한다면 코드의 이해에 도움이 될 것 입니다

1. 터미널 설치 (nodejs 실행파일 내부 | EX. cd /home/node/app)

// dotenv 설치
npm i dotenv

// mysql 설치
npm i mysql

// path 설치
npm i path

// bcrypt 설치
npm i bcrypt

2. 데이터 베이스 pool 연결 

*  dbPool.js : 데이터베이스 pool 연결 실행 파일 
*  dbPoolEnv.env : 데이터베이스 정보를 담아 dbPool로 연결
***  dbpool로 db를 사용하고 싶으면 미들웨어에 넣어야 실행됨
*****  사용 후  .release()해서 풀어줘야 한다

EX)
    exports.listGetMid = (req,res) => {

        pool.getConnectionPool((conn)=>{

            const sql = 'SELECT * FROM user';

            conn.query(sql,(err,results) => {

                if(err) console.log(err);
                res.send(results);

            });

            conn.release();
            
        });
    };



내일 할거 
1. appkey 넣는 방법 (Auth 넣기)
2. JWT 연결하기
3. JWT으로 회원가입 로그인 로그아웃 구현 (https://velog.io/@hoonnn/NodeJS-JWT를-이용한-로그인-구현하기) -> 노션에 메인 참고자료 아닌 참고자료 1에 저장