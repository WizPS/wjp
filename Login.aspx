<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Login.aspx.cs" Inherits="Login" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Signin</title>

    <!-- Bootstrap core CSS -->

    <link href="Content/bootstrap.min.css" rel="stylesheet" />
    <!-- Custom styles for this template -->
    <link href="Content/signin.css" rel="stylesheet" />

    <script src="jquery/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="easyui/jquery.easyui.min.js?"></script>

</head>

<body class="text-center">
    <form id="ff" class="form-signin" method="post">
		 <h1 class="h3 mb-3 font-weight-normal"><%=message() %></h1>
        <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
        <div id="msgOK"></div>
        <label for="inputUser" class="sr-only">User</label>
        <input type="text" name="user" id="inputUser" class="form-control" placeholder="User" required autofocus>
        <div id="msgUser"></div>
        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" name="pw" id="inputPassword" class="form-control" placeholder="Password" required>
        <div id="msgPw"></div>

			<label for="inputClient" class="sr-only">Client</label>
			<input type="text" name="client" value="100" id="inputClient" class="form-control" placeholder="Client" required>
			<input type="hidden" name="action" value="login" id="inputAction">

        <div class="checkbox mb-3" style="margin-bottom:20px">
            <label for="rememberme" class="textbox-label">Remember me:</label>
            <input id="rememberme" type="checkbox" name="rememberme" value="true" checked>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        <p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
        
    </form>
    
    <script>
		 var gPermissions;
        $('#ff').form({
            url:"Login.aspx"
            , onSubmit: function(){
                // do some check
                // return false to prevent submit;
            }
            , success: function (result) {
                // alert(result);
                var result = eval('(' + result + ')');
                // alert(result.fail);
                if (result.sucsess) {
                    $("#msgOK").hide().html("<font color='green'>Welcome!</font>").slideDown('slow').delay(1500);
						  setTimeout(function () {
                       window.location.href = "wal/Default.aspx";
                    }, 500);
                }
                if (result.failUser)
                {
                    $("#msgUser").hide().html("<font color='red'>" + result.failUser+"</font>").slideDown('slow').delay(1000).slideUp('slow');
                }
                if (result.failPW)
                {
                    $("#msgPw").hide().html("<font color='red'>" + result.failPW + "</font>").slideDown('slow').delay(1000).slideUp('slow');
                }
            }
        });
    </script>
</body>
</html>