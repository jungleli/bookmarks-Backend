$(function () {

    var page = 1;
    var rows = 10;
    var phrase = "";
    loadData(page, rows, phrase);

    function loadData(page, rows, phrase) {
        var pageData = {
            'page': page || 1,
            'rows': rows || 10,
            'key': phrase || ''
        }
        $.ajax({
            type: 'get',
            data: pageData,
            url: '../query',
            dataType: 'JSON'
        }).done(function (data) {
            var bookmarks = _.chain(data.items)
                .map(function (val, key) {
                    return {
                        id: val._id, title: val.title,
                        url: val.url, created: formatDate(val.created)
                    };
                })
                .sortBy("created")
                .reverse()
                .value();
            var totalItem = data.total;
            var totalPage = Math.ceil(totalItem / rows) || 1;

            updateList(bookmarks, totalItem);
            updatePageNav(totalItem, totalPage, page);
            $("#now").html(page + "/" + totalPage);
            $("#total").html(totalItem);
            page == 1 ? $("#pre").hide() : $("#pre").show();
            page == totalPage ? $("#next").hide() : $("#next").show();
            if (phrase !== '') {
                $(".list *").highlight(phrase, "highlight");
            }
        });
    };

    $("#add").on("click", addDialog);
    $("#close").on("click", addDialog)
    function addDialog() {
        var display = $("#addDialog").css("visibility");
        $("#addDialog").css("visibility",
            display == "visible" ? "hidden" : "visible");
    }

    $('#AddBookmark').on('click', function () {
        var errorCount = 0;
        $('#addDialog input').each(function (index, val) {
            if ($(this).val() === '') {
                errorCount++;
            }
        });
        if (errorCount === 0) {
            var newItem = {
                'title': $('#inputTitle').val(),
                'created': Date.parse(new Date()) / 1000,
                'url': $('#inputURL').val()
            }
            $.ajax({
                type: 'POST',
                data: newItem,
                url: '../add',
                dataType: 'JSON'
            }).done(function (response) {
                if (response.status === 'success') {
                    console.dir(response);
                    alert("success: " + response.msg);
                }
                else {
                    alert('Error: ' + response.msg);
                }
                loadData(page, rows, $("#search").val().trim());
                $('#addDialog input[type=text]').val('');
                $('#close').click();
            });
        }
        else {
            alert("请输入正确的书签名称/书签链接");
            return false;
        }
    });

    $('.list').on('click', 'li a.delete', function () {
        if (confirm("确定删除？")) {
            $.ajax({
                type: 'DELETE',
                url: '../delete/' + $(this).attr('rel')
            }).done(function (response) {
                if (response.status === 'success') {
                    console.dir(response);
                    alert("success: " + response.msg);
                }
                else {
                    alert('Fail: ' + response.msg);
                }
                loadData(page, rows,$("#search").val().trim());
            });
        }
        else {
            return false;
        }
    });

    $('#next').on('click', function () {
        loadData(++page, rows, $("#search").val().trim());
    });

    $('#pre').on('click', function () {
        loadData(--page, rows, $("#search").val().trim());
    });

    $("#search").on('input onchange', function () {
        loadData(page, rows, $(this).val().trim());
    });

    function updateList(bookmarks, total) {
        var compiled = _.template($("#list").html());
        var html = compiled({
            "bookmarks": bookmarks,
            'totalItem': total, 'page': 1
        });
        $(".list").html(html);
    }

    function updatePageNav(totalItem, totalPage) {
        var compiled = _.template($("#pageNav").html());
        var html = compiled({'totalItem': totalItem, 'totalPage': totalPage});
        $('.pageNav').html(html);
        $('.pageNav li').on('click', function () {
            page = $(this).html();
            loadData(page, rows, $("#search").val().trim());
        });
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

    jQuery.fn.highlight = function (phrase, className) {
        var regExp = new RegExp((phrase), "gi");
        return this.each(function () {
            $(this).contents()
                .filter(function () {
                    return this.nodeType == 3 && regExp.test(this.nodeValue);
                })
                .replaceWith(function () {
                    return (this.nodeValue || "")
                        .replace(regExp, function (match) {
                            return "<span class=\"" + className + "\">" + match + "</span>";
                        });
                });
        });
    };
});

