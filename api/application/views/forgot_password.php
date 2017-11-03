<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>AdminLTE 2 | Password</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <link rel="stylesheet" href="<?php echo base_url('../vendor/AdminLTE/bootstrap/css/bootstrap.min.css'); ?>">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
        <link rel="stylesheet" href="<?php echo base_url('../vendor/AdminLTE/dist/css/AdminLTE.css'); ?>">
        <link rel="stylesheet" href="<?php echo base_url('../vendor/AdminLTE/plugins/iCheck/square/blue.css'); ?>">
    </head>
    <body class="hold-transition login-page">
        <div class="login-box">
            <div class="login-logo">
                <b>Reset </b>Password
            </div>
            <!-- /.login-logo -->
            <div class="login-box-body">
                <p class="login-box-msg">Get new password</p>

                <form id="myForm" action="<?php echo base_url('update-password'); ?>" method="post">
                    <input type="hidden" id="created" name="created" value="<?php echo base64_encode($email);?>" />
                    <input type="hidden" id="forget_token" name="forget_token" value="<?php echo $forget_token;?>" />
                    
                    <div class="form-group has-feedback">
                        <input id="password" name="password" type="password" class="form-control" placeholder="New password">
                        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                        <span id="pas" style="color:red;"></span>
                    </div>
                    <div class="form-group has-feedback">
                        <input id="repass" name="repass" type="password" class="form-control" placeholder="Confirm password">
                        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                        <span id="confirmpass" style="color:red;"></span>
                        <span id="confirm" style="color:red;"></span>
                    </div>

                    <div class="row">
                        <!-- /.col -->
                        <div class="col-xs-4">
                            <input type="button" onclick="submitForm()" class="btn btn-primary btn-block btn-flat" value="Submit" />
                        </div>
                        <!-- /.col -->
                    </div>
                </form>
            </div>
            <!-- /.login-box-body -->
        </div>
        <!-- /.login-box -->
    </body>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script type="text/javascript">
                                function submitForm() {
                                    var validform = validate();
                                    if (validform == '1') {
                                        $('#myForm').submit();
                                    } else {
                                        return false;
                                    }
                                }

                                function validate() {
                                    var pass = $('#password').val();
                                    var repass = $('#repass').val();
                                    var foo = 1;

                                    if (pass == '' || repass == '') {
                                        $('#confirmpass').text('All fields required!');
                                        foo = 0;
                                    } else if(pass.length < 6 ){
                                        $('#pas').text('Minimum password length should be 6 character!');
                                        foo = 0;
                                    } else {
                                        $('#pas').text('');
                                        $('#confirmpass').text('');
                                        if (pass != repass) {
                                            $('#confirm').text('Password mismatch!');
                                            foo = 0;
                                        } else {
                                            foo = 1;
                                        }
                                    }
                                    return foo;

                                }

                               
    </script>


</html>
