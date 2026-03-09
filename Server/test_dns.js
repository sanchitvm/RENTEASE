const dns = require('dns');

const hosts = [
    'ac-borz3mj-shard-00-00.qojke51.mongodb.net',
    'ac-borz3mj-shard-00-01.qojke51.mongodb.net',
    'ac-borz3mj-shard-00-02.qojke51.mongodb.net',
    'cluster0.qojke51.mongodb.net'
];

console.log('Testing host lookups...');
hosts.forEach(host => {
    dns.lookup(host, (err, address, family) => {
        if (err) {
            console.log(`Lookup Error for ${host}:`, JSON.stringify(err, null, 2));
        } else {
            console.log(`Lookup Success for ${host}:`, address);
        }
    });
});

dns.resolveSrv('_mongodb._tcp.cluster0.qojke51.mongodb.net', (err, addresses) => {
    if (err) {
        console.log('SRV resolution error details:', JSON.stringify(err, null, 2));
    } else {
        console.log('SRV resolution successful:', addresses.length, 'records');
    }
});
