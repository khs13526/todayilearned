function register() {
    id = $('.id-el').val();
    pw = $('.pw-el').val();
    $.ajax({
        type: "POST",
        url: "/api/register",
        data: {id_give: id, pw_give: pw},
        success: function (response) {
            console.log(response)
            alert('회원가입 성공!')
            window.location.replace("/home")
        }
    })
}

function backToMainPage() {
    window.location.replace("/home")
}