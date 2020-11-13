<?php

/*

A simple PHP database connection example.
by Addyh

mysqli commands manual:
http://php.net/manual/en/book.mysqli.php

*/

$host = "db";
$user = "wiki";
$pass = "YqKOnYOXGrHaUqFU";
$db = "wiki";
$table = "projects";

$con = new mysqli($host, $user, $pass, $db);
if ($con->connect_error) {
  die("Connection failed: {$con->connect_error}");
}

// Show best score only
$query = "SELECT * FROM {$table};";
$result = $con->query($query);

if ($result) {
  $projects = $result->fetch_all(MYSQLI_ASSOC);
  $result->free();
}
else {
  die("No result: {$con->error}");
}

foreach ($projects as $project) {

  $name = $project['name'];
  $id = $project['id'];
  $status = $project['status'];
  $subject = $project['subject'];

  print("<pre>

  Project Name: {$name}
  ID:           {$id}
  Status:       {$status}
  Subject:      {$subject}

  </pre>");


}

// close mysql connection
$con->close();

?>