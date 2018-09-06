# RayonProtocol Common Contracts

This is a common contract project of RayonProtocol. It is used for all projects for developing RayonProtocol contracts.

## Getting Started
### git submodule add

- Add this repository as a submodule at the path 'contracts/rayonprotocol-common-contract' of a RayonProtocol's project.

```
$ cd <rayonprotocol-project>
$ cd contracts
$ git submodule add https://github.com/rayonprotocol/rayonprotocol-common-contract.git
```

- commit and push

```
$ cd ../
$ git pull
$ git add contracts/rayonprotocol-common-contract
$ git commit -m "submodule 'rayonprotocol-common-contract' is added"
$ git push
```

### git submodule init & update

- Initialize the submodule 'rayonprotocol-common-contract' at RayonProtocol's project and get files

```
$ cd <rayonprotocol-project>
$ git submodule init
$ git submodule update
```



## Getting Started

### Installing

- clone the repository to your local drive

```
$ git clone https://github.com/rayonprotocol/rayonprotocol-common-contract.git
```

### Install libraries and tools

- install truffle

```
npm install -g truffle
```

- install [ganache](http://truffleframework.com/ganache/) for use of local development node

- install node_module

```
$ npm install 
```

#### Build contracts

- build smart contracts

```
$ truffle compile
```

## Built With
* [Truffle](https://truffleframework.com/) - Ethereum Smart Contract Framework
* [Solidity](https://github.com/ethereum/solidity) - Used to develop the Reverse Inquiry smart contracts
* [Node.js](https://nodejs.org/en/) - Server application framework for KYC System
