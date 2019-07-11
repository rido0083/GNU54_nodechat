var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mysql = require('mysql');
var mysql = mysql.createConnection({
    insecureAuth: true,
    host :'localhost', //db ip address
    port : 3306, //db port number
    user : 'gangtool2', //db id
    password : 'askjasfiqwr@!uu53d1', //db password
    database:'gangtool2' //db schema name
});
//mysql.connect();

mysql.connect(function(err) {
     if (err) {
         console.error('mysql connection error');
         console.error(err);
         throw err;
     }else{
         console.log("연결에 성공하였습니다.");
     }
 });

var g5_is_member = 0, userId = "", usernick = "", userlevel = "";
var query = "select * from g5_member where mb_id = 'admin'";
mysql.query(query, function(err, rows, fields) {
    if (rows.length) {
        g5_is_member = 1;
        userId = rows[0]['mb_id'];
        usernick = rows[0]['mb_nick'];
        userlevel = rows[0]['mb_level'];
    }
});

app.get('/gangchat/',function(req, res){

    var user_id = req.param('id');
    var gang_no = req.param('no');
    io.on('connection', function(socket){
        io.to(socket.id).emit('get user_id',user_id);
        io.to(socket.id).emit('get gang_no',gang_no);
    });

    res.sendFile(__dirname + '/gangchat.html');

});

app.get('/gang_return/',function(req, res){
    var page_name = req.param('page');
    var room_no = req.param('room_no');
    res.sendFile(__dirname + '/gang_return.html' );
});

app.get('/gangroom/',function(req, res){
    /*
    var user_id = req.param('id');
    var gang_no = req.param('no');

    io.on('connection', function(socket){
        io.to(socket.id).emit('get user_id',user_id);
        io.to(socket.id).emit('get gang_no',gang_no);
    });
    */
    //res.sendFile(__dirname + '/gang_room.html' );
});



io.on('connection', function(socket){

    console.log('user connected: ', socket.id);

    var count=1;
    var name = "user" + count++;
    io.to(socket.id).emit('change name',name);

    socket.on('disconnect', function(){
      console.log('user disconnected: ', socket.id);
    });

    socket.on('page reflash', function(page_name , gangno){
        //디비에 페이지를 저장한다. (이후 로깅자가 자동이동되게)
        //현재 강의 페이지를 지정
        socket.join(gangno); // 그룹에 들어가기
        var return_page = page_name;
        //io.emit('receive message', msg);
        io.to(gangno).emit('receive page', return_page); // 나를 제외한 그룹 전체
    });

    socket.on('send message', function(name, gangno ,text){
        socket.join(gangno); // 그룹에 들어가기
        var msg = name + ' : ' + text;
        console.log(msg);
        //io.emit('receive message', msg);
        io.to(gangno).emit('receive message', msg); // 나를 제외한 그룹 전체
    });

});


http.listen(3000, function(){
  console.log('server on!');
});
