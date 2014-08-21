var noteInfo;
var notes = [];

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    getAllNotes();
}

$(document).bind("pagechange", onPageChange);

function getAllNotes() {

    $.ajax({
        type: "POST",
        url: "http://loiane.local/test/server/lista.php",
        contentType: "application/json",
//        data: JSON.stringify({
//            name: "Tricia",
//            age: 37
//        }),
        dataType: "text",
        success: function( response ){

            //console.log(response);

            notes = jQuery.parseJSON(response).notes;

            $('#noteList').empty();

            for(var i=0; i<notes.length; i++) {
                var note = notes[i];
                $('#noteList').append('<li id="' + note.id + '"><a href="#note-info">' + note.name + '</a></li>');
            }

            $("#noteList").listview().trigger("create");

            $('#noteList').listview("refresh");

        },
        error: function( error ){
            alert( "ERROR " + error);
            console.log(error);
        }
    });
}

$(document).on('click', '#noteList li', function(){
    var selectedID = $(this).attr('id');
    getNoteByID(selectedID);
});

function findNote(id){
    for(var i=0; i<notes.length; i++) {
        if (parseInt(notes[i].id) === parseInt(id)){
            return notes[i];
        }
    }
    return null;
}

function getNoteByID(selectedID) {
    noteInfo = findNote(selectedID);
    $.mobile.changePage($('#details'));
}

function onPageChange(event, data) {
    var toPageId = data.toPage.attr("id");
    switch (toPageId) {
        case 'details':
            listNoteById(noteInfo);
            break;
        case 'edit':
            clearValues();
            if (noteInfo !== null){
                editNoteById(noteInfo);
            }
            break;
    }
}

function listNoteById(note){
    $('#details_header h1').html(note.name);
    $('#note_content #noteDesc').html(note.desc);
    $('#note_content #noteId').html(note.id);
}

function clearValues() {
    $('#edit_content #noteId').val('');
    $('#edit_content #noteName').val('');
    $('#edit_content #noteDesc').val('');
}

function editNoteById(note){
    if (note){
        $('#edit_content #noteId').val(note.id);
        $('#edit_content #noteName').val(note.name);
        $('#edit_content #noteDesc').val(note.desc);
    }
}

$("#home #add").bind("click", function(){
    noteInfo = null;
    $.mobile.changePage($('#edit'));
});

$("#details_header #add").bind("click", function(){
    $.mobile.changePage($('#edit'));
});

$("#save").bind("click", function(){

    var newNote = {};
    newNote.id = $('#edit_content #noteId').val();

    if (newNote.id === ''){
        add(newNote);
    } else {
        edit(newNote);
    }
    getAllNotes();

    $.mobile.changePage($('#home'));
    $('#noteList').listview("refresh");

});

function add(newNote){
    newNote.name = $('#edit_content #noteName').val();
    newNote.desc = $('#edit_content #noteDesc').val();

    $.ajax({
        type: "POST",
        url: "http://loiane.local/test/server/cria.php",
        contentType: "application/json",
        data: JSON.stringify({
            name: newNote.name,
            desc: newNote.desc
        }),
        dataType: "text",
        success: function( response ){

            var success = jQuery.parseJSON(response).success;

        },
        error: function( error ){
            alert( "ERROR");
        }
    });

}

function edit(newNote){

    newNote = findNote(newNote.id);
    newNote.name = $('#edit_content #noteName').val();
    newNote.desc = $('#edit_content #noteDesc').val();

    $.ajax({
        type: "POST",
        url: "http://loiane.local/test/server/atualiza.php",
        contentType: "application/json",
        data: JSON.stringify({
            id: newNote.id,
            name: newNote.name,
            desc: newNote.desc
        }),
        dataType: "text",
        success: function( response ){

            var success = jQuery.parseJSON(response).success;

        },
        error: function( error ){
            alert( "ERROR");
        }
    });

}

getAllNotes();