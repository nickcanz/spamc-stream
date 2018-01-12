exports.Response1 = function () {
  return [ 'SPAMD/1.1 0 EX_OK',
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
};

exports.Response2 = function () {
  return [ 'SPAMD/1.1 0 EX_OK',
			'Content-length: 2334',

			'Spam: False ; 3.2 / 5.0',
			`Spam detection software, running on the system "spamd.local", has
identified this incoming email as possible spam.  The original message
has been attached to this so you can view it (if it isn't spam) or label
similar future email.  If you have any questions, see
the administrator of that system for details.

Content preview:  See <https://example.com>
   Started by timer [EnvInject] - Loading node environment variables. Building
   on master in workspace <https://example.com/>
   [production] $ /home/testing/.rvm/bin/rvm-shell -xe /tmp/jenkins9052624646371643215.sh
   + RETRY_COUNT=1 + bundle exec rspec spec/spec.rb
   [...]

Content analysis details:   (5.0 points, 5.0 required)

 pts rule name              description
---- ---------------------- --------------------------------------------------
 5.1 FREEMAIL_FROM          Sender email is commonly abused enduser mail provider
                            (testing[at]example.com)
 0.0 URIBL_BLOCKED          ADMINISTRATOR NOTICE: The query to URIBL was blocked.
                            See
                            http://wiki.apache.org/spamassassin/DnsBlocklists#dnsbl-block
                             for more information.
                            [URIs: jenkins9052624646371643215.sh]
-0.0 RCVD_IN_DNSWL_NONE     RBL: Sender listed at http://www.dnswl.org/, no
                            trust
                            [0.0.0.0 listed in list.dnswl.org]
-0.1 DKIM_VALID_AU          Message has a valid DKIM or DK signature from author's
                            domain
-0.1 DKIM_VALID             Message has at least one valid DKIM or DK signature
 0.1 DKIM_SIGNED            Message has a DKIM or DK signature, not necessarily valid

`];
};


exports.Response3 = function () {

  return [ 'SPAMD/1.1 0 EX_OK',
  		'Content-length: 1162',
  		'Spam: True ; -0.1 / 5.0',
			`Spam detection software, running on the system "74d7f9d71592",
has NOT identified this incoming email as spam.  The original
message has been attached to this so you can view it or label
similar future email.  If you have any questions, see
the administrator of that system for details.

Content preview:  Hello User, We\'ve spotted an incident with the
   repository in your example account. THE ISSUE: [...] 

Content analysis details:   (0.1 points, 5.0 required)

 pts rule name              description
---- ---------------------- --------------------------------------------------
 0.0 URIBL_BLOCKED          ADMINISTRATOR NOTICE: The query to URIBL was blocked.
                            See
                            http://wiki.apache.org/spamassassin/DnsBlocklists#dnsbl-block
                             for more information.
                            [URIs: eample.com]
-0.0 RCVD_IN_MSPIKE_H3      RBL: Good reputation (+3)
                            [0.0.0.0 listed in wl.mailspike.net]
-0.1 DKIM_SIGNED            Message has a DKIM or DK signature, not necessarily valid
-0.0 RCVD_IN_MSPIKE_WL      Mailspike good senders
 0.0 T_DKIM_INVALID         DKIM-Signature header exists but is not valid

`];
};

exports.Response4 = function () {
	return [ 'SPAMD/1.1 0 EX_OK',
  	'Content-length: 1817',
  	'Spam: True ; 13.0 / 5.0',
`  0.0 URIBL_BLOCKED          ADMINISTRATOR NOTICE: The query to URIBL was blocked.
                            See
                            http://wiki.apache.org/spamassassin/DnsBlocklists#dnsbl-block
                             for more information.
                            [URIs: wwwg.trade]
 1.6 SUBJ_ALL_CAPS          Subject is all capitals
 1.9 URIBL_ABUSE_SURBL      Contains an URL listed in the ABUSE SURBL blocklist
                            [URIs: wwwg.trade]
 0.8 HTML_IMAGE_RATIO_02    BODY: HTML has a low ratio of text to image area
 1.1 MIME_HTML_ONLY         BODY: Message only has text/html MIME parts
 1.3 HTML_IMAGE_ONLY_24     BODY: HTML: images with 2000-2400 bytes of words
 0.0 HTML_MESSAGE           BODY: HTML included in message
 2.0 PYZOR_CHECK            Listed in Pyzor (http://pyzor.sf.net/)
 0.1 DKIM_SIGNED            Message has a DKIM or DK signature, not necessarily valid
 0.0 T_DKIM_INVALID         DKIM-Signature header exists but is not valid
 0.6 HTML_MIME_NO_HTML_TAG  HTML-only message, but there is no HTML tag
 1.0 BODY_URI_ONLY          Message body is only a URI in one line of text or for
                            an image
 2.5 BODY_SINGLE_WORD       Message body is only one word (no spaces)
 0.0 BODY_SINGLE_URI        Message body is only a URI

`];
};
