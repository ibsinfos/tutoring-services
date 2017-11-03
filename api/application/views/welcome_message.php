 <html>
    <head>
      <script src="http://code.jquery.com/jquery-1.11.0.min.js" type="text/javascript"></script> 
    </head>
    <body>
        <form id="customer" method="post" action="http://www.findus.an.cisinlive.com/findusapp/api/admin-save-slide" enctype="multipart/form-data">
            clientID : - <input type="text" value=""   name="client_id"></br>
            website : - <input type="text"  name="website"></br>
            message: - <input type="text" name="message"></br>
            qr_logo: - <input type="file" name="image"></br>
            number: - <input type="text" name="number"></br>
            max_count: - <input type="text" name="max_count"></br>
            has_bepoz: - <input type="text" name="has_bepoz"></br>
            has_maillist: - <input type="text" name="has_maillist"></br>
            slide id: - <input type="text" name="slide_id"></br>
            <input type="submit" value="submit" onclick="data()">
        </form>
    </body>

</html>
 
 
<!--  <html>
    <head>
      <script src="http://code.jquery.com/jquery-1.11.0.min.js" type="text/javascript"></script> 
    </head>
    <body>
        <form id="customer" method="post">
            name : - <input type="text" value=""   name="name"></br>
            website : - <input type="text"  name="website"></br>
            email: - <input type="text" name="email"></br>
            pass: - <input type="text" name="password"></br>
            cpass: - <input type="text" name="cpassword"></br>
            <input type="button" value="submit" onclick="data()">
        </form>
    </body>
    <script>
        function data() {
            $.post("http://www.findus.an.cisinlive.com/findusapp/api/registration", $('form#customer').serialize(), function (data) {
            });
        }
    </script>

</html>-->
 
<br>
<br>
<br>
<!--<html>
    <head>
      <script src="http://code.jquery.com/jquery-1.11.0.min.js" type="text/javascript"></script> 
    </head>
    <body>
        <form id="login" method="post">
            email : - <input type="text" value=""   name="email"></br>
            pass : - <input type="text"  name="password"></br>
            <input type="hidden" value="1"    name="user_type">
            <input type="hidden" value="1"    name="user_id">
            <input type="button" value="submit" onclick="data()">
        </form>
    </body>
    <script>
        function data() {
            $.post("http://www.findus.an.cisinlive.com/findusapp/api/login", $('form#login').serialize(), function (data) {
            });
        }
    </script>

</html>-->
<!--
<html>
    <head>
      <script src="http://code.jquery.com/jquery-1.11.0.min.js" type="text/javascript"></script> 
    </head>
    <body>
        <form id="login" method="post">
            slide id: - <input type="text" value=""   name="slide_id"></br>
            status: - <input type="text" value=""   name="status"></br>
                        <input type="button" value="submit" onclick="data()">
        </form>
    </body>
    <script>
        function data() {
            $.post("http://www.findus.an.cisinlive.com/findusapp/api/admin-change-status", $('form#login').serialize(), function (data) {
            });
        }
    </script>

</html>-->

<!-- <html>
    <head>
      <script src="http://code.jquery.com/jquery-1.11.0.min.js" type="text/javascript"></script> 
    </head>
    <body>
        <form id="profile_update" method="post">
            profile_id : - <input type="text" value=""   name="profile_id"></br>
            fname : - <input type="text"  name="fname"></br>
            lname: - <input type="text" name="lname"></br>
            city: - <input type="text" name="city"></br>
            phone: - <input type="text" name="phone"></br>
            gender: - <input type="text" name="gender"></br>
            address: - <input type="text" name="address"></br>
            <input type="button" value="submit" onclick="data()">
        </form>
    </body>
    <script>
        function data() {
            $.post("http://www.findus.an.cisinlive.com/findusapp/api/admin-update-profile", $('form#profile_update').serialize(), function (data) {
            });
        }
    </script>
    
</html>-->