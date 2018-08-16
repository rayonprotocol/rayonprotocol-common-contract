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
