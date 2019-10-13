<?php 
$action = filter_input(INPUT_POST, 'action');
if ($action == NULL)
{
    $action = filter_input(INPUT_GET, 'action');
    if ($action == NULL)
    {
        $action = 'home';
    }
}
session_start([
  'cookie_lifetime' => 86400//limit voting once a day
]);
//$_SESSION["name"]="Kevin";
//unset ($_SESSION["cart"]);//=array();

switch($action)
{
  case 'home':
    header('Location: view/poll.html');
    break;

  case 'login':
    $pass=($_POST['pass']);

    $file=fopen('model/admin.txt','r');
    if(fgets($file)===$pass)
    {
      echo 1;
    }
    fclose($file);
    break;

  case 'load':
    //echo json_encode(
      $data=json_decode(file_get_contents('model/currPoll.json'),true);
      if(isset($_SESSION['voted']))
      {
        $data['voted']=1;
      }
      echo json_encode($data);
    break;

  case 'new':
    $data=$_POST['data'];
    $data=json_encode($data);
    file_put_contents('model/currPoll.json',$data);
    echo 1;
  /*
    $file=fopen('model/currPoll.json','r');
    fwrite($file,'{}');
    fclose($file);
  */
    break;

  case 'submit':
    $data=json_decode(file_get_contents('model/currPoll.json'),true);
    if(isset($_POST['add']))
    {
      $_SESSION['voted']=1;
      $data['candidates'][$_POST['add']]+=1;
      $data["total"]+=1;
      $data=json_encode($data);
      file_put_contents('model/currPoll.json',$data);
      //remind: chmod 777 currPoll.json
      echo $data;
    }
    break;
}
?>