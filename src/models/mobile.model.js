const Mobile = require("../mongos/mobile.mongo");

async function AddMobile(
  network,
  network_number,
  price,
  mobile_code,
  quantity,
  transaction_fee,
  total,
  username,
  fullname,
  status
) {
  await Mobile.findOneAndUpdate(
    {
      mobile_code: mobile_code,
      username: username,
    },
    {
      network: network,
      network_number: network_number,
      price: price,
      quantity: quantity,
      transaction_fee: transaction_fee,
      total: total,
      username: username,
      fullname: fullname,
      status: status,
    },
    {
      upsert: true,
    }
  );
}

async function GetMobile(mobile_code) {
  return await Mobile.findOne({ mobile_code: mobile_code }).lean();
}

async function GetListMobile() {
  return await Mobile.find({}).lean();
}

module.exports = {
  AddMobile,
  GetMobile,
  GetListMobile,
};
