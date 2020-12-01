const NetworkGateway = require('./NetworkGateway');
 
class NetworkGatewayFactory {
    create() {
        let gateway = new NetworkGateway();
        let temp = gateway.initialize();
        return temp;
    }
}

module.exports = new NetworkGatewayFactory();