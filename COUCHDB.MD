# CouchDB Setup

Currently deploying CouchDB installation through package repository as a single node setup

## Install Commands

1. ```bash
sudo apt-get install -y apt-transport-https gnupg ca-certificates
```
2. ```bash
echo "deb https://apache.bintray.com/couchdb-deb bionic main" \
    | sudo tee -a /etc/apt/sources.list.d/couchdb.list
```
3. ```bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys \
  8756C4F765C9AC3CB6B85D62379CE192D401AB61
```
4. ``` bash
sudo apt update && sudo apt-get install -y couchdb
```

