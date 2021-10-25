const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('Game');
    const gameContract = await gameContractFactory.deploy(
      ["Cap America", "Hulk", "Witch"],
      ["https://i.imgur.com/DYy7js6.jpeg", 
      "https://i.imgur.com/lgPFnUw.jpeg", 
      "https://i.imgur.com/yRMhDS0.jpeg"],
      [100, 200, 300],                   
      [100, 50, 25],                      
      "Ultron",               
      "https://i.imgur.com/yyjoUG8.jpeg",   
      10000,                              
      50                                  
    );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);
  
    let txn;
    txn = await gameContract.mintCharacterNFT(2);
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