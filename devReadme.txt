
// key를 string으로 바꿈 ex) KEY : "VALUE" -> "KEY" : "VALUE"
var json = JSON.stringify(results);

// JSON 데이터를 자바스크립트 객체로 변환 ex) res.send(obj.KEY) => VALUE
var obj = JSON.parse(json);

// 대괄호가 붙어있어 객체안에 KEY가 참조가 안될 떄
res.send(obj[0].KEY)