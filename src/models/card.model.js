const Card = require("../mongos/card.mongo");

async function saveCard(card) {
  await Card.findOneAndUpdate(
    {
      cvv: card["cvv"],
      expired: card["expired"],
      note: card["note"],
      card_number: card["card_number"],
    },
    card,
    {
      upsert: true,
    }
  );
}

module.exports = {
  saveCard,
};
