// // Global variable to store the username
// let myUsername = null;
// let socket = null;

// $(document).ready(function () {
//     // Initialize Socket.IO connection
//     socket = io.connect('http://localhost:1234');

//     // Trigger addUser when connected, only if username is not set
//     socket.on('connect', function () {
//         if (!myUsername) {
//             addUser();
//         }
//     });

//     // Event listeners for chat updates
//     socket.on('updatechat', processMessage);
//     socket.on('updateusers', updateUserList);
//     socket.on('addimage', function (data, image) {
//         if (data === myUsername) {
//             $('#conversation').append(
//                 $('<p>').addClass('bubble me').append(
//                     $('<b>').text(data + ':'),
//                     '<a class="chatLink" href="' + image + '"><img src="' + image + '"/></a>'
//                 )
//             );
//         } else {
//             $('#conversation').append(
//                 $('<p>').addClass('bubble others').append(
//                     $('<b>').text(data + ':'),
//                     '<a class="chatLink" href="' + image + '"><img src="' + image + '"/></a>'
//                 )
//             );
//         }
//         scrollTopdown();
//     });

//     socket.on('otherformat', function (data, base64file) {
//         if (data === myUsername) {
//             $('#conversation').append(
//                 $('<p>').addClass('bubble me').append(
//                     $('<b>').text(data + ':'),
//                     '<a href="' + base64file + '">Attachment File</a>'
//                 )
//             );
//         } else {
//             $('#conversation').append(
//                 $('<p>').addClass('bubble others').append(
//                     $('<b>').text(data + ':'),
//                     '<a href="' + base64file + '">Attachment File</a>'
//                 )
//             );
//         }
//         scrollTopdown();
//     });

//     socket.on('error', function (message) {
//         alert(message);
//         addUser(); // Retry if username is invalid
//     });

//     // Button and input event listeners
//     $('#datasend').click(sendMessage);
//     $('#data').keypress(processEnterPress);

//     // Drag and drop zone handling
//     $('#dropZone').on('dragover', function (e) {
//         e.stopPropagation();
//         e.preventDefault();
//     });

//     $('#dropZone').on('drop', function (e) {
//         e.stopPropagation();
//         e.preventDefault();
//         var files = e.originalEvent.dataTransfer.files;
//         for (var i = 0, file; file = files[i]; i++) {
//             if (file.type.match(/image.*/)) {
//                 var reader = new FileReader();
//                 reader.onload = function (e) {
//                     var imageData = e.target.result;
//                     // নিজের স্ক্রিনে ইমেজ প্রকাশ করা
//                     $('#conversation').append(
//                         $('<p>').addClass('bubble me').append(
//                             $('<b>').text(myUsername + ':'),
//                             '<a class="chatLink" href="' + imageData + '"><img src="' + imageData + '"/></a>'
//                         )
//                     );
//                     scrollTopdown();
//                     // সার্ভারে ইমেজ সেন্ড করা
//                     socket.emit('user image', imageData);
//                 };
//                 reader.readAsDataURL(file);
//             } else {
//                 var reader = new FileReader();
//                 reader.onload = function (e) {
//                     var fileData = e.target.result;
//                     // নিজের স্ক্রিনে ফাইল লিঙ্ক প্রকাশ করা
//                     $('#conversation').append(
//                         $('<p>').addClass('bubble me').append(
//                             $('<b>').text(myUsername + ':'),
//                             '<a href="' + fileData + '">Attachment File</a>'
//                         )
//                     );
//                     scrollTopdown();
//                     // সার্ভারে ফাইল সেন্ড করা
//                     socket.emit('other file', fileData);
//                 };
//                 reader.readAsDataURL(file);
//             }
//         }
//     });

