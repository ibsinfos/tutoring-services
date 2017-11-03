<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Email</title>
</head>

<body>
<table border="0" cellspacing="0" cellpadding="0" align="center" style="background:#fff; width:600px;">
  <tbody>
    <tr>
      <td align="center"  style="padding:15px; border-bottom:solid 1px #eee; background:#eee;"><a href="index.html"><img src="<?php echo base_url(); ?>images/findusdealslogo.png" width="283" height="56" alt=""/></a></td>
    </tr>
    <tr>
      <td style="background-image:url(<?php echo base_url(); ?>images/banner.jpg); background-repeat:no-repeat; width:100%; height:300px; text-align:center;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%; height:100%; background-color:rgba(0,0,0,0.4);">
          <tbody>
            <tr>
              <td align="center" valign="middle"><h3 style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; color:#fff; font-size:28px;font-weight:bold; margin:0 0 15px 0px; padding:0px;">FindUs - ScanUs - KeepUs</h3>
                <p style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; color:#fff; font-size:18px; font-weight:bold; margin:0px; padding:0px;">Your One Stop App</p>
                <!-- <a href="javascript:void(0)" style="border-radius:5px; padding:8px 16px; margin:15px 0 15px 0px; display:inline-block; background:#ff5722; color:#fff; font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size:14px; text-decoration:none; font-weight:bold;"> Find Us </a> --></td>
            </tr>
          </tbody>
        </table></td>
    </tr>
    <tr>
      <td style="padding:20px; background:#f5f5f5;"><p style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height:20px; margin:0 0 10px 0px;  padding:0;  font-size:22px; color:#fb765b; font-weight:bold;">Hi <?php echo $name; ?></p>
<!--         <p style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height:20px; margin:0 0 15px 0px;  padding:0;  font-size:18px; color:#444; font-weight:bold;">Please verify your Email address</p> -->
        <p style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height:22px; margin:0 0 15px 0px; padding:0; font-size:14px; color:#333; font-weight:normal;color: #FF0000;"> To enable you to send push notifications you will first need to verify your email address. Once verified you can then log into: findusapp.co.nz.</p>

        <p style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height:22px; margin:0 0 15px 0px; padding:0; font-size:14px; color:#333; font-weight:normal;"> Your email id is : <?php echo '<b>'.$email .'</b> / and Passowrd:  <b>'. $password.'</b>'; ?></p>
      
        
        <a href="<?php echo base_url('/activate-client') . '/' . base64_encode($email); ?>" style="border-radius:5px; padding:8px 16px; margin:10px 0 15px 0px; display:inline-block; background:#ff5722; color:#fff; font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size:14px; text-decoration:none; font-weight:bold; cursor: pointer;"> Verify Your Email </a>

        <p style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height:20px; margin:0 0 15px 0px;  padding:0;  font-size:12px; color:#444; font-weight:bold;">The FindUs Team</p>
        </td>
    </tr>
    <tr>
      <td style="text-align:center; border-top:solid 1px #eee; padding:15px; background:#eee; "><p style="font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height:22px; margin:0px 0 5px 0px; padding:0; font-size:14px; color:#666; font-weight:normal;"> <span style="display:block;">&copy; Find Us Limited, Email: info@findus.co.nz </span>www.findus.co.nz  </p></td>
    </tr>
  </tbody>
</table>
</body>
</html>
