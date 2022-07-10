function register() {
    id = $('.id-el').val();
    pw = $('.pw-el').val();
    if(id == "" || pw == "") {
        alert('아이디와 비밀번호를 정확히 입력해주세요!')
    } else {
    $.ajax({
        type: "POST",
        url: "/api/register",
        data: {id_give: id, pw_give: pw},
        success: function (response) {
            if(response['check'] == 1) {
                alert('회원가입 성공!')
                window.location.replace("/home")
            } else if(response['check'] == 0 ){
                alert('이미 가입한 회원입니다.')
            }
        }
    })
    }
}

function backToMainPage() {
    window.location.replace("/home")
}