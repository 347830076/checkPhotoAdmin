// answer.js
const ejs = require('ejs')
const messageTpl = '<xml>\n' +
    '<ToUserName><![CDATA[<%-toUserName%>]]></ToUserName>' +
    '<FromUserName><![CDATA[<%-fromUserName%>]]></FromUserName>' +
    '<CreateTime><%=createTime%></CreateTime>' +
    '<MsgType><![CDATA[<%=msgType%>]]></MsgType>' +
    '<Content><![CDATA[<%-content%>]]></Content>' +
    '</xml>';

const answer = {
    text: function (message) {
        let reply = {
            toUserName: message.FromUserName,
            fromUserName: message.ToUserName,
            createTime: new Date().getTime(),
            msgType: 'text',
            content: message.Content
        };
        let output = ejs.render(messageTpl, reply);
        return output;
    },
    txtMsg: function(toUser,fromUser,content){
        var xmlContent =  "<xml><ToUserName><![CDATA["+ toUser +"]]></ToUserName>";
            xmlContent += "<FromUserName><![CDATA["+ fromUser +"]]></FromUserName>";
            xmlContent += "<CreateTime>"+ new Date().getTime() +"</CreateTime>";
            xmlContent += "<MsgType><![CDATA[text]]></MsgType>";
            xmlContent += "<Content><![CDATA["+ content +"]]></Content></xml>";
        return xmlContent;
    },
    imgMsg: function(toUser, fromUser, media_id){
        let xmlContent =  `<xml>
            <ToUserName><![CDATA[${toUser}]]></ToUserName>
            <FromUserName><![CDATA[${fromUser}]]></FromUserName>
            <CreateTime>${new Date().getTime()}</CreateTime>
            <MsgType><![CDATA[image]]></MsgType>
            <Image>
            <MediaId><![CDATA[${media_id}]]></MediaId>
            </Image>
        </xml>`
        return xmlContent;
    },
}



module.exports = answer