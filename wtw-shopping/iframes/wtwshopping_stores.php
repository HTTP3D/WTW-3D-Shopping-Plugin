<?php
global $wtwiframes;
try {
	/* google analytics tracking (if defined in wtw_config.php) */
	$wtwiframes->trackPageView($wtwiframes->domainurl."/iframes/shopping.php");
	
	$zbval = "";
	$ziframename = "";
	if ($_SERVER['REQUEST_METHOD']=='POST') {
		require_once(WTWSHOPPING_PATH.'/functions/class_wtwshopping_stores.php');
		global $wtwshopping_stores;
		$zbval = $_POST["wtw_bval"];
		$ziframename = $_POST["wtw_iframename"];
		switch ($zbval) {
			case "wtw_bsavestore":
				$zstoreid = $wtwshopping_stores->saveStore($_POST["wtw_tstoreid"], $_POST["wtw_tstorename"], $_POST["wtw_tstoreiframes"], $_POST["wtw_tstoreurl"], $_POST["wtw_tstorecarturl"], $_POST["wtw_tstoreproducturl"], $_POST["wtw_twoocommerceapiurl"], $_POST["wtw_twoocommercekey"], $_POST["wtw_twoocommercesecret"]);
				break;
			case "wtw_bsaveconnectstore":
				$wtwshopping_stores->saveConnectStore($_POST["wtw_tstoreid"],$_POST["wtw_tcommunityid"],$_POST["wtw_tbuildingid"],$_POST["wtw_tthingid"]);
				break;
			case "wtw_bdeletestore":
				$wtwshopping_stores->deleteStore($_POST["wtw_tstoreid"]);
				break;
			case "wtw_bdeletemold":
				$wtwshopping_stores->deleteMold($_POST["wtw_tcommunityid"], $_POST["wtw_tbuildingid"], $_POST["wtw_tthingid"], $_POST["wtw_tmoldid"]);
				break;
			case "wtw_bsavemold":
				$wtwshopping_stores->saveMold($_POST["wtw_tcommunityid"], $_POST["wtw_tbuildingid"], $_POST["wtw_tthingid"], $_POST["wtw_tmoldid"], $_POST["wtw_tmoldslug"], $_POST["wtw_tproductid"], $_POST["wtw_tcategoryid"], $_POST["wtw_tallowsearch"]);
				break;
		}
	}
} catch (Exception $e) {
	$wtwiframes->serror("plugins:wtw-shopping:iframes-wtwshopping_stores.php=".$e->getMessage());
}
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Walk the Web - Save Shopping Info</title>
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Expires" content="0" />
    <script src="/core/scripts/prime/wtw_common_iframe.js"></script>
</head>
<body>
	<form id="wtw_form1" action="wtwshopping_stores.php" method="post">
		<input type='hidden' id='wtw_iframename' name='wtw_iframename' value="<?php echo $ziframename; ?>" maxlength="64" />
		<input type='hidden' id='wtw_bval' name='wtw_bval' value="<?php echo $zbval ?>" maxlength="64" />
		<input type="hidden" id="wtw_tstoreid" name="wtw_tstoreid" maxlength="16" /><br />
		<input type="hidden" id="wtw_tstorename" name="wtw_tstorename" maxlength="255" /><br />
		<input type="hidden" id="wtw_tstoreiframes" name="wtw_tstoreiframes" maxlength="1" /><br />
		<input type="hidden" id="wtw_tstoreurl" name="wtw_tstoreurl" maxlength="255" /><br />
		<input type="hidden" id="wtw_tstorecarturl" name="wtw_tstorecarturl" maxlength="255" /><br />
		<input type="hidden" id="wtw_tstoreproducturl" name="wtw_tstoreproducturl" maxlength="255" /><br />
		<input type="hidden" id="wtw_twoocommerceapiurl" name="wtw_twoocommerceapiurl" maxlength="255" /><br />
		<input type="hidden" id="wtw_twoocommercekey" name="wtw_twoocommercekey" maxlength="255" /><br />
		<input type="hidden" id="wtw_twoocommercesecret" name="wtw_twoocommercesecret" maxlength="255" /><br />
		<input type="hidden" id="wtw_tcommunityid" name="wtw_tcommunityid" maxlength="16" /><br />
		<input type="hidden" id="wtw_tbuildingid" name="wtw_tbuildingid" maxlength="16" /><br />
		<input type="hidden" id="wtw_tthingid" name="wtw_tthingid" maxlength="16" /><br />
		<input type="hidden" id="wtw_tmoldid" name="wtw_tmoldid" maxlength="16" /><br />
		<input type="hidden" id="wtw_tmoldslug" name="wtw_tmoldslug" maxlength="255" /><br />
		<input type="hidden" id="wtw_tproductid" name="wtw_tproductid" maxlength="64" /><br />
		<input type="hidden" id="wtw_tcategoryid" name="wtw_tcategoryid" maxlength="64" /><br />
		<input type="hidden" id="wtw_tallowsearch" name="wtw_tallowsearch" maxlength="1" /><br />
		<input type="submit" id="wtw_bsavestore" name="wtw_bsavestore" value="Save Store" onclick="WTW.buttonClick('wtw_bsavestore');" /><br />
		<input type="submit" id="wtw_bsaveconnectstore" name="wtw_bsaveconnectstore" value="Save Store" onclick="WTW.buttonClick('wtw_bsaveconnectstore');" /><br />
		<input type="submit" id="wtw_bsavemold" name="wtw_bsavemold" value="Save Mold" onclick="WTW.buttonClick('wtw_bsavemold');" /><br />
		<input type="submit" id="wtw_bdeletestore" name="wtw_bdeletestore" value="Delete Store" onclick="WTW.buttonClick('wtw_bdeletestore');" /><br />
		<input type="submit" id="wtw_bdeletemold" name="wtw_bdeletemold" value="Delete Mold" onclick="WTW.buttonClick('wtw_bdeletemold');" /><br />
	</div>
	</form>
	<script type="text/javascript">
		function initUpdateShopping() {
			try {
				switch (dGet('wtw_bval').value) {
					case "wtw_bdeletestore":
					case "wtw_bsavestore":
						parent.WTW.openFullPageForm('fullpage','List Stores','wtw_liststorespage');parent.WTWShopping.getStores();
						break;
					case "wtw_bsaveconnectstore":
						
						break;
					case "wtw_bdeletemold":
						
						break;
					case "wtw_bsavemold":
						
						break;
				}
			} catch (ex) {
				WTW.log("core-iframes-shopping.php-initUpdateShopping=" + ex.message);
			}
		}
<?php	if ($_SERVER['REQUEST_METHOD']=='POST') { ?>
		window.onload = function () {
			try {
				initUpdateShopping();
				parent.WTW.removeIFrame(dGet('wtw_iframename').value);
			} catch (ex) {
				WTW.log("core-iframes-shopping.php-onload=" + ex.message);
			}
		}	
<?php 	} ?>
	</script>
</body>
</html>	