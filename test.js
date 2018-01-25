var chai = require("chai");
var inspect = require("util").inspect;
var fs = require('fs');
var Spamc = require("./index");
var TestData = require('./samples/test-responses');

var should = chai.should();
var expect = chai.expect;


var client = new Spamc();

// Extracted from Spamassassin's training data
var EASYSPAM = fs.createReadStream('./samples/easyspam');
var EASYSPAMLENGTH = fs.statSync('./samples/easyspam').size;
var EASYHAM2 = fs.createReadStream('./samples/easyham-2');
var EASYHAM2LENGTH = fs.statSync('./samples/easyham-2').size;
var EASYSPAMCOPY = fs.createReadStream('./samples/easyspam');
var EASYSPAMCOPY2 = fs.createReadStream('./samples/easyspam');

describe('Test Suite', function() {
	this.timeout(12000)
	it('should play ping-pong nicely', function(done){
		client.ping(function(error, didPlay) {
			expect(didPlay).to.equal(true);
			done();
		})
	})
	it('should work as a PassThrough stream', function(done) {
		var reporter = client.report();
		EASYSPAM.pipe(reporter);
		
		reporter.on('report', function(report) {
			expect(report.responseMessage).to.equal("EX_OK");
			done();
		})
		
		reporter.on('error', function(error) {
			throw error;
		})
	})
	it('should successfully Tell a stream', function(done) {
		var reporter = client.tell({ 'Content-length': EASYSPAMLENGTH });
		EASYSPAMCOPY.pipe(reporter);
		
		reporter.on('report', function(report) {
			expect(report.responseMessage).to.equal("EX_OK");
			done();
		})
		
		reporter.on('error', function(error) {
			throw error;
		})
	})
	it('should successfully Revoke a stream', function(done) {
		var reporter = client.revoke();
		EASYHAM2.pipe(reporter);
		
		reporter.on('report', function(report) {
			expect(report.responseMessage).to.equal("EX_OK");
			done();
		})
		
		reporter.on('error', function(error) {
			throw error;
		})
	})
	it('should successfully Learn a Ham stream', function(done) {
		var reporter = client.ham();
		EASYHAM2.pipe(reporter);
		
		reporter.on('report', function(report) {
			expect(report.responseMessage).to.equal("EX_OK");
			done();
		})
		
		reporter.on('error', function(error) {
			throw error;
		})
	})
	it('should successfully Learn a stream with headers', function(done) {
		var reporter = client.spam({ 'Content-length': EASYSPAMLENGTH });
		EASYSPAMCOPY2.pipe(reporter);
		
		reporter.on('report', function(report) {
			expect(report.responseMessage).to.equal("EX_OK");
			done();
		})
		
		reporter.on('error', function(error) {
			throw error;
		})
	})
})

describe('Parsing test', function () {
  it('should proccess Response1', function(done) {
    var rawLines = TestData.Response1();

		var response = client._processResponse('REPORT', rawLines)[1];

		expect(response.spamScore).to.equal(9.8);

    expect(response.report.length).to.equal(10);
		expect(response.report.some(r => r.score == 0.0 && r.name == "NO_RELAYS" && r.description == "Informational: message was not relayed via SMTP")).to.equal(true);
		expect(response.report.some(r => r.score == 2.0 && r.name == "PYZOR_CHECK")).to.equal(true);

		expect(response.report.some(r => r.score == 0.0 && r.name == "NO_HEADERS_MESSAGE" && r.description == "Message appears to be missing most RFC-822 headers")).to.equal(true);

		expect(response.report.some(r => r.score == 2.3 && r.name == 'EMPTY_MESSAGE' && r.description == 'Message appears to have no textual parts and no Subject: text')).to.equal(true);

		done();
  })

	it('should process Response2', function(done) {
		var rawLines =  TestData.Response2();

		var response = client._processResponse('REPORT', rawLines)[1];
		expect(response.spamScore).to.equal(3.2);

    expect(response.report.length).to.equal(6);
		expect(response.report.some(r => r.score == 0.0 && r.name == "RCVD_IN_DNSWL_NONE" && r.description == "RBL: Sender listed at http://www.dnswl.org/, no trust [0.0.0.0 listed in list.dnswl.org]")).to.equal(true);
    done();
  })

	it('should process Response3', function(done) {
		var rawLines =  TestData.Response3();

		var response = client._processResponse('REPORT', rawLines)[1];

		expect(response.spamScore).to.equal(-0.1);
    expect(response.report.length).to.equal(5);
		var rule = response.report[0];
		expect(rule.score == 0.0 && rule.name == 'URIBL_BLOCKED').to.equal(true);
    done();
  })

	it('should process Response4', function(done) {
		var rawLines =  TestData.Response4();

		var response = client._processResponse('REPORT', rawLines)[1];

		expect(response.spamScore).to.equal(13);
    expect(response.report.length).to.equal(14);
    done();
  })

	it('should process Response5', function(done) {
		var rawLines =  TestData.Response5();

		var response = client._processResponse('REPORT', rawLines)[1];

		expect(response.spamScore).to.equal(0.6);
    expect(response.report.length).to.equal(8);
    done();
	})
})