//     // // Image and file attachment handling
//     // $('#imagefile').on('change', function (e) {
//     //     var file = e.originalEvent.target.files[0];
//     //     var reader = new FileReader();
//     //     reader.onload = function (evt) {
//     //         var imageData = evt.target.result;
//     //         // নিজের স্ক্রিনে ইমেজ প্রকাশ করা
//     //         $('#conversation').append(
//     //             $('<p>').addClass('bubble me').append(
//     //                 $('<b>').text(myUsername + ':'),
//     //                 '<a class="chatLink" href="' + imageData + '"><img src="' + imageData + '"/></a>'
//     //             )
//     //         );
//     //         scrollTopdown();
//     //         // সার্ভারে ইমেজ সেন্ড করা
//     //         socket.emit('user image', imageData);
//     //     };
//     //     reader.readAsDataURL(file);
//     //     $('#imagefile').val('');
//     // });

//     socket.on('addimage', function (data, image) {
//         if (data) {
//             if (data === myUsername) {
//                 $('#conversation').append(
//                     $('<p>').addClass('bubble me').append(
//                         $('<b>').text(data + ':'),
//                         '<a class="chatLink" href="' + image + '"><img src="' + image + '"/></a>'
//                     )
//                 );
//             } else {
//                 $('#conversation').append(
//                     $('<p>').addClass('bubble others').append(
//                         $('<b>').text(data + ':'),
//                         '<a class="chatLink" href="' + image + '"><img src="' + image + '"/></a>'
//                     )
//                 );
//             }
//             scrollTopdown();
//         }
//     });

//     // $('#otherfile').on('change', function (e) {
//     //     var file = e.originalEvent.target.files[0];
//     //     var reader = new FileReader();
//     //     reader.onload = function (evt) {
//     //         var fileData = evt.target.result;
//     //         // নিজের স্ক্রিনে ফাইল লিঙ্ক প্রকাশ করা
//     //         $('#conversation').append(
//     //             $('<p>').addClass('bubble me').append(
//     //                 $('<b>').text(myUsername + ':'),
//     //                 '<a href="' + fileData + '">Attachment File</a>'
//     //             )
//     //         );
//     //         scrollTopdown();
//     //         // সার্ভারে ফাইল সেন্ড করা
//     //         socket.emit('other file', fileData);
//     //     };
//     //     reader.readAsDataURL(file);
//     //     $('#otherfile').val('');
//     // });

//     socket.on('otherformat', function (data, base64file) {
//         // Check if data is not null or undefined
//         if (data) {
//             if (data === myUsername) {
//                 $('#conversation').append(
//                     $('<p>').addClass('bubble me').append(
//                         $('<b>').text(data + ':'),
//                         '<a href="' + base64file + '">Attachment File</a>'
//                     )
//                 );
//             } else {
//                 $('#conversation').append(
//                     $('<p>').addClass('bubble others').append(
//                         $('<b>').text(data + ':'),
//                         '<a href="' + base64file + '">Attachment File</a>'
//                     )
//                 );
//             }
//             scrollTopdown();
//         }
//     });
// });

// // Function definitions
// function addUser() {
//     let username = prompt("Enter Your Name!");
//     while (!username || username.trim() === "") {
//         username = prompt("Username cannot be empty! Please enter a valid name:");
//     }
//     myUsername = username.trim();
//     socket.emit('adduser', myUsername);
// }

// function processMessage(username, data) {
//     if (username === myUsername) {
//         $('#conversation').append(
//             $('<p>').addClass('bubble me').html('<b>' + username + ':</b> ' + data)
//         );
//     } else {
//         $('#conversation').append(
//             $('<p>').addClass('bubble others').html('<b>' + username + ':</b> ' + data)
//         );
//     }
//     scrollTopdown();
// }

// function updateUserList(data) {
//     $('#users').empty();
//     $.each(data, function (key, value) {
//         $('#users').append('<div>' + key + '</div>');
//     });
// }

// function sendMessage() {
//     var message = $('#data').val();
//     $('#data').val('');
//     if (message.trim() !== "") {
//         socket.emit('sendchat', message);
//     }
//     $('#data').focus();
//     scrollTopdown();
// }

// function processEnterPress(e) {
//     if (e.which == 13) {
//         e.preventDefault();
//         $(this).blur();
//         $('#datasend').focus().click();
//     }
// }

// function scrollTopdown() {
//     var scrollHeight = document.getElementById('conversation').scrollHeight;
//     document.getElementById('conversation').scrollTop = scrollHeight;
// }

// // Global variable to store the username
// let myUsername = null;
// let socket = null;

