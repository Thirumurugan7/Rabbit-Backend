const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const Habit = require('../models/Habit');
const {
  GasStationClient,
  createSuiClient,
  buildGaslessTransactionBytes,
} = require("@shinami/clients/sui");
const { TransactionBlock } = require("@mysten/sui.js/transactions");
const { Ed25519Keypair } = require("@mysten/sui.js/keypairs/ed25519");

const GAS_AND_NODE_TESTNET_ACCESS_KEY =
  "sui_testnet_fb6e8ccaf674c8a2a6a84cae2a8b6abf";

// Set up your Gas Station and Node Service clients
const nodeClient = createSuiClient(GAS_AND_NODE_TESTNET_ACCESS_KEY);
const gasStationClient = new GasStationClient(GAS_AND_NODE_TESTNET_ACCESS_KEY);


async function initialize(reconstructedKeypair, address) {
  const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
    sui: nodeClient,
    build: async (txb) => {
      txb.moveCall({
        target:
          "0x91f150bec5f3d6a793b86279e98940ddae29180eaf9f5b23842443788eaf85d5::rabbit::initialize",
        arguments: [], // Adjust arguments as necessary
      });
    },
  });

  let sponsoredResponse = await gasStationClient.sponsorTransactionBlock(
    gaslessPayloadBase64,
    address
  );

  let sponsoredStatus =
    await gasStationClient.getSponsoredTransactionBlockStatus(
      sponsoredResponse.txDigest
    );

  let senderSig = await TransactionBlock.from(sponsoredResponse.txBytes).sign({
    signer: reconstructedKeypair,
  });

  let executeResponse = await nodeClient.executeTransactionBlock({
    transactionBlock: sponsoredResponse.txBytes,
    signature: [senderSig.signature, sponsoredResponse.signature],
    options: { showEffects: true },
    requestType: "WaitForLocalExecution",
  });

  console.log("Transaction Digest:", executeResponse.digest);
  console.log("Execution Status:", executeResponse.effects?.status.status);
  console.log(
    "Habitude ID",
    executeResponse.effects?.created?.[0]?.reference?.objectId
  );
  console.log("habitude", executeResponse.effects?.created);
return(  {
  transactionDigest: executeResponse.digest,
  habitudeId:
    executeResponse.effects?.created?.[0]?.reference?.objectId,
  executionStatus: executeResponse.effects?.status.status,
})
}

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: '30d' });
};


