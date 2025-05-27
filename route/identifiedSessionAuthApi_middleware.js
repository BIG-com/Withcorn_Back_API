const express = require("express");
const identifiedSessionAuthApiMid = require('./controller/identifiedSessionAuthApi_controller');


const router = express.Router();

router.post("/createIdentifiedSessionId",identifiedSessionAuthApiMid.createIdentifiedSessionId);

router.post("/phoneNumberVerify",identifiedSessionAuthApiMid.phoneNumberVerify);

// 다른 파일에서 쓸 수 있도록
module.exports = router;