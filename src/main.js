let web3 = new Web3('ws://localhost:7545');
let contract;
const contractAddress = '0xA5afB6209f02e35daF20270F5C97C61672e15E4F'; // Ganache에서 배포한 주소
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

  document.getElementById('currentAccount').innerText = `판매자 계정: ${accounts[0]}`;
  await populateAccountSelector();
  loadProperties();
});

async function populateAccountSelector() {
  const accounts = await web3.eth.getAccounts();
  const seller = accounts[0]; // 판매자 (관리자 계정)
  const selector = document.getElementById('buyerAccount');
  selector.innerHTML = '';

  // 판매자 계정을 제외하고 옵션 추가
  accounts
    .filter((account) => account !== seller)
    .forEach((account) => {
      const option = document.createElement('option');
      option.value = account;
      option.innerText = account;
      selector.appendChild(option);
    });
}

async function registerProperty() {
  const accounts = await web3.eth.getAccounts();
  const location = document.getElementById('locationInput').value;
  const priceEth = document.getElementById('priceInput').value;
  const priceWei = web3.utils.toWei(priceEth, 'ether');

  try {
    await contract.methods.registerProperty(location, priceWei).send({ from: accounts[0], gas: 300000 });
    alert('매물이 등록되었습니다!');
    loadProperties();
  } catch (error) {
    console.error(error);
    alert('매물 등록 실패');
  }
}

async function buyProperty(id, priceWei) {
  const buyer = document.getElementById('buyerAccount').value;
  try {
    await contract.methods.buyProperty(id).send({ from: buyer, value: priceWei });
    alert('매물 구매 성공!');
    loadProperties();
  } catch (error) {
    console.error(error);
    alert('구매 실패: 구매자의 금액이 부족합니다');
  }
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
      <p>${available ? '🟢 상태: 구매 가능' : '🔴 상태: 팔림'}</p>
      ${available ? `<button class="buy-btn" onclick="buyProperty(${i}, '${price}')">구매</button>` : ''}
    `;
    container.appendChild(div);
  }
}
