$(document).ready(function () {
    show_list();
});

function show_list() {
    $.ajax({
        type: "GET",
        url: "/api/content",
        data: {},
        success: function (response) {
            console.log(response['contents'])
            let rows = response['contents']
            let count = 1;
            for (let i = 0; i < rows.length; i++) {
                let title = rows[i]['title']
                let content = rows[i]['content']
                let userId = rows[i]['userId']
                let objectId = rows[i]['_id']
                let temp_html = `<div class="card text-bg-light mb-3" style="min-width: 45rem; max-width: 45rem;">
                                            <div class="card-header">#${count}</div>
                                            <div class="card-body">
                                             <h2 class="card-title">${title}</h2>
                                             <p class="card-text">${content}</p>
                                             <div class="card-section">
                                                <div class="card-writer">작성자: ${userId}</div>
                                                <button onclick="card_delete('${objectId}')" id="card-dlt-btn" type="button" class="btn btn-danger">삭제</button>
                                             <div>
                                            </div>`
                count += 1;
                $('.card-wrap').prepend(temp_html)
            }
        }
    });
}

function logout() {
    $.removeCookie('mytoken')
    window.location.reload()

}

function show() {
    $('.mypost').slideToggle();
    $('.toggle-btn').text(
        $('.toggle-btn').text() == "등록하기" ? "닫기" : "등록하기"
    )
}

function post() {
    $('.mypost').hide()
    let title = $('#title').val()
    let content = $('#content').val()
    if (title == "" || content == "") {
        alert("제목과 내용을 모두 입력해주세요!")
    } else {

        $.ajax({
            type: 'POST',
            url: '/api/post',
            data: {title_give: title, content_give: content, id_give: '{{id}}'},
            success: function (response) {
                alert(response['msg'])
                window.location.reload()
            }
        })
    }
}

function card_delete(id) {
    $.ajax({
        type: 'POST',
        url: '/api/delete',
        data: {id_give: id, userId_give: '{{id}}'},
        success: function (response) {
            alert(response['msg'])
            if (response['check'] == 1) {
                window.location.reload()
            }
        }
    })

}