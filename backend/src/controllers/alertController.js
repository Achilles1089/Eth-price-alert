const Alert = require('../models/Alert');
const Web3 = require('web3');

// Connect to the Ethereum network using Infura or any other provider
const web3 = new Web3("https://mainnet.infura.io/v3/3eecba17e0814407ae32404e39ed5465"); // Replace with your Infura project ID or other provider

// Smart contract ABI and address
const contractABI = [
  // [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "targetPrice",
				"type": "uint256"
			}
		],
		"name": "AlertCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "currentPrice",
				"type": "uint256"
			}
		],
		"name": "AlertTriggered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_targetPrice",
				"type": "uint256"
			}
		],
		"name": "createAlert",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_currentPrice",
				"type": "uint256"
			}
		],
		"name": "triggerAlert",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "alerts",
		"outputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "targetPrice",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
];
const contractAddress = '0xEd7215371fF44eeA36FBaD871beAEB3aDDD83BFa';
const priceAlertContract = new web3.eth.Contract(contractABI, contractAddress);

// Create a new alert
exports.createAlert = async (req, res) => {
  const { type, targetPrice } = req.body;
  try {
    const alert = new Alert({
      userId: req.user.id,
      type,
      targetPrice
    });
    await alert.save();

    // Interact with smart contract to create alert
    const accounts = await web3.eth.getAccounts();
    await priceAlertContract.methods.createAlert(targetPrice).send({ from: accounts[0] }); // Replace with the correct account address

    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get all alerts for the logged-in user
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user.id });
    res.json(alerts);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
