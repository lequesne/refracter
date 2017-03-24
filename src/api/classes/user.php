<?php
include('password.php');
class User extends Password{

    private $_db;

    function __construct($db){
    	parent::__construct();

    	$this->_db = $db;
    }

	private function get_user_hash($username){

		try {
			$stmt = $this->_db->prepare('SELECT password, username, userID, email FROM users WHERE username = :username AND active="Yes" ');
			$stmt->execute(array('username' => $username));

			return $stmt->fetch();

		} catch(PDOException $e) {
		    echo '<p class="bg-danger">'.$e->getMessage().'</p>';
		}
	}

    private function get_user_row($usernameOrEmail){

		try {
			$stmt = $this->_db->prepare('SELECT password, username, userID, email, cookie FROM users WHERE username = :username OR email = :email AND active="Yes" ');
			$stmt->execute(array(
                ':username' => $usernameOrEmail,
                ':email' => $usernameOrEmail
            ));

			return $stmt->fetch();

		} catch(PDOException $e) {
		    echo '<p class="bg-danger">'.$e->getMessage().'</p>';
		}
	}

    private function get_user_cookie_row($cookie){

		try {
			$stmt = $this->_db->prepare('SELECT password, username, userID, email, cookie FROM users WHERE cookie = :cookie AND active="Yes" ');
			$stmt->execute(array('cookie' => $cookie));

			return $stmt->fetch();

		} catch(PDOException $e) {
		    echo '<p class="bg-danger">'.$e->getMessage().'</p>';
		}
	}

	public function login($username,$password,$cookie){

        if ( $username && $password ) {
            //normal password login
            $row = $this->get_user_row($username);
    		if($this->password_verify($password,$row['password']) == 1){
    		    $this->setUserSessionData($row);
    		    return true;
    		}
        } else if ( $cookie ) {
            //cookie login
            $row = $this->get_user_cookie_row($cookie);
    		if($cookie ===$row['cookie']){
                $_SESSION['cookie'] = $row['cookie'];
    		    $this->setUserSessionData($row);
    		    return true;
    		}
        }

	}

    public function setUserSessionData($userRow){
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $userRow['username'];
        $_SESSION['userID'] = $userRow['userID'];
        $_SESSION['email'] = $userRow['email'];
    }

	public function logout(){
		session_destroy();
	}

	public function is_logged_in(){
		if(isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true){
			return true;
		}
	}

    //return all user data for signed in user
    public function getUserData(){
        if(isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true && $_SESSION['userID']){

            //fetch user playlists
            $userPlaylists = array();
            $stmt = $this->_db->prepare('SELECT * FROM playlistTracks WHERE userID = :userID AND trackID=0');
            $stmt->execute(array(
        		':userID' => $_SESSION['userID']
        	));
            $playlists = $stmt->fetchAll(PDO::FETCH_ASSOC);
            //put tracks into playlist array
            if ( $playlists ) {
                foreach ( $playlists as $playlist ) {
                    array_push(
                        $userPlaylists,
                        array('id' => $playlist['playlistID'], 'name' => $playlist['name'])
                    );
                }
            }

            //return user object
            $userDataObject = array (
                "cookie" => $_SESSION['cookie'],
                "loggedin"  => $_SESSION['loggedin'],
                "userID" => $_SESSION['userID'],
                "username" => $_SESSION['username'],
                "email" => $_SESSION['email'],
                "playlists"   => $userPlaylists
            );

            return $userDataObject;
        }
    }

}


?>
