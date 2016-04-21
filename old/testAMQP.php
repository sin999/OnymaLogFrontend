#!/usr/bin/php
<?php
date_default_timezone_set('UTC');
require_once __DIR__ . '/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Channel\AMQPChannel;
use PhpAmqpLib\Exchange\AMQPExchange;
use PhpAmqpLib\Message\AMQPMessage;
$queue = "myqueue";
$exchange="myexchange";
/**
    * Create a connection to RabbitAMQP
*/
$connection = new AMQPConnection(
    'localhost',    #host - host name where the RabbitMQ server is runing
    5672,           #port - port number of the service, 5672 is the default
    'guest',        #user - username to connect to server
    'guest'         #password
);
/*
$channel = new AMQPChannel($connection);
$exchange = new AMQPExchange($channel);
*/

$ch = $connection->channel();
$ch->queue_declare($queue, false, true, false, false);

$ch->exchange_declare($exchange, 'direct', false, true, false);

$ch->queue_bind($queue, $exchange);
#$msg_body = implode(' ', array_slice($argv, 1));
$msg_body = "test message ". date('l jS \of F Y h:i:s A');
$msg = new AMQPMessage($msg_body, array('content_type' => 'text/plain', 'delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT));
$ch->basic_publish($msg, $exchange);
$ch->close();
$connection->close();




echo "tested ok";
?>
