let login_ResultMessage = 
[[  //회원가입
    {// 0
        success : true,
        message : "회원가입 요청에 대한 작업이 실패하였습니다."
    }
],[
    {// 1
        success : true,
        message : "회원가입 요청이 성공적으로 실행되었습니다."
    }
],[ //아이디 중복 확인
    {// 2
        success : true,
        message : "id 중복 확인 고장."
    }
],[
    {// 3
        success : true,
        message : "id가 중복되지 않음."
    }
],[
    {// 4
        success : true,
        message : "id가 중복됨."
    }
],[ //닉네임 중복 확인
    {// 5
        success : true,
        message : "name_N 중복 확인 고장."
    }
],[
    {// 6
        success : true,
        message : "name_N이 중복되지 않음."
    }
],[
    {// 7
        success : true,
        message : "name_N이 중복됨."
    }
],[ // 아이디 찾기
    {// 8
        success : true,
        message : "id 반환 고장."
    }
],[
    {// 9
        success : true,
        message : "일치하는 ID가 없습니다."
    }
],[ // 비밀번호 찾기
    {// 10
        success : true,
        message : "findPw sql 쿼리문이 잘못되었습니다."
    }
],[ 
    {// 11
        success : true,
        message : "일치하는 Pw가 있습니다."
    }
],[
    {// 12
        success : true,
        message : "일치하는 Pw가 없습니다."
    }
],[ // 비밀번호 재설정
    {// 13
        success : true,
        message : "resetPw Api 안에 hashedPw 쿼리 고장."
    }
],[ 
    {// 14
        success : true,
        message : "업데이트 고장."
    }
],[ 
    {// 15
        success : true,
        message : "비밀번호가 재설정 되었습니다."
    }
],[ 
    {// 16
        success : true,
        message : "hashedPw가 pw와 일치합니다."
    }
],[ // session id를 이용한 로그인
    {// 17
        success : true,
        message : "dbSessionId 고장."
    }
],[ 
    {// 18
        success : true,
        message : "자동 로그인 성공."
    }
],[ 
    {// 19
        success : true,
        message : "sessionLogin Api 안에 hashedPw 쿼리 고장."
    }
],[ 
    {// 20
        success : true,
        message : "아이디가 일치하지 않습니다."
    }
],[ 
    {// 21
        success : true,
        message : "비밀번호가 일치하지 않습니다."
    }
],[ 
    {// 22
        success : true,
        message : "sessionIdToDB 고장."
    }
],[ 
    {// 23
        success : true,
        message : "자동 로그인 실패."
    }
],[ 
    {// 24
        success : true,
        message : "회원탈퇴 실패."
    }
],[ 
    {// 25
        success : true,
        message : "회원탈퇴 성공."
    }
],[ 
    {// 26
        success : true,
        message : "로그아웃 실패."
    }
],[ 
    {// 27
        success : true,
        message : "로그아웃 성공."
    }
],[ 
    {// 28
        success : true,
        message : "회원조회 고장."
    }
],[ 
    {// 29
        success : true,
        message : "해당 id의 회원정보가 없음."
    }
]
]


module.exports = { login_ResultMessage };