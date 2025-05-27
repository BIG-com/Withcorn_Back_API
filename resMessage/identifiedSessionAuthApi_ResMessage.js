let identifiedSessionAuth_ResultMessage = 
[[  //(휴대폰 인증 번호 생성) && (휴대폰 번호 인증 && 인증 시간 확인)
    {// 0
        success : true,
        message : "id 반환 고장"
    }
],[ 
    {// 1
        success : true,
        message : "이메일에서 휴대폰 번호 찾기를 실패했습니다."
    }
]
]


module.exports = { identifiedSessionAuth_ResultMessage };

// [ // 휴대폰 번호 인증 && 인증 시간 확인
//     {// 1
//         success : true,
//         message : successVerifyOnEmail.phoneNumber
//     }
// ]