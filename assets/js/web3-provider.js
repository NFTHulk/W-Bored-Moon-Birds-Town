let walletConnected = false
let currentWallet = ''
let web3 = new Web3(window.ethereum)
const address = '0xba44F77b9D8005E8Ca2220De2e02e8BBC7c9F24E';
const $connectWalletBtn = document.getElementById('connect')
const $mint = document.getElementById('mint')
let abi = ''
let collection = ''
let contract = ''
const gasPriceDynamic = 28500

$.getJSON('./assets/js/abi.json', function (data) {
    let string = JSON.stringify(data);
    let parsed = JSON.parse(string);
    abi = parsed['abi']
});

window.addEventListener('DOMContentLoaded', async () => {
    connect()
})

async function getCollection() {

    collection = await contract.methods.totalSupply().call()
    let maxSupply = await contract.methods.maxSupply().call()
    walletConnected = true
    if (collection !== '') {
        document.getElementById('collection').innerHTML = maxSupply - collection
    }
}

async function mintNFT() {
    networkId = await web3.eth.net.getId();
    console.log(networkId);

    if (networkId === 137) {
        let block = await web3.eth.getBlock("latest")
        const quantity = parseInt(document.getElementById('quantity').value)
        try {
            await contract.methods.mint(quantity).send({
                from: currentWallet,
                gasLimit: gasPriceDynamic
            }).then(async function () {
                await getCollection()
                document.getElementById('quantity').value = 1
                Swal.fire({
                    title: 'Connected',
                    text: 'Mint Successful',
                    icon: 'success',
                    confirmButtonText: 'Close'
                });
            });
        } catch (err) {
            if (err.message.includes("User denied transaction signature")) {
                Swal.fire({
                    title: 'Error!',
                    text: 'You Reject the transaction',
                    icon: 'error',
                    confirmButtonText: 'Close'
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'There was a problem by changing the value. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Close'
                }, function () {
                    window.location.href = 'index.html';
                });

            }
        }
    }
}

window.setInterval(async function () {

    let accounts = await ethereum.request({method: "eth_accounts"});
    let isConnected = !!accounts.length;
    networkId = await web3.eth.net.getId();

    if (!isConnected) {
        await window.ethereum.request({method: 'eth_requestAccounts'})
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '0x89',
                chainName: 'Matic Mainnet',
                nativeCurrency: {
                    name: 'Matic Mainnet',
                    symbol: 'MATIC',
                    decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
            }]
        })
            .catch((error) => {
                console.log(error)
            })
    } else if (networkId === 137 && isConnected) {
        currentWallet = accounts[0]
        walletConnected = true
        await getCollection()
        $connectWalletBtn.style.display = 'none'
        $mint.style.display = 'block'
        $mint.disabled = false
    } else if (isConnected) {
        $connectWalletBtn.style.display = 'none'
        $mint.style.display = 'block'
        currentWallet = accounts[0]
        walletConnected = true
        $mint.disabled = true

        await window.ethereum.request({method: 'eth_requestAccounts'})
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '0x89',
                chainName: 'Matic Mainnet',
                nativeCurrency: {
                    name: 'Matic Mainnet',
                    symbol: 'MATIC',
                    decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
            }]
        })
            .catch((error) => {
                console.log(error)
            })
    }


}, 1000)


async function connect() {
    let networkId = await web3.eth.net.getId();
    console.log(networkId);

    contract = new web3.eth.Contract(abi, address);

    let accounts = await web3.eth.getAccounts()
    let isConnected = !!accounts.length;

    if (!isConnected) {
        Swal.fire({
            title: 'Error!',
            text: 'Please click on your metamask extension.',
            icon: 'error',
            confirmButtonText: 'Close'
        });
        await window.ethereum.request({method: 'eth_requestAccounts'})
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '0x89',
                chainName: 'Matic Mainnet',
                nativeCurrency: {
                    name: 'Matic Mainnet',
                    symbol: 'MATIC',
                    decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
            }]
        })
            .catch((error) => {
                console.log(error)
            })
    }

    accounts = await web3.eth.getAccounts()
    currentWallet = accounts[0]

    console.log(currentWallet)

    if (networkId === 137 && isConnected) {
        Swal.fire({
            title: 'Connected',
            text: 'Your wallet is now connected.',
            icon: 'success',
            confirmButtonText: 'Close'
        });

        await getCollection()
        $connectWalletBtn.style.display = 'none'
        $mint.style.display = 'block'
        walletConnected = true
        $mint.disabled = false
    } else if (isConnected) {
        Swal.fire({
            title: 'Error!',
            text: "Your wallet is not on required network, use the correct network.",
            icon: 'error',
            confirmButtonText: 'Close'
        });
        $connectWalletBtn.style.display = 'none'
        $mint.style.display = 'block'
        walletConnected = true
        $mint.disabled = true

        await window.ethereum.request({method: 'eth_requestAccounts'})
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '0x89',
                chainName: 'Matic Mainnet',
                nativeCurrency: {
                    name: 'Matic Mainnet',
                    symbol: 'MATIC',
                    decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
            }]
        })
            .catch((error) => {
                console.log(error)
            })
    }
}

function plus() {
    let quantity = parseInt(document.getElementById('quantity').value)
    if (quantity < 20) {
        quantity = parseInt(quantity + 1)
        document.getElementById('quantity').value = quantity
    }
}

function minus() {
    let quantity = parseInt(document.getElementById('quantity').value)
    if (quantity > 1) {
        quantity = parseInt(quantity - 1)
        document.getElementById('quantity').value = quantity
    }
}

function plusTen() {
    let quantity = parseInt(document.getElementById('quantity').value)
    if (quantity < 11) {
        quantity = parseInt(quantity + 10)
        document.getElementById('quantity').value = quantity
    }
}
