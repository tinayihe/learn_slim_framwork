<?php

require 'plugins/NotORM.php';
require 'vendor/autoload.php';

$app = new \Slim\Slim();

/* Database Configuration */
$dbhost   = 'localhost';
$dbuser   = 'root';
$dbpass   = '';
$dbname   = 'garage';
$dbmethod = 'mysql:dbname=';

$dsn = $dbmethod.$dbname;
$pdo = new PDO($dsn, $dbuser, $dbpass);
$app->db = new NotORM($pdo);

$app->get('/', function(){
  echo 'Home - My Slim Application';
});

//get cars
$app->get('/cars', function() use($app){
  $app->response->headers->set("Content-Type","application/json");
  echo resCars($app->db->cars());
});

//get cars
$app->get('/cars/:make', function($make) use($app){
  $app->response->headers->set("Content-Type","application/json");
  echo resCars($app->db->cars()->where('make', $make));
});

function resCars($cars){
  $out = array();
  foreach ($cars as $car) {
    $out[] = array(
      'id'    => $car['id'],
      'year'  => $car['year'],
      'make'  => $car['make'],
      'model' => $car['model']
    );
  }
  return json_encode($out, JSON_FORCE_OBJECT);
}

//Get a single car
$app->get('/cars/:id', function($id) use($app){
  $app->response->headers->set("Content-Type", "application/json");
  $car = $app->db->cars()->where('id', $id);
  if ($data = $car->fetch()) {
    echo json_encode(array(
      'id' => $data['id'],
      'year' => $data['year'],
      'make' => $data['make'],
      'model' => $data['model']
    ));
  } else {
    echo json_encode(array(
     'status' => false,
     'message' => "Car ID $id does not exist"
    ));
  }
});

//Add a new car
$app->post('/car',function() use($app){
  $app->response->headers->set("Content-Type","application/json");
  $car = $app->request()->post();
  $result = $app->db->cars->insert($car);
  echo json_encode(array('id' => $result['id']));
});

//Update a car
$app->put('/car/:id',function($id) use($app){
  $app->response->headers->set("Content-Type", "application/json");
  $car = $app->db->cars()->where('id', $id);
  if ($car->fetch()) {
    $post = $app->request()->put();
    $result = $car->update($post);
    echo json_encode(array(
      'status' => (bool)$result,
      'message' => "Car updated successfully"
    ));
  } else {
    echo json_encode(array(
      'status' => false,
      'message' => "Car id $id does not exist"
    ));
  }
});

//remove a car
$app->delete('/car/:id',function($id) use($app){
  $app->response->headers->set("Content-Type","application/json");
  $car = $app->db->cars->where('id',$id);
  if ($car->fetch()) {
    $result = $car->delete();
    echo json_encode(array(
      'status' => (bool)$result,
      'message' => "Car deleted successfully"
    ));
  } else {
    echo json_encode(array(
      'status' => false,
      'message' => "Car id $id does not exist"
    ));
  }
});

$app->run();