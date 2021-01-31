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
    }
}

module.exports = answer