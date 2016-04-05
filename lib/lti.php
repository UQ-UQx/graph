<?php

require_once('config.php');
require_once('OAuth.php');

class Lti {

	protected $testing = false;
	protected $config = array();
	
	protected $ltivars = array();
	protected $valid = false;
	protected $errors = '';
	
	function __construct($config, $display_errors=false) {
		if($display_errors) {
			$this->display_errors();
		}

		$this->config = $config;
		if(!empty($_POST)) {
			$this->ltivars = $_POST;
		}
        if($this->testing) {
        	if(!isset($this->ltivars["oauth_consumer_key"])) {
        		$this->valid = true;
				$this->usedummydata();
        	}
        }
        if(!$this->testing || isset($this->ltivars["oauth_consumer_key"])){
        	$store = new TrivialOAuthDataStore();
        	if(!isset($this->ltivars["oauth_consumer_key"])) {
        		$this->ltivars["oauth_consumer_key"] = '';
        	}
        	if(isset($this->config['lti_keys'][$this->ltivars["oauth_consumer_key"]])) {
	        	$lti_key = $this->config['lti_keys'][$this->ltivars["oauth_consumer_key"]];
				$store->add_consumer($this->ltivars["oauth_consumer_key"], $lti_key);
				$server = new OAuthServer($store);
				$method = new OAuthSignatureMethod_HMAC_SHA1();
				$server->add_signature_method($method);
				$request = OAuthRequest::from_request(NULL,NULL,NULL,$this->ltivars);
				$this->basestring = $request->get_signature_base_string();
				try {
    	        	$server->verify_request($request);
					$this->valid = true;
				} catch (Exception $e) {
					$this->errors = 'Bad LTi Validation (possible incorrect secret) - '.$e->getMessage();
				}
			} else {
				$this->errors = 'Invalid consumer key';
			}
		}
	}
	
	
	
	function setltivars($vars) {
		$this->ltivars = $vars;
	}
	
	function resource_id(){
				
		if(isset($this->ltivars["resource_link_id"])) {
			return $this->ltivars["resource_link_id"];
		}
		return 'Unknown resource_link_id';

	}
	
	function display_errors() {
		ini_set('display_errors',1);
		ini_set('display_startup_errors',1);
		error_reporting(-1);
	}
	
	function get_errors() {
		return $this->errors;
	}
	
	function is_valid() {
		return $this->valid;
	}
	
	function user_id() {
		if(isset($this->ltivars['user_id'])) {
			return $this->ltivars['user_id'];
		}
		return 'Unknown user';
	}
	
	function user_roles() {
		if(isset($this->ltivars['roles'])) {
			return $this->ltivars['roles'];
		}
		return 'Unknown roles';
	}
	
	function grade_url(){
		if(isset($this->ltivars["lis_outcome_service_url"])) {
			return $this->ltivars["lis_outcome_service_url"];
		}
		return 'No Grade URL';

	}
	
	function result_sourcedid(){
		if(isset($this->ltivars["lis_result_sourcedid"])) {
			return $this->ltivars["lis_result_sourcedid"];
		}
		return 'No Result SourcedID';

	}
	
	function lti_id() {
		if(isset($this->ltivars["oauth_consumer_key"])) {
			return $this->ltivars["oauth_consumer_key"];
		}
		return 'Unknown user';
	}
	
	function requirevalid() {
		if($this->valid) {
			return;
		} else {
			echo $this->errors;
			die();
		}
	}
	
	function calldata() {
		return $this->ltivars;
	}
	
	function usedummydata() {
		$this->ltivars = array(
		    'launch_presentation_return_url'=>'',
		    'lti_version'=>'LTI-1p0',
		    'user_id'=>'student',
		    'roles'=>'Instructor',
		    'oauth_nonce'=>'60581087546369126111399262942',
		    'oauth_timestamp'=>'1399262942',
		    'lis_result_sourcedid'=>'UQx/ceit1001/2014_1:-i4x-UQx-ceit1001-lti-35fd269993224010adbacd8cd05f0043:student',
		    'context_id'=>'UQx/ceit1001/2014_1',
		    'oauth_consumer_key'=>'test',
		    'resource_link_id'=>'-i4x-UQx-ceit1001-lti-35fd269993224010adbacd8cd05f0043',
		    'oauth_signature_method'=>'HMAC-SHA1',
		    'oauth_version'=>'1.0',
		    'oauth_signature'=>'dSffHcwBbfyR01HQloYJIQRu9T0',
		    'lti_message_type'=>'basic-lti-launch-request',
		    'oauth_callback'=>'about:blank',
		);
	}
	
}

/**
 * A Trivial memory-based store - no support for tokens
 */
class TrivialOAuthDataStore extends OAuthDataStore {
    private $consumers = array();

    function add_consumer($consumer_key, $consumer_secret) {
        $this->consumers[$consumer_key] = $consumer_secret;
    }

    function lookup_consumer($consumer_key) {
        if ( strpos($consumer_key, "http://" ) === 0 ) {
            $consumer = new OAuthConsumer($consumer_key,"secret", NULL);
            return $consumer;
        }
        if ( $this->consumers[$consumer_key] ) {
            $consumer = new OAuthConsumer($consumer_key,$this->consumers[$consumer_key], NULL);
            return $consumer;
        }
        return NULL;
    }

    function lookup_token($consumer, $token_type, $token) {
        return new OAuthToken($consumer, "");
    }

    // Return NULL if the nonce has not been used
    // Return $nonce if the nonce was previously used
    function lookup_nonce($consumer, $token, $nonce, $timestamp) {
        // Should add some clever logic to keep nonces from
        // being reused - for no we are really trusting
	// that the timestamp will save us
        return NULL;
    }

    function new_request_token($consumer) {
        return NULL;
    }

    function new_access_token($token, $consumer) {
        return NULL;
    }
}

?>
