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
                let insertTime =rows[i]['insertTime']
                let temp_html = `<div class="card text-bg-light mb-3" style="min-width: 45rem; max-width: 45rem;">
                                            <div class="card-header">#${count}</div>
                                            <div class="card-body">
                                             <h2 class="card-title">${title}</h2>
                                             <p class="card-text">${content}</p>
                                             <div class="card-section">
                                                <div>
                                                    <div class="card-writer">작성자: ${userId}</div>
                                                    <div class="card-time">작성날짜: ${insertTime}</div>
                                                </div>
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
    let date = new Date();
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let time = new Date();
    let hours = ('0' + time.getHours()).slice(-2);
    let minutes = ('0' + time.getMinutes()).slice(-2);
    let seconds = ('0' + time.getSeconds()).slice(-2);
    let insertTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    console.log(insertTime)
    if (title == "" || content == "") {
        alert("제목과 내용을 모두 입력해주세요!")
    } else {
        $.ajax({
            type: 'POST',
            url: '/api/post',
            data: {title_give: title, content_give: content, id_give: userId, insertTime_give: insertTime},
            success: function (response) {
                alert(response['msg'])
                window.location.reload()
            }
        })
    }
}

function card_delete(id) {
    if(confirm('삭제하시겠습니까?')){
    $.ajax({
        type: 'POST',
        url: '/api/delete',
        data: {id_give: id, userId_give: userId},
        success: function (response) {
            alert(response['msg'])
            if (response['check'] == 1) {
                window.location.reload()
            }
        }
    })
    }
    else {
        alert('취소하셨습니다.')
    }

}