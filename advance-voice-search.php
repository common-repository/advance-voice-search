<?php
/*
Plugin Name: Advance Voice Search
Plugin URI:  https://wordpress.org/plugins/advance-voice-search/
Description: A plugin to add voice search functionality to your WordPress site.
Author: RVS Media
Author URI:  https://www.rvsmedia.co.uk
Version: 1.1.3
Text Domain: advance-voice-search
Requires at least: 5.0
Requires PHP: 7.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

// if(!function_exists('pp')){
//     function pp($array){
//         echo "<pre>";
//         print_r($array);
//         echo "</pre>";
//     }
// }

// Hook to enqueue scripts
add_action('wp_enqueue_scripts', 'vsp_enqueue_scripts');
function vsp_enqueue_scripts() {
    $version = get_file_data(__FILE__, array('Version'), 'plugin')[0];
    wp_enqueue_style( 'voice-search-style', plugins_url('assets/css/voice-search.min.css', __FILE__), array(), $version);

    // Enqueue JavaScript file for voice search
    wp_enqueue_script('voice-search-script', plugins_url('assets/js/voice-search.min.js', __FILE__), array('jquery'), $version, true);
}
