let web3 = new Web3('ws://localhost:7545');
let contract;
const contractAddress = 'your_address'; // Ganache에서 배포한 주소
const abi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'buyProperty',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_location',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
    ],
    name: 'registerProperty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'admin',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'getProperty',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextPropertyId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'properties',
    outputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'location',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isAvailable',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

window.addEventListener('load', async () => {
  const accounts = await web3.eth.getAccounts();
  contract = new web3.eth.Contract(abi, contractAddress);
  loadProperties();
});

async function registerProperty() {
  const accounts = await web3.eth.getAccounts();
  const location = document.getElementById('locationInput').value;
  const priceEth = document.getElementById('priceInput').value;
  const priceWei = web3.utils.toWei(priceEth, 'ether');

  await contract.methods.registerProperty(location, priceWei).send({ from: accounts[0], gas: 300000 });
  loadProperties();
}

async function buyProperty(id, priceWei) {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.buyProperty(id).send({ from: accounts[0], value: priceWei });
  loadProperties();
}

async function loadProperties() {
  const count = await contract.methods.nextPropertyId().call();
  const container = document.getElementById('property-list');
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const property = await contract.methods.getProperty(i).call();
    const location = property[0];
    const price = property[1];
    const owner = property[2];
    const available = property[3];

    const div = document.createElement('div');
    div.className = 'property';
    div.innerHTML = `
      <h3>${location}</h3>
      <p>💰 가격: ${web3.utils.fromWei(price, 'ether')} ETH</p>
      <p>👤 주인: ${owner}</p>
      <p>🟢 상태: ${available ? '구매 가능' : '팔림'}</p>
      ${available ? `<button onclick="buyProperty(${i}, '${price}')">Buy</button>` : ''}
    `;
    container.appendChild(div);
  }
}
