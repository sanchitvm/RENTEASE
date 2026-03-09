const dns = require('dns');
const mongoose = require('mongoose');

// Set Google DNS globally for the process
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('DNS servers set to Google DNS');

async function testLookup() {
    dns.lookup('cluster0.qojke51.mongodb.net', (err, address) => {
        if (err) {
            console.log('Lookup Error:', err.code);
        } else {
            console.log('Lookup Success:', address);
        }
    });

    try {
        // Try to resolve SRV as well
        dns.resolveSrv('_mongodb._tcp.cluster0.qojke51.mongodb.net', (err, records) => {
            if (err) {
                console.log('SRV Lookup Error:', err.code);
            } else {
                console.log('SRV Lookup Success:', records.length, 'records');
            }
        });
    } catch (e) {
        console.log('SRV resolution failed with exception:', e.message);
    }
}

testLookup();
