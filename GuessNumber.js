var net = require('net');
var HOST = '127.0.0.1';
var PORT = 6969;

var db = {}

net.createServer(function (sock){
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort)
    var state = 0 //idle
    var current_key = Math.floor(Math.random() * 100) + 1

    sock.on('data', function(data){
        switch(state){
            case 0:
                if(data == 'Hi'){
                    sock.write('Send \"START\" to paly')
                    state = 1 //wait for start
                    break
                }else{
                    sock.write('Not the key ')
                }
            case 1:
                if(data == 'START'){
                    sock.write('Send any number. Let\'s go!!')
                    state = 2 //wait for number
                    break
                }else{
                    sock.write('Send \"START\" to paly')
                }
            case 2:
                try{
                    let client_num = + data
                    if(client_num > db[current_key]){
                        sock.write('Less than!!')
                    }else if(client_num < db[current_key]){
                        sock.write('More than!!')
                    }else if(client_num == db[current_key]){
                        sock.write('Correct!! Send \"STOP\" to exit ')
                        state = 3 //wait to exit
                    }
                }catch(e){
                    sock.write('INVALID')
                }
            case 3:
                if(data == 'STOP'){
                    sock.close()
                }       
        }
    })
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST + ':' + PORT);

//client
var net = require('net')

var client = new net.Socket()
client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT)
    client.write('Hi')
    
    client.on('data', function(data) {
        client.write('START')
        console.log('Received: ' + data)
        client.write('9')
    })
})

client.on('close', function() {
	console.log('Connection closed');
})
