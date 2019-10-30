<?php
global $wtwconnect;
try {
	/* google analytics tracking (if defined in wtw_config.php) */
	$wtwconnect->trackPageView($wtwconnect->domainurl."/connect/wtw-shopping-getstores.php");
	
	/* select useravatarid data */
	echo $wtwconnect->addConnectHeader($wtwconnect->domainname);
	$zstores = array();
	$zresults = $wtwconnect->query("
		select *
		from ".WTWSHOPPING_PREFIX."stores  
		where deleted=0;");
	$i = 0;
	foreach ($zresults as $zrow) {
		$zstores[$i] = array(
			'storeid'=> $zrow["storeid"], 
			'storename'=> $zrow["storename"], 
			'storeiframes'=> $zrow["storeiframes"],
			'storeurl'=> $zrow["storeurl"],
			'storecarturl'=> $zrow["storecarturl"],
			'storeproducturl'=> $zrow["storeproducturl"],
			'woocommerceapiurl'=> $zrow["woocommerceapiurl"],
			'woocommercekey'=> $zrow["woocommercekey"],
			'woocommercesecret'=> $zrow["woocommercesecret"]
		);
		$i += 1;
	}

	echo json_encode($zstores);	
} catch (Exception $e) {
	$wtwconnect->serror("connect-wtw-shopping-getstores.php=".$e->getMessage());
}
?>
