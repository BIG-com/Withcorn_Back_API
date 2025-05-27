const generateHashedWithcornPw = require('./createSessionId');

(async () => {
    const p = await generateHashedWithcornPw();
    console.log("Hashed Password:", p);
})();


