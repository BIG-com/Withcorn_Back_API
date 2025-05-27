let serverConnect_ResultMessage = 
[[  //채팅방 리스트
    {// 0
        success : true,
        message : "메세지가 저장에 실패하였습니다."
    }
],[
    {// 1
        success : true,
        message : "메세지 저장에 성공하였습니다. 하지만 FCM 푸시는 실패하였습니다."
    }
],[
    {// 2
        success : true,
        message : "FCM 토큰 저장에 실패하였습니다."
    }
],[
    {// 3
        success : true,
        message : "FCM 토큰 저장에 성공하였습니다."
    }
],[
    {// 4
        success : true,
        message : "오프라인 사용자 없음. 푸시 생략하였습니다."
    }
],[
    {// 5
        success : true,
        message : "FCM 푸시 전송 완료하였습니다."
    }
],[
    {// 6
        success : true,
        message : "FCM 푸시 전송 실패하였습니다."
    }
]
]


module.exports = { serverConnect_ResultMessage };