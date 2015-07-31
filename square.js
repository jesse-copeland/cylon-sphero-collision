"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    sphero: { adaptor: "sphero", port: "/dev/tty.Sphero-OGG-RN-SPP" }
  },

  devices: {
    sphero: { driver: "sphero" }
  },

  work: function(bot) {
    var color = 0x00FF00,
        bitFilter = 0xFFFF00,
        heading = 0;

    after((5).seconds(), function() {
      console.log("Setting up Collision Detection...");
      bot.sphero.detectCollisions();
      bot.sphero.setRGB(color);
      bot.sphero.stop();
      console.log("Collisions ready.");
      bot.sphero.roll(90, 0);
    });

    bot.sphero.on("collision", function() {
      console.log("Collision:");
      color = color ^ bitFilter;
      console.log("Color: " + (color.toString(16)) + " ");
      bot.sphero.setRGB(color);
      heading = validHeading(heading - Math.floor((Math.random() * 30) + 150));
      console.log("New heading: " + heading);
      
    });

    every((1).second(), function () {
      bot.sphero.roll(90, heading);
    });
  }
}).start();

function validHeading (heading) {
  if (heading < 0) {
    return 360 + heading;
  }
  return heading;
}