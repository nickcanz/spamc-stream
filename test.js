var chai = require("chai");
var Spamc = require("./index");
var inspect = require("util").inspect;
var fs = require('fs');

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
  it('should proccess all rule', function(done) {
    var rawLines = [ 'SPAMD/1.1 0 EX_OK',
  		'Content-length: 1162',
  		'Spam: True ; 9.8 / 5.0',
			`Spam detection software, running on the system "96b8b4aface5",
has identified this incoming email as possible spam.  The original
message has been attached to this so you can view it or label
similar future email.  If you have any questions, see
the administrator of that system for details.

Content preview:  [...] 

Content analysis details:   (9.8 points, 5.0 required)

 pts rule name              description
---- ---------------------- --------------------------------------------------
-0.0 NO_RELAYS              Informational: message was not relayed via SMTP
 1.2 MISSING_HEADERS        Missing To: header
 2.0 PYZOR_CHECK            Listed in Pyzor (http://pyzor.sf.net/)
 1.0 MISSING_FROM           Missing From: header
-0.0 NO_RECEIVED            Informational: message has no Received headers
 1.4 MISSING_DATE           Missing Date: header
 1.8 MISSING_SUBJECT        Missing Subject: header
 0.1 MISSING_MID            Missing Message-Id: header
 2.3 EMPTY_MESSAGE          Message appears to have no textual parts and no
                            Subject: text
 0.0 NO_HEADERS_MESSAGE     Message appears to be missing most RFC-822 headers

`];

		var response = client._processResponse('REPORT', rawLines)[1];

		expect(response.report.some(r => r.score == 0.0 && r.name == "NO_RELAYS" && r.type == "message was not relayed via SMTP")).to.equal(true);
		expect(response.report.some(r => r.score == 2.0 && r.name == "PYZOR_CHECK")).to.equal(true);

		expect(response.report.some(r => r.score == 0.0 && r.name == "NO_HEADERS_MESSAGE" && r.description == "Message appears to be missing most RFC-822")).to.equal(true);

		expect(response.report.some(r => r.score == 2.3 && r.name == 'EMPTY_MESSAGE' && r.description == 'Message appears to have no textual parts and no Subject')).to.equal(true);

		done();
  })
})
