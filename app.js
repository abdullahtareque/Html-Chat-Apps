const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    maxHttpBufferSize: 50 * 1024 * 1024 // 50 MB file size limit
});
const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Main route to serve index.html
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Object to store connected usernames
let usernames = {};

// Socket.IO connection handling
io.sockets.on('connection', function(socket) {
    // Handle file attachments (other files)
    socket.on('other file', function(fileData) {
        try {
            // Validate username
            if (!socket.username) {
                console.log('File upload attempted without username');
                return;
            }

            // Validate file data
            if (!fileData || !fileData.data || !fileData.name || !fileData.type) {
                console.log('Invalid file data received');
                return;
            }

            // Allowed file types
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain',
                'image/jpeg',
                'image/png',
                'image/gif'
            ];

            // Check file type
            if (!allowedTypes.includes(fileData.type)) {
                console.log('Unsupported file type:', fileData.type);
                return;
            }

            // Check file size (50MB limit)
            if (fileData.size > 50 * 1024 * 1024) {
                console.log('File too large:', fileData.size);
                return;
            }

            // Broadcast file to other users
            socket.broadcast.emit('otherformat', socket.username, fileData);
            
            // Log successful file transfer
            console.log(`File transferred: ${fileData.name} (${fileData.size} bytes)`);

        } catch (error) {
            console.error('Critical error processing file:', error);
        }
    });

    // Handle image uploads
    socket.on('user image', function(data) {
        try {
            if (socket.username && data) {
                // Broadcast image to other users
                socket.broadcast.emit('addimage', socket.username, data);
            } else {
                console.log('Invalid image data received');
            }
        } catch (error) {
            console.error('Error processing image:', error);
        }
    });

    // Handle chat messages
    socket.on('sendchat', function(data) {
        try {
            if (socket.username && data) {
                // Broadcast message to all users
                io.sockets.emit('updatechat', socket.username, data);
            }
        } catch (error) {
            console.error('Error sending chat message:', error);
        }
    });

    // Handle user connection
    socket.on('adduser', function(username) {
        try {
            // Validate username
            if (!username || username.trim() === "") {
                socket.emit('error', 'Username cannot be empty! Please try again.');
                return;
            }

            // Trim and set username
            username = username.trim();

            // Check if username is already in use
            if (usernames[username]) {
                socket.emit('error', 'Username is already in use. Please choose another.');
                return;
            }

            // Set socket username and add to usernames
            socket.username = username;
            usernames[username] = username;

            // Send connection messages
            socket.emit('updatechat', 'SERVER', 'You have connected');
            socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
            
            // Update user list for all clients
            io.sockets.emit('updateusers', usernames);
        } catch (error) {
            console.error('Error adding user:', error);
            socket.emit('error', 'An error occurred while connecting');
        }
    });

    // Handle user disconnection
    socket.on('disconnect', function() {
        try {
            if (socket.username) {
                // Remove username from connected users
                delete usernames[socket.username];

                // Update user list
                io.sockets.emit('updateusers', usernames);

                // Broadcast disconnection message
                socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
            }
        } catch (error) {
            console.error('Error during disconnection:', error);
        }
    });
});

// Set up server port
const port = process.env.PORT || 1234;
server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});



// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const io = require('socket.io')(server, {
//     maxHttpBufferSize: 1e8 // 100 MB file size limit (default was 1MB)
// });
// const path = require('path');

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Main route to serve index.html
// app.get('/', function(req, res){
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Object to store connected usernames
// let usernames = {};

// // Socket.IO connection handling
// io.sockets.on('connection', function(socket) {
//     // Handle file attachments (other files)
//     socket.on('other file', function(fileData) {
//         try {
//             if (socket.username && fileData && fileData.data) {
//                 // Broadcast file to other users
//                 socket.broadcast.emit('otherformat', socket.username, fileData.data);
//             } else {
//                 console.log('Invalid file data received');
//             }
//         } catch (error) {
//             console.error('Error processing file:', error);
//         }
//     });

//     // Handle image uploads
//     socket.on('user image', function(data) {
//         try {
//             if (socket.username && data) {
//                 // Broadcast image to other users
//                 socket.broadcast.emit('addimage', socket.username, data);
//             } else {
//                 console.log('Invalid image data received');
//             }
//         } catch (error) {
//             console.error('Error processing image:', error);
//         }
//     });

//     // Handle chat messages
//     socket.on('sendchat', function(data) {
//         try {
//             if (socket.username && data) {
//                 // Broadcast message to all users
//                 io.sockets.emit('updatechat', socket.username, data);
//             }
//         } catch (error) {
//             console.error('Error sending chat message:', error);
//         }
//     });

//     // Handle user connection
//     socket.on('adduser', function(username) {
//         try {
//             // Validate username
//             if (!username || username.trim() === "") {
//                 socket.emit('error', 'Username cannot be empty! Please try again.');
//                 return;
//             }

