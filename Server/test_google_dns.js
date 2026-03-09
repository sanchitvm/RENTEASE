const dns = require('dns');
const { Resolver } = dns;
const resolver = new Resolver();
resolver.setServers(['8.8.8.8']);

const hosts = [
    'ac-borz3mj-shard-00-00.qojke51.mongodb.net',
    'cluster0.qojke51.mongodb.net'
];

hosts.forEach(host => {
    resolver.resolve4(host, (err, addresses) => {
        if (err) {
            console.log(`Google DNS Lookup Error for ${host}:`, err.code);
        } else {
            console.log(`Google DNS Lookup Success for ${host}:`, addresses);
        }
    });
});

resolver.resolveSrv('_mongodb._tcp.cluster0.qojke51.mongodb.net', (err, addresses) => {
    if (err) {
        console.log('Google DNS SRV resolution error:', err.code);
    } else {
        console.log('Google DNS SRV resolution successful:', addresses.length, 'records');
    }
});
