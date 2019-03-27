# RedisMap
Extension of ES6 Map with Redis Pub Sub

const Redis = require('ioredis');

// create and connect redis client to local instance.
var redis = new Redis({
  port: 6379,         
  host: '127.0.0.1',
  family: 4,
  //password: 'auth',
  db: 0
  
})

var subscriber = new Redis({
  port: 6379,          
  host: '127.0.0.1',
  family: 4,
  //password: 'auth',
  db: 0
  
})

var RedisMap = require("redismap").RedisMap;

let channel = "TestRedisChannel";

setTimeout(() => {test(channel)},100);

var test = function (channel) {
  let publishMode = false;
  var myMap = new RedisMap(redis,subscriber,channel,publishMode);
  console.log(myMap.get("neopras81@gmail.com"));
}
