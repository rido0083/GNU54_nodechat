var port = 3000;

var app = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var mysql = mysql.createConnection({
    host: 'localhost',
    user : 'gangtool2',
    password : 'askjasfiqwr@!uu53d1',
    insecureAuth: true,
    database: 'gangtool2'
});
mysql.connect();

http.listen(port, function() {
    console.log('서버가 실행되었습니다.');
});

var g5_is_member = 0, userId = "", usernick = "", userlevel = "";
io.set('authorization', function (data, accept) {
    if (data._query['userId']) {
        var query = "select * from g5_member where mb_id = "+mysql.escape(data._query['userId'])+" ";
        mysql.query(query, function(err, rows, fields) {
            if (rows.length) {
                g5_is_member = 1;
                userId = rows[0]['mb_id'];
                usernick = rows[0]['mb_nick'];
                userlevel = rows[0]['mb_level'];
            }
        });
    }

    accept(null, true);
});

var chat = io.of("/chat");
chat.on("connection", function(socket) {
    socket.on("send", function(e) {
        switch (g5_is_member) {
            case 0:
                socket.emit("msg", {
                    "message": {
                        "notice": "비회원은 채팅할 수 없습니다."
                    }
                });
                break;
            case 1:

                chat.emit("msg", {
                    "message": {
                        "userId": userId,
                        "usernick": usernick,
                        "contents": e.message,
                        "typeCode": e.messageTypeCode
                    }
                });
                break;
        }
    });
});