//             // Trim and set username
//             username = username.trim();

//             // Check if username is already in use
//             if (usernames[username]) {
//                 socket.emit('error', 'Username is already in use. Please choose another.');
//                 return;
//             }

//             // Set socket username and add to usernames
//             socket.username = username;
//             usernames[username] = username;

//             // Send connection messages
//             socket.emit('updatechat', 'SERVER', 'You have connected');
//             socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
            
//             // Update user list for all clients
//             io.sockets.emit('updateusers', usernames);
//         } catch (error) {
//             console.error('Error adding user:', error);
//             socket.emit('error', 'An error occurred while connecting');
//         }
//     });

//     // Handle user disconnection
//     socket.on('disconnect', function() {
//         try {
//             if (socket.username) {
//                 // Remove username from connected users
//                 delete usernames[socket.username];

//                 // Update user list
//                 io.sockets.emit('updateusers', usernames);

//                 // Broadcast disconnection message
//                 socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
//             }
//         } catch (error) {
//             console.error('Error during disconnection:', error);
//         }
//     });
// });

// // Set up server port
// const port = process.env.PORT || 1234;
// server.listen(port, () => {
//     console.log(`Server is listening on http://localhost:${port}`);
// });


// var express = require('express');
// var app = express();
// var http = require('http');
// var server = http.createServer(app);
// var io = require('socket.io')(server, {
//     maxHttpBufferSize: 1e8 // 100 MB সাইজ সীমা (ডিফল্ট 1MB)
// });

// app.use(express.static(__dirname + '/public'));

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/public/index.html');
// });

// var usernames = {};

// io.sockets.on('connection', function(socket) {
//     socket.on('other file', function(data) {
//         if (socket.username) {
//             socket.broadcast.emit('otherformat', socket.username, data);
//         }
//     });

//     socket.on('user image', function(data) {
//         if (socket.username) {
//             socket.broadcast.emit('addimage', socket.username, data);
//         }
//     });

//     socket.on('sendchat', function(data) {
//         if (socket.username) {
//             io.sockets.emit('updatechat', socket.username, data);
//         }
//     });

//     socket.on('adduser', function(username) {
//         if (!username || username.trim() === "") {
//             socket.emit('error', 'Username cannot be empty! Please try again.');
//             return;
//         }
//         socket.username = username.trim();
//         usernames[username] = username;
//         socket.emit('updatechat', 'SERVER', 'You have connected');
//         socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
//         io.sockets.emit('updateusers', usernames);
//     });

//     socket.on('disconnect', function() {
//         if (socket.username) {
//             delete usernames[socket.username];
//             io.sockets.emit('updateusers', usernames);
//             socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
//         }
//     });
// });

// var port = 1234;
// server.listen(port);
// console.log("Server is listening to http://localhost:1234");


// var express = require('express');
// var app = express();
// var http = require('http');
// var server = http.createServer(app);
// var io = require('socket.io')(server);


// app.use(express.static(__dirname + '/public'));

// app.get('/', function(req, res){
// res.sendFile(__dirname+'/public/index.html');
// });

// var usernames={};

// io.sockets.on('connection', function(socket){

// socket.on('other file', function(data){
// socket.broadcast.emit('otherformat', socket.username, data);
// });

// socket.on('user image', function(data){
// socket.broadcast.emit('addimage',socket.username, data)
// });

// socket.on('sendchat',function(data){
// io.sockets.emit('updatechat',socket.username, data);
// });


// // socket.on('adduser',function(username){
// // socket.username=username;
// // usernames[username]=username;
// // socket.emit('updatechat','SERVER','You have connected');
// // socket.broadcast.emit('updatechat','SERVER', username+ ' has connected');
// // io.sockets.emit('updateusers', usernames);
// // });

// socket.on('adduser', function(username) {
//     if (!username || username.trim() === "") {
//         socket.emit('error', 'Username cannot be empty! Please try again.');
//         return;
//     }
//     socket.username = username.trim();
//     usernames[username] = username;
//     socket.emit('updatechat', 'SERVER', 'You have connected');
//     socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
//     io.sockets.emit('updateusers', usernames);
// });

// // socket.on('disconnect', function(){
// // delete usernames[socket.username];
// // io.sockets.emit('updateusers',usernames);
// // socket.broadcast.emit('updatechat','SERVER', socket.username + ' has disconnected');
// // });
// // });

// socket.on('disconnect', function(){
//     delete usernames[socket.username];
//     io.sockets.emit('updateusers',usernames);
//     socket.broadcast.emit('updatechat','SERVER', socket.username + ' has disconnected');
//     });
//     });
    

// var port = 1234;
// server.listen(port);
// console.log("Server is listening to http://localhost:1234")
