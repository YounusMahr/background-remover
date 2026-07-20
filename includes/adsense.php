<?php
/**
 * Helper template to output AdSense slots anywhere in frontend pages
 */
if (!function_exists('show_ad_unit')) {
    function show_ad_unit($slot = 'default', $format = 'auto') {
        echo render_adsense($slot, $format);
    }
}
