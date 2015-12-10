$(function () {
    // var bookmarks = [];

    var page = 1;
    var rows = 10;
    loadData(page, rows);


     function loadData(page, rows,phrase) {
  
        var pageData = {
            'page': page,
            'rows': rows,
            'key' : phrase
        }
        $.ajax({
            type: 'get',
            data: pageData,
            url: '../query',
            dataType: 'JSON'
        })
        .done(function (data) {

            var regExp = new RegExp((phrase), "gi");
            // if (data.msg === '') {
                var bookmarks = _.chain(data.items)
                .map(function (val, key) {
                    return {id: val._id,title: val.title, 
                            url: val.url, created: formatDate(val.created)};
                })
                .sortBy("created")
                .reverse()
                .value();
                var totalItem = data.total;
                var totalPage = Math.ceil(totalItem/rows) || 1;

        
            updateList(bookmarks,totalItem);
            updatePageNav(totalItem,totalPage,page);
            $("#now").html(page+"/" + totalPage);
            $("#total").html(totalItem);
            page == 1? $("#pre").hide():$("#pre").show();
            page == totalPage? $("#next").hide():$("#next").show()

            $(".list *").highlight(regExp, "highlight");
            
                // location.href = "../index.html";
            // }
            // else {
            //     alert('Error: ' + data.msg);
            // }

            
        });
    };


$('#next').on('click', next);

$('#pre').on('click', pre);

    function pre(){
        loadData(--page,rows,$("#search").val().trim());
    }

    function next(){
        loadData(++page,rows,$("#search").val().trim());
    }


    $("#search").on('input onchange', function () {
        loadData(page,rows,$(this).val().trim());
    });

    function updateList(bookmarks, total) {
        var compiled = _.template($("#list").html());
        var html = compiled({"bookmarks": bookmarks,
            'totalItem': total,'page':1});

        $(".list").html(html);
    }

    function updatePageNav(totalItem,totalPage){
        var compiled = _.template($("#pageNav").html());
        var html = compiled({'totalItem': totalItem,'totalPage': totalPage});
        $('.pageNav').html(html);

        $('.pageNav li').on('click', function(){
            page = $(this).html();
            loadData(page,rows,$("#search").val().trim());
         });

    }
    //function gotoPage(page){
    //    //page = $(this).html();
    //    loadData(page,rows,$("#search").val().trim());
    //}


    function filterData(data, regex) {
        return _.chain(data)
            .filter(function (val, key) {
                return val.title.match(regex);
            })
            .value();
    }

    function getTotalNum(obj){
        return _.chain(obj)
                .value()
                .length;
    }
    
function formatDate(date) {
    var time = new Date(parseInt(date) * 1000);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    month = month > 10 ? month : '0' + month;
    var day = time.getDay();
    day = day > 10 ? day : '0' + day;
    return year + '-' + month + '-' + day;
}
jQuery.fn.highlight = function (regex, className) {
    return this.each(function () {
        $(this).contents()
            .filter(function () {
                return this.nodeType == 3 && regex.test(this.nodeValue);
            })
            .replaceWith(function () {
                return (this.nodeValue || "")
                    .replace(regex, function (match) {
                        return "<span class=\"" + className + "\">" + match + "</span>";
                    });
            });
    });
};

});


$("#add").on("click",overlay);
function overlay() {
    var display = $("#overlay").css("visibility");
    $("#overlay").css("visibility",
        display =="visible" ? "hidden" : "visible");

}

  //$("#add").on('click',function(){
  //
  //  window.open("../addBookmark.html")
  //      // location.href = "../addBookmark.html";
  //  });

$('#AddBookmark').on('click', addBookmark);


// Add User
function addBookmark() {
    //event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addBookmark input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'title': $('#inputTitle').val(),
            'created': Date.parse(new Date())/1000,
            'url': $('#inputURL').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '../add',
            dataType: 'JSON'
        }).done(function( response ) {

            if (response.status === 'success') {
                console.dir(response);
                alert("success: " + response.msg);
            }
            else {
                alert('Error: '+ response.msg );
            }
            location.href = "../index.html";


        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};


$('.list').on('click', 'li a.delete', deleteBookmark);


// Delete User
function deleteBookmark(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm("È·¶¨É¾³ý");

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            // type: 'get',
            // url: '../delete',
            // data: $(this).attr('rel'),

            type: 'DELETE',
            url: '../delete/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.status === 'success') {
                console.dir(response);
                alert("success: " + response.msg);
            }
            else {
                alert('Error: '+ response.msg );
            }

            // Update the table
            location.href = "../index.html";

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

