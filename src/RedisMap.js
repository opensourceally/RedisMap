class RedisMap extends Map {
  constructor(publisher, subscriber, channel, publishMode) {
    super();
    this.publisher = publisher;
    this.subscriber = subscriber;
    this.channel = channel;
    this.publishMode = publishMode;
    this.subscribe();
    this.populateMapFromRedis();
  }

  populateMapFromRedis() {
    var self = this;

    let selfpublisher = this.publisher;

    selfpublisher.hgetall(this.channel, function (err, res) {
      if (!err) {
        //console.log("getResult = ", res);
        var publishModeTemp = self.publishMode;
        self.publishMode = false;
        var arr = Object.entries(res);
        for (let i = 0; i < arr.length; i += 2) {
          //console.log(arr[i]);
          self.set(arr[i][0], arr[i][1]);
        }
        self.publishMode = publishModeTemp;
      }
    });
  }
  get(key) {
    return super.get(key);
  }

  set(key, value) {
    super.set(key, value);
    var self = this;
    if (this.publisher && this.publishMode) {
      this.publisher.hmset(this.channel, key, value);
      this.publisher.publish(this.channel, key);
    }

  }

  getPublisher() {
    return publisher;
  }
  setPublisher(publisher) {
    this.publisher = publisher;
  }

  getSubscriber() {
    return this.subscriber;
  }
  setSubscriber(subscriber) {
    this.subscriber = subscriber;
  }

  getChannel() {
    return this.channel;
  }
  setChannel(channel) {
    this.channel = channel;
  }
  setPublishMode(publishModeFlag) {
    this.publishMode = publishModeFlag;
  };
  subscribe() {
    var self = this;
    if (this.subscriber) {
      let selfpublisher = this.publisher;
      this.subscriber.subscribe(this.channel, function (err, count) {
        //console.log(err, count);
      });
      this.subscriber.on('message', function (channel, message) {
        //console.log('Receive message %s from channel %s', message, channel);
        selfpublisher.hget(channel, message, function (err, res) {
          if (!err) {
            console.log("getResult = ", res);
            var publishModeTemp = self.publishMode;
            self.publishMode = false;
            self.set(message, res);
            self.publishMode = publishModeTemp;
          }
        });
      });
    }
  }

}
exports.RedisMap = RedisMap;