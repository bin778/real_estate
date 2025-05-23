var web3 = new Web3('ws://localhost:7545');
var contract;
var contractAddress = 'PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE';
var abi = [
  /* Contract ABI from Remix or Truffle build */
];

window.onload = async function () {
  contract = new web3.eth.Contract(abi, contractAddress);
  loadProperties();
};

async function registerProperty() {
  const accounts = await web3.eth.getAccounts();
  await contract.methods
    .registerProperty('Seoul, Gangnam', web3.utils.toWei('10', 'ether'))
    .send({ from: accounts[0] });
  loadProperties();
}

async function buyProperty(id, price) {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.buyProperty(id).send({ from: accounts[1], value: price });
  loadProperties();
}

async function loadProperties() {
  const count = await contract.methods.nextPropertyId().call();
  const container = document.getElementById('properties');
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const data = await contract.methods.getProperty(i).call();
    const [location, price, owner, available] = data;
    const div = document.createElement('div');
    div.innerHTML = `
            <h3>${location}</h3>
            <p>가격: ${web3.utils.fromWei(price, 'ether')} ETH</p>
            <p>소유자: ${owner}</p>
            <p>상태: ${available ? '구매 가능' : '판매 완료'}</p>
            ${available ? `<button onclick="buyProperty(${i}, '${price}')">구매</button>` : ''}
            <hr>
        `;
    container.appendChild(div);
  }
}
