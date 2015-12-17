var async = require('async');
var child_process = require('child_process');
var http = require('http');

var SERVER_URLS = ['brett.rentalzoom.ca', 'kelsey.rentalzoom.ca', 'michael.rentalzoom.ca', 'david.rentalzoom.ca'];
var HOST_NAME = 'rentalzoom';
var HOST_ID = 'a342jsfa2xi3j5z1';

var osData = {};
var psData = [];
var memData = {};

async.series([
    function(callback) {
        child_process.execFile('cat', ['/etc/os-release'], function(err, out, code) {
            if (err instanceof Error) {
                throw err;
            }
            var operatingSystemInfo = out.split('\n');
            console.log('Collecting operating system information.');
            var osNameRegex = /NAME="(\w+)"/;
            var osVersionRegex = /VERSION_ID="(\d+\.\d+)"/;
            var osFlavourRegex = /ID_LIKE=(\w+)/;
            var osName = osNameRegex.exec(operatingSystemInfo)[1];
            var osVersion = osVersionRegex.exec(operatingSystemInfo)[1];
            var osFlavour = osFlavourRegex.exec(operatingSystemInfo)[1];
            osData = {
                name: osName,
                version: osVersion,
                flavour: osFlavour
            };
            console.log(osData);
            callback();
        });
    }, 
    function(callback) {
        child_process.execFile('ps', ['-aux'], function(err, out, code) {
            if (err instanceof Error) {
                throw err;
            }
            console.log('Collecting process information.');
            var processes = out.split('\n');
            var failCounter = 0;
            var regex = /(\S+)\s+(\d+)\s+(\d+.\d+)\s+(\d+.\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.*:\w+)\s+(.*)/;
            var processNameRegex = /(\w+)\s+/;
            for (var i = 0; i < processes.length; i++) {
                if (i == 0) {
                    continue;
                }
                var result = regex.exec(processes[i]);
                if (result) {
                    var processName = processNameRegex.exec(result[11]);
                    var json = {
                        "user": result[1],
                        "pid": result[2],
                        "cpu": result[3],
                        "memory": result[4],
                        "vsz": result[5],
                        "rss": result[6],
                        "tty": result[7],
                        "stat": result[8],
                        "start": result[9],
                        "time": result[10],
                        "processName": processName ? (processName.length > 1 ? processName[1] : processName[0]) : result[11],
                        "command": result[11]
                    };
                    psData.push(json);
                } else {
                    failCounter++;
                    console.log('PS: ' + failCounter + ' failures.');
                }    
            }
            callback();
        });
    },
    function(callback) {
        child_process.execFile('cat', ['/proc/meminfo'], function(err, out, code) {
            if (err instanceof Error) {
                throw err;
            }
            console.log('Collecting memory data.');
            var jsonArray = [];
            var memInfo = out.split('\n');
            var failCounter = 0;
            var regex = /(\S*):\D*(\d*)/;
            for (var i = 0; i < memInfo.length; i++) {
                var result = regex.exec(memInfo[i]);
                if (result) {
                    var memInfoName = result[1];
                    var memInfoValue = result[2];
                    memData[memInfoName] = memInfoValue;
                } else {
                    failCounter++;
                    console.log('MEM: ' + failCounter + ' failures.');
                }    
            }
            callback();
        });
    },
    function(callback) {
        var data = { 
            hostName: HOST_NAME, 
            hostId: HOST_ID,
            eventDate: new Date(),
            operatingSystemInfo: osData,
            memoryInfo: memData, 
            processInfo: psData 
        };
        var post_data = JSON.stringify(data);
        console.log('Sending data to collector...');
        for (var i = 0; i < SERVER_URLS.length; i++) {
            var post_options = {
                host: SERVER_URLS[i],
                port: '80',
                path: '/data',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',//x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(post_data)
                }
            };
            var req = http.request(post_options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('Response: ' + chunk);
                });
            });
            req.on('error', function(e) {
                console.log(e);
            });
            req.write(post_data);
            req.end();
        }
        callback();
    }
], function() {
    setTimeout(function() {
        console.log('Exit');
        process.exit();
    }, 3000);
});