exports.createChallenge = async (req, res) => {
  console.log("called");
  try {
    const { name, participants, stakeAmount, email } = req.body;
    console.log(name, participants, stakeAmount, email);
    const startDate = new Date();
    const endDate = new Date(startDate);
    const winner = ""
    // endDate.setDate(startDate.getDate() + 10); // Set end date 10 days later than start date
    // console.log(name, participants, startDate, endDate, stakeAmount, winner, email);
    const newChallenge = await new Habit({ email: email, challenges: [{ name, participants, startDate, endDate, stakeAmount, winner }] });
    await newChallenge.save();
    res.status(201).json(newChallenge);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.checKUser = async (req, res) => {
  console.log("called");
  const {email} = req.body;
  console.log(email,"mail");
  const user = await User.findOne({ email });
if(user){
  return res.status(200).json({ message: 'User already exists' });

}
else{
  return res.status(201).json({ message: 'User not exists' });

}};


exports.signup = async (req, res) => {
  const { name, dateOfBirth, gender, email, address, favoriteHabits, keypair } = req.body;
  console.log(name, dateOfBirth, gender, email, address, favoriteHabits);
  try {

    // const userExists = await User.findOne({ email });
    const publicKey = new Uint8Array(keypair.keypair.publicKey);
    const secretKey = new Uint8Array(keypair.keypair.secretKey);
    console.log(publicKey, secretKey);
    const reconstructedKeypair = new Ed25519Keypair({
      publicKey,
      secretKey,
    });
console.log("bcf", reconstructedKeypair);
const ress =   await  initialize(reconstructedKeypair, address)
console.log(ress);
    // if (userExists) {
    //   return res.status(400).json({ message: 'User already exists' });
    // }

    const newUser = new User({ name, dateOfBirth, gender, email, address, favoriteHabit:favoriteHabits, habitId: ress.habitudeId });
    await newUser.save();

    console.log("acf");
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id),
      address:newUser.address,
      ress: ress.habitudeId
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const dosomething = async(reconstructedKeypairr, user,newHabit)=>{
console.log(
  'do'
);
  try {
  
const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
  sui: nodeClient,
  build: async (txb) => {
    txb.moveCall({
      target:
        "0x91f150bec5f3d6a793b86279e98940ddae29180eaf9f5b23842443788eaf85d5::rabbit::create_habit",
      arguments: [
        txb.pure(user.name),
        txb.pure(newHabit.decidedFrequency),
        txb.pure(4),
        txb.pure(5),
        txb.pure(1),
        txb.object(user.habitId),
      ],
    });
  },
});

let sponsoredResponse = await gasStationClient.sponsorTransactionBlock(
  gaslessPayloadBase64,
  user.address
);

let sponsoredStatus =
  await gasStationClient.getSponsoredTransactionBlockStatus(
    sponsoredResponse.txDigest
  );
console.log("Transaction Digest:", sponsoredResponse.txDigest);
console.log("Sponsorship Status:", sponsoredStatus);


let senderSig = await TransactionBlock.from(sponsoredResponse.txBytes).sign({
  signer: reconstructedKeypairr,
});

let executeResponse = await nodeClient.executeTransactionBlock({
  transactionBlock: sponsoredResponse.txBytes,
  signature: [senderSig.signature, sponsoredResponse.signature],
  options: { showEffects: true },
  requestType: "WaitForLocalExecution",
});

console.log("Transaction Digest:", executeResponse.digest);
console.log("Execution Status:", executeResponse.effects?.status.status);
}




catch(e){
console.log(e)
}

}

exports.createHabit = async(req,res) => {
  try {
  const {email, newHabit, keypairr} = req.body;
  console.log(email, newHabit, keypairr);
const user = await User.findOne({email:email});
console.log(user);
console.log("pubket",(keypairr.keypair.publicKey))

// const publicKey =  new Uint8Array(keypairr.keypair.publicKey);
// const secretKey =   new Uint8Array(keypairr.keypair.secretKey);
const publicKey = new Uint8Array([
  255,  23, 205, 189, 107, 232, 233,  55,
   82, 177, 227, 150,  46,  92,  53,  91,
   54,  46, 235, 222, 236,  99, 234,   2,
  179, 131, 162, 196, 230,  11,  85, 136]);

console.log(publicKey);
const secretKey = new Uint8Array([
  255,  23, 205, 189, 107, 232, 233,  55,
   82, 177, 227, 150,  46,  92,  53,  91,
   54,  46, 235, 222, 236,  99, 234,   2,
  179, 131, 162, 196, 230,  11,  85, 136]);

console.log(secretKey);

console.log(publicKey, secretKey);

const reconstructedKeypairr = new Ed25519Keypair({
  publicKey,
  secretKey,
});

console.log(reconstructedKeypairr);
const ress = await dosomething(reconstructedKeypairr, user, newHabit)

    const result = await User.findOneAndUpdate(
      { email: email },
      { $push: { favoriteHabit: newHabit } }
    );
    res.status(201).json({
      msg:"done"
    })
    console.log(`Successfully added new habit to user with email ${email}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  } 
exports.login = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      
      habits: user.favoriteHabit,
      token: generateToken(user._id),
      ress: user.habitId,
    });
  } else {
    return res.status(201).json({ message: 'Invalid email or password' });
  }
  
};

exports.getFavoriteHabits = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.favoriteHabits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateHabitProgress = async (req, res) => {
  const { habitId, email, name } = req.body;
console.log( habitId, email,name);
  try {
    const user = await User.findOne({ email });
    console.log(user.favoriteHabit);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const result = await User.updateOne(
      { email: email, 'favoriteHabit.name': name },
      { $inc: { 'favoriteHabit.$.streak': 1, 'favoriteHabit.$.currentProgress': 1 } }
    );

    console.log(result);





    res.status(200).json({ message: 'Habit progress updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

