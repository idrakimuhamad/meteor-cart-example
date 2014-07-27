// Publish Items collection
Meteor.publish("items", function () {
  return Items.find({});
});

// Add items
Meteor.startup(function () {
  if (Items.find().count() == 0) {
    var games = [{
      itemName: "The Last of Us",
      imageURL: "/images/lastofus.jpg",
      price: "69.90",
      description: "Joel, a ruthless survivor with few moral lines left to cross, lives in one of the last remaining Quarantine Zones. These walled-off, oppressive cities are run by what’s left of the military. Despite the strict martial law, Joel operates in the black market of the city, smuggling contraband for the right price."
    }, {
      itemName: "FIFA 15",
      imageURL: "/images/fifa15.png",
      price: "59.90",
      description: "For the first time ever, players have memories and will show emotion based on the context of the match. With over 600 new emotional reactions, players now respond to pivotal moments on the pitch – bad tackles, missed chances, epic goals - as they would in real life."
    }, {
      itemName: "Grand Theft Auto V",
      imageURL: "/images/gtav.png",
      price: "59.90",
      description: "Los Santos: a sprawling sun-soaked metropolis full of self-help gurus, starlets and fading celebrities, once the envy of the Western world, now struggling to stay afloat in an era of economic uncertainty and cheap reality TV."
    }, {
      itemName: "Destiny",
      imageURL: "/images/destiny.jpg",
      price: "69.90",
      description: "In Destiny you are a Guardian of the last city on Earth, able to wield incredible power. Explore the ancient ruins of our solar system, from the red dunes of Mars to the lush jungles of Venus. Defeat Earth’s enemies. Reclaim all that we have lost. Become legend."
    }, {
      itemName: "Little Big Planet 3",
      imageURL: "/images/lbp3.jpg",
      price: "59.90",
      description: "Sackboy® is back − and he’s brought along new friends! PlayStation’s most imaginative franchise, LittleBigPlanet™, is back with a new cast of playable plush characters in the biggest handcrafted adventure yet!"
    }, {
      itemName: "The Order 1886",
      imageURL: "/images/order.jpg",
      price: "59.90",
      description: "The Order: 1886™ introduces players to a unique vision of Victorian-Era London where Man uses advanced technology to battle a powerful and ancient foe.  As Galahad, a member of an elite order of Knights, join a centuries-old war against a powerful threat that will determine the course of history forever in this intense third-person action-adventure shooter, available exclusively on the PlayStation®4 system."
    }];

    _.each(games, function(el, index) {
      Items.insert({
        itemName: el.itemName,
        imageURL: el.imageURL,
        price: el.price,
        description: el.description
      });
    });
  }
});
