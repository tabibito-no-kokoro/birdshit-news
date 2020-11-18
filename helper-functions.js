const getRandomDateString = () => {
    var today = new Date();
    var theFirstTweetDate = new Date("March 21, 2006");
    var randomDate = new Date(today - Math.random() * (today - theFirstTweetDate));

    var dd = randomDate.getDate();
    var mm = randomDate.getMonth() + 1;
    var yyyy = randomDate.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    randomDateString = yyyy + '-' + mm + '-' + dd;

    return randomDateString;
}

const randomHangulString = () => {
    var result = '';
    var characters = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅑㅕㅕㅗㅛㅜㅠㅡㅣㅐㅒㅔㅖㅘㅙㅚㅝㅞㅟㅢ';
    var charactersLength = characters.length;
    result = characters.charAt(Math.floor(Math.random() * charactersLength));
    var die = Math.random();
    return die < 0.5 ? String.fromCharCode(44031 + Math.ceil(11172 * Math.random())) : result;
}

const randomString = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const noSpaceNoSpecial = (qTerm) => {
    var noSpace = qTerm.replace(/\s+/g, '');
    var noSpaceNoSpecial = noSpace.replace(/[&\/\\#,+()$~%.'":*?!@^-_=<>{}]/g, "");
    if (noSpaceNoSpecial === '') noSpaceNoSpecial = '_';
    return noSpaceNoSpecial;
}

module.exports = { getRandomDateString, randomHangulString, randomString, noSpaceNoSpecial };