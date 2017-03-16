<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

 if (strpos(__FILE__, '_code') !== FALSE)
 {
 	define ('SITE_TYPE', DEV_SITE);
 }
 /** otherwise, assume it's on the live site */
 else
 {
 	define ('SITE_TYPE', LIVE_SITE);
 }

 /** we should see which database we should be using based on the site_status... */
 switch (SITE_TYPE)
 {
 	case DEV_SITE:
 		$active_group = 'local';
 		break;
 	case LIVE_SITE:
 		$active_group = 'live';
 		break;
 }

 /** local development database */
 $db['local']['hostname'] = 'localhost';
 $db['local']['username'] = 'root';
 $db['local']['password'] = 'mysql';
 $db['local']['database'] = 'refracter';

 /** live database */
 $db['live']['hostname'] = 'localhost';
 $db['live']['username'] = 'root';
 $db['live']['password'] = 'Mickeymouse#1';
 $db['live']['database'] = 'refracter';

 // ** MySQL settings - You can get this info from your web host ** //
 /** The name of the database for WordPress */
 define('DB_NAME', $db[$active_group]['database'] );

 /** MySQL database username */
 define('DB_USER', $db[$active_group]['username'] );

 /** MySQL database password */
 define('DB_PASSWORD', $db[$active_group]['password'] );

 /** MySQL hostname */
 define('DB_HOST', $db[$active_group]['hostname'] );

 /** Database Charset to use in creating database tables. */
 define('DB_CHARSET', 'utf8mb4');

 /** The Database Collate type. Don't change this if in doubt. */
 define('DB_COLLATE', '');
/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'UW/]$2o3naZCjjn``km{&j>3wvOv1&>Ca<gucmN-WrR*+Li#l+UCmX)mPpt[ &mJ');
define('SECURE_AUTH_KEY',  'c7FRlz`aH^ /}Ge#}q`PutlGrcG^aE5:/ o{noW0e>6=6&mvLTREE0&r*rWZ}9m!');
define('LOGGED_IN_KEY',    'UG0{;y~Qc.50+-t-w2jucJ^{]UzW,jrW1G[} 0PxuXgJKl-vO>;bVa| 5f_#[;4P');
define('NONCE_KEY',        'VI5xrBKT8cUM+m;1q@~-Y}C}K:Bw}Pf_u~,w@LW$H{]rR|n2#P8uw_W `jHPGq3e');
define('AUTH_SALT',        'z%>_,3/x/kWg`SOz}s#j>#ma?u3m.)@RBt&cq_!:KOCdYP|Zj-iRp$`+I~!J+9t}');
define('SECURE_AUTH_SALT', 'E6G Npxq*[htt&=9[r%k@*s{I)e6f55-=Cc8hqvgQvl+GgC$,ZRzH.oG; *Do_-Z');
define('LOGGED_IN_SALT',   'k|d@gf<.}`j[;?2`^q&<_;#Tz]I;QTHCy/Sk_t$R>1ML IK1QRclGaWz&%s2Dd])');
define('NONCE_SALT',       'bt&srEg(:}ai3WW8.;=8R7Udq5p>#oV-`jycmQR4ch-<AT$K{*b=xj?>XZk]^dC{');

//dynamic site url
$serverFileDirectory = $_SERVER['SERVER_NAME'].$_SERVER['PHP_SELF'];
$dynamicWordpressHome = strstr($serverFileDirectory, 'server', true).'server/';
define('WP_HOME', 'http://'.$dynamicWordpressHome);
define('WP_SITEURL', 'http://'.$dynamicWordpressHome);

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
