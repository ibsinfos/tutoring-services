<html>
    <head>
      <script src="http://code.jquery.com/jquery-1.11.0.min.js" type="text/javascript"></script> 
    </head>
    <body>
        <form id="customer" method="post">
            email : - <input type="text" value=""   name="email"></br>
            pass : - <input type="text"  name="password"></br>
            <input type="hidden" value="1"    name="user_type">
            <input type="hidden" value="1"    name="user_id">
            <input type="submit" value="submit" onclick="data()">
        </form>
    </body>
    <script>
        function data() {
            $.post("http://www.findus.an.cisinlive.com/findusapp/api/login", $('form#customer').serialize(), function (data) {
            });
        }
    </script>

</html>