// $(document).ready(function () {
//     // Initialize Socket.IO connection
//     socket = io.connect('http://localhost:1234');

//     // Trigger addUser when connected, only if username is not set
//     socket.on('connect', function () {
//         if (!myUsername) {
//             addUser();
//         }
//     });

//     // Event listeners for chat updates
//     socket.on('updatechat', processMessage);
//     socket.on('updateusers', updateUserList);

//     // Handle image uploads
//     socket.on('addimage', function (data, image) {
//         if (data) {
//             if (data === myUsername) {
//                 $('#conversation').append(
//                     $('<p>').addClass('bubble me').append(
//                         $('<b>').text(data + ':'),
//                         '<a class="chatLink" href="' + image + '"><img src="' + image + '"/></a>'
//                     )
//                 );
//             } else {
//                 $('#conversation').append(
//                     $('<p>').addClass('bubble others').append(
//                         $('<b>').text(data + ':'),
//                         '<a class="chatLink" href="' + image + '"><img src="' + image + '"/></a>'
//                     )
//                 );
//             }
//             scrollTopdown();
//         }
//     });

//     // Handle file attachments
//     socket.on('otherformat', function (data, base64file) {
//         if (data) {
//             if (data === myUsername) {
//                 $('#conversation').append(
//                     $('<p>').addClass('bubble me').append(
//                         $('<b>').text(data + ':'),
//                         '<a href="' + base64file + '" download>Attachment File</a>'
//                     )
//                 );
//             } else {
//                 $('#conversation').append(
//                     $('<p>').addClass('bubble others').append(
//                         $('<b>').text(data + ':'),
//                         '<a href="' + base64file + '" download>Attachment File</a>'
//                     )
//                 );
//             }
//             scrollTopdown();
//         }
//     });

//     // Error handling
//     socket.on('error', function (message) {
//         alert(message);
//         addUser(); // Retry if username is invalid
//     });

//     // Button and input event listeners
//     $('#datasend').click(sendMessage);
//     $('#data').keypress(processEnterPress);

//     // Drag and drop zone handling
//     $('#dropZone').on('dragover', function (e) {
//         e.stopPropagation();
//         e.preventDefault();
//         $(this).addClass('drag-over');
//     });

//     $('#dropZone').on('dragleave', function (e) {
//         $(this).removeClass('drag-over');
//     });

//     $('#dropZone').on('drop', function (e) {
//         e.stopPropagation();
//         e.preventDefault();
//         $(this).removeClass('drag-over');

//         var files = e.originalEvent.dataTransfer.files;
//         handleFileUpload(files);
//     });

//     // Image and file attachment handling
//     $('#imagefile').on('change', function (e) {
//         var files = e.originalEvent.target.files;
//         handleImageUpload(files);
//         $('#imagefile').val('');
//     });

//     $('#otherfile').on('change', function (e) {
//         var files = e.originalEvent.target.files;
//         handleFileUpload(files);
//         $('#otherfile').val('');
//     });
// });

// // Function to handle image uploads
// function handleImageUpload(files) {
//     if (files.length > 0) {
//         var file = files[0];
//         if (file.type.match(/image.*/)) {
//             var reader = new FileReader();
//             reader.onload = function (e) {
//                 var imageData = e.target.result;
//                 // Display image on own screen
//                 $('#conversation').append(
//                     $('<p>').addClass('bubble me').append(
//                         $('<b>').text(myUsername + ':'),
//                         '<a class="chatLink" href="' + imageData + '"><img src="' + imageData + '"/></a>'
//                     )
//                 );
//                 scrollTopdown();
//                 // Send image to server
//                 socket.emit('user image', imageData);
//             };
//             reader.readAsDataURL(file);
//         } else {
//             alert('Please select an image file.');
//         }
//     }
// }

// // Function to handle file uploads
// function handleFileUpload(files) {
//     if (files.length > 0) {
//         var file = files[0];
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             var fileData = e.target.result;
//             // Display file link on own screen
//             $('#conversation').append(
//                 $('<p>').addClass('bubble me').append(
//                     $('<b>').text(myUsername + ':'),
//                     '<a href="' + fileData + '" download>' + file.name + '</a>'
//                 )
//             );
//             scrollTopdown();
//             // Send file to server
//             socket.emit('other file', {
//                 name: file.name,
//                 type: file.type,
//                 data: fileData
//             });
//         };
//         reader.readAsDataURL(file);
//     }
// }

// // Function to add user
// function addUser() {
//     let username = prompt("Enter Your Name!");
//     while (!username || username.trim() === "") {
//         username = prompt("Username cannot be empty! Please enter a valid name:");
//     }
//     myUsername = username.trim();
//     socket.emit('adduser', myUsername);
// }

// // Function to process received messages
// function processMessage(username, data) {
//     if (username && data) {
//         if (username === myUsername) {
//             $('#conversation').append(
//                 $('<p>').addClass('bubble me').html('<b>' + username + ':</b> ' + data)
//             );
//         } else {
//             $('#conversation').append(
//                 $('<p>').addClass('bubble others').html('<b>' + username + ':</b> ' + data)
//             );
//         }
//         scrollTopdown();
//     }
// }

// // Function to update user list
// function updateUserList(data) {
//     $('#users').empty();
//     if (data) {
//         $.each(data, function (key, value) {
//             $('#users').append('<div>' + key + '</div>');
//         });
//     }
// }

// // Function to send message
// function sendMessage() {
//     var message = $('#data').val().trim();
//     $('#data').val('');
//     if (message !== "") {
//         socket.emit('sendchat', message);
//     }
//     $('#data').focus();
//     scrollTopdown();
// }

// // Function to handle enter key press
// function processEnterPress(e) {
//     if (e.which == 13) {
//         e.preventDefault();
//         $(this).blur();
//         $('#datasend').focus().click();
//     }
// }

// // Function to scroll to bottom of conversation
// function scrollTopdown() {
//     var conversation = document.getElementById('conversation');
//     conversation.scrollTop = conversation.scrollHeight;
// }


// Global variable to store the username
let myUsername = null;
let socket = null;

$(document).ready(function () {
    // Initialize Socket.IO connection
    socket = io.connect('http://localhost:1234');

    // Trigger addUser when connected, only if username is not set
    socket.on('connect', function () {
        if (!myUsername) {
            addUser();
        }
    });

    // Event listeners for chat updates
    socket.on('updatechat', processMessage);
    socket.on('updateusers', updateUserList);

    // Handle image uploads
    socket.on('addimage', function (data, image) {
        if (data) {
            if (data === myUsername) {
                $('#conversation').append(
                    $('<p>').addClass('bubble me').append(
                        $('<b>').text(data + ':'),
                        '<a class="chatLink" href="' + image + '"><img src="' + image + '"/></a>'
                    )
                );
            } else {
                $('#conversation').append(
                    $('<p>').addClass('bubble others').append(
                        $('<b>').text(data + ':'),
                        '<a class="chatLink" href="' + image + '"><img src="' + image + '"/></a>'
                    )
                );
            }
            scrollTopdown();
        }
    });

    // Handle file attachments
    socket.on('otherformat', function (data, fileData) {
        if (data && fileData) {
            if (data === myUsername) {
                $('#conversation').append(
                    $('<p>').addClass('bubble me').append(
                        $('<b>').text(data + ':'),
                        '<a href="' + fileData.data + '" download="' + fileData.name + '">' + 
                        fileData.name + ' (' + (fileData.size / 1024).toFixed(2) + ' KB)</a>'
                    )
                );
            } else {
                $('#conversation').append(
                    $('<p>').addClass('bubble others').append(
                        $('<b>').text(data + ':'),
                        '<a href="' + fileData.data + '" download="' + fileData.name + '">' + 
                        fileData.name + ' (' + (fileData.size / 1024).toFixed(2) + ' KB)</a>'
                    )
                );
            }
            scrollTopdown();
        }
    });

    // Error handling
    socket.on('error', function (message) {
        alert(message);
        if (message.includes('Username')) {
            addUser(); // Retry if username is invalid
        }
    });

    // Button and input event listeners
    $('#datasend').click(sendMessage);
    $('#data').keypress(processEnterPress);

    // Drag and drop zone handling
    $('#dropZone').on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).addClass('drag-over');
    });

    $('#dropZone').on('dragleave', function (e) {
        $(this).removeClass('drag-over');
    });

    $('#dropZone').on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).removeClass('drag-over');

        var files = e.originalEvent.dataTransfer.files;
        handleFileUpload(files);
    });

    // Image and file attachment handling
    $('#imagefile').on('change', function (e) {
        var files = e.originalEvent.target.files;
        handleImageUpload(files);
        $('#imagefile').val('');
    });

    $('#otherfile').on('change', function (e) {
        var files = e.originalEvent.target.files;
        handleFileUpload(files);
        $('#otherfile').val('');
    });
});

// Function to handle image uploads
function handleImageUpload(files) {
    if (files.length > 0) {
        var file = files[0];
        if (file.type.match(/image.*/)) {
            // Check image file size (limit to 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Image file is too large. Maximum size is 10MB.');
                return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {
                var imageData = e.target.result;
                // Display image on own screen
                $('#conversation').append(
                    $('<p>').addClass('bubble me').append(
                        $('<b>').text(myUsername + ':'),
                        '<a class="chatLink" href="' + imageData + '"><img src="' + imageData + '"/></a>'
                    )
                );
                scrollTopdown();
                // Send image to server
                socket.emit('user image', imageData);
            };
            reader.onerror = function(error) {
                console.error('Error reading image:', error);
                alert('Error reading image. Please try again.');
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file (JPG, PNG, GIF).');
        }
    }
}

// Function to handle file uploads
function handleFileUpload(files) {
    if (files.length > 0) {
        var file = files[0];
        
        // Check file size (limit to 50MB)
        if (file.size > 50 * 1024 * 1024) {
            alert('File is too large. Maximum file size is 50MB.');
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

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            alert('Unsupported file type. Allowed types: PPTX, PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF');
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var fileData = e.target.result;
            
            // Display file link on own screen with file details
            $('#conversation').append(
                $('<p>').addClass('bubble me').append(
                    $('<b>').text(myUsername + ':'),
                    '<a href="' + fileData + '" download="' + file.name + '">' + 
                    file.name + ' (' + (file.size / 1024).toFixed(2) + ' KB)</a>'
                )
            );
            scrollTopdown();
            
            // Send file to server with more details
            socket.emit('other file', {
                name: file.name,
                type: file.type,
                size: file.size,
                data: fileData
            });
        };

        // Handle read errors
        reader.onerror = function(error) {
            console.error('Error reading file:', error);
            alert('Error reading file. Please try again.');
        };

        reader.readAsDataURL(file);
    }
}

// Function to add user
function addUser() {
    let username = prompt("Enter Your Name!");
    while (!username || username.trim() === "") {
        username = prompt("Username cannot be empty! Please enter a valid name:");
    }
    myUsername = username.trim();
    socket.emit('adduser', myUsername);
}

// Function to process received messages
function processMessage(username, data) {
    if (username && data) {
        if (username === myUsername) {
            $('#conversation').append(
                $('<p>').addClass('bubble me').html('<b>' + username + ':</b> ' + data)
            );
        } else {
            $('#conversation').append(
                $('<p>').addClass('bubble others').html('<b>' + username + ':</b> ' + data)
            );
        }
        scrollTopdown();
    }
}

// Function to update user list
function updateUserList(data) {
    $('#users').empty();
    if (data) {
        $.each(data, function (key, value) {
            $('#users').append('<div>' + key + '</div>');
        });
    }
}

// Function to send message
function sendMessage() {
    var message = $('#data').val().trim();
    $('#data').val('');
    if (message !== "") {
        socket.emit('sendchat', message);
    }
    $('#data').focus();
    scrollTopdown();
}

// Function to handle enter key press
function processEnterPress(e) {
    if (e.which == 13) {
        e.preventDefault();
        $(this).blur();
        $('#datasend').focus().click();
    }
}

// Function to scroll to bottom of conversation
function scrollTopdown() {
    var conversation = document.getElementById('conversation');
    conversation.scrollTop = conversation.scrollHeight;
}