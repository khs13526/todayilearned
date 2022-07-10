function login() {
    id = $('.id-el').val();
    pw = $('.pw-el').val();
    $.ajax({
        type: "POST",
        url: "/api/login",
        data: {id_give: id, pw_give: pw},
        success: function (response) {
            if (response['result'] == 'fail') {
                alert(response['msg'])
            }
            if (response['result'] == 'success') {
                let access_token = response['token']
                $.cookie('mytoken', access_token, {path: '/'})
                window.location.replace("/main")
            }
        }
    })
}

function goRegisterPage() {
    window.location.replace("/register")
}