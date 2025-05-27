let chatRoom_ResultMessage = 
[[  //채팅방 리스트
    {// 0
        success : true,
        message : "해당 유저(name_N)가 존재하지 않습니다."
    }
],[
    {// 1
        success : true,
        message : "채팅방 리스트를 데이터 베이스에 저장을 성공하였습니다."
    }
],[
    {// 2
        success : true,
        message : "채팅방 데이터를 데이터 베이스에서 검색을 실패하였습니다."
    }
],[
    {// 3
        success : true,
        message : "닉네임, 룸ID와 일치하는 채팅방 삭제에 실패하였습니다."
    }
],[
    {// 4
        success : true,
        message : "닉네임, 룸ID와 일치하는 채팅방 삭제에 성공하였습니다."
    }
],[
    {// 5
        success : true,
        message : "채팅방 진입 성공."
    }
],[
    {// 6
        success : true,
        message : "채팅방 진입 실패."
    }
],[
    {// 7
        success : true,
        message : "채팅방 알람 업데이트 실패."
    }
],[
    {// 8
        success : true,
        message : "채팅방 알람을 업데이트 했습니다."
    }
]
]


module.exports = { chatRoom_ResultMessage };