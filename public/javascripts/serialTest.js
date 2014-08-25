var SerialPort;
var serialPort = new SerialPort("\\\\.\\COM6", { 
	baudrate: 9600
});

serialPort.on("open", function () {
	console.log('open');
	serialPort.on('data', function(data) {
		console.log('data received from serialTest.js: ' + data);
	});
	serialPort.write("S\n", function(err, results) {
		console.log('err ' + err);
		console.log('results from serialTest.js ' + results);
	});
});


serialPort.list(function (err, ports) {
	ports.forEach(function(port) {
		console.log(port.comName);
		console.log(port.pnpId);
		console.log(port.manufacturer);
	});
});
