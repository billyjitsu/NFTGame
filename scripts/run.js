const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('Game');
  const gameContract = await gameContractFactory.deploy(
    ["Cap America", "Hulk", "Witch"],       // Names
    ["https://i.imgur.com/DYy7js6.jpeg", // Images
    "https://i.imgur.com/lgPFnUw.jpeg", 
    "https://i.imgur.com/yRMhDS0.jpeg"],
    [100, 200, 300],                    // HP values
    [100, 50, 25],                      // Attack damage values
    "Ultron",               //Boss Name
    "https://i.imgur.com/yyjoUG8.jpeg",   //boss image
    10000,                              //boss hp
    50                                  // boss attack damage
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  let txn;
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();