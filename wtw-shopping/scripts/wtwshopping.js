// All code is Copyright 2013-2019 Aaron Scott Dishno Ed.D., HTTP3D Inc. - WalkTheWeb, and the contributors
// "3D Browsing" is a USPTO Patented (Serial # 9,940,404) and Worldwide PCT Patented Technology by Aaron Scott Dishno Ed.D. and HTTP3D Inc. 
// Read the included GNU Ver 3.0 license file for details and additional release information.

function wtwshopping() {
	this.stores = [];
	this.products = [];
}

var WTWShopping = new wtwshopping();

wtwshopping.prototype.newProduct = function() {
	var product = '';
	try {
		product = {
			'storeurl':'',
			'wpplugin':'',
			'connectinggridind':'-1',
			'connectinggridid':'',
			'search':'',
			'productid':'',
			'name':'',
			'slug':'',
			'price':'',
			'categoryid':'',
			'description':'',
			'shortdescription':'',
			'imageid':'',
			'imageurl':'',
			'fetching':'0'
		};
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-newProduct=" + ex.message);
	}
	return product;
}

wtwshopping.prototype.onClick = function(pickedname) {
	try {
		pickedname = pickedname.toLowerCase();
		if (pickedname.indexOf("-storeproduct") > -1 && pickedname.indexOf("-readmore") > -1) {
			WTWShopping.productReadMore(pickedname);
		} else if (pickedname.indexOf("-storeproduct") > -1 && pickedname.indexOf("-addtocart") > -1) {
			WTWShopping.productAddToCart(pickedname);
		} else if (pickedname.indexOf("-storeviewcart") > -1) {
			WTWShopping.productShowCart(pickedname);
		} else if (pickedname.indexOf("-storecategories") > -1 && (pickedname.indexOf("-categorybuttonhover") > -1 || pickedname.indexOf("-base") > -1)) {
			WTWShopping.productSelectCategory(pickedname);
		} else if (pickedname.indexOf("-storecategories") > -1 && pickedname.indexOf("-downbutton") > -1) {
			WTWShopping.productSelectCategoryScroll(pickedname,1);
		} else if (pickedname.indexOf("-storecategories") > -1 && pickedname.indexOf("-upbutton") > -1) {
			WTWShopping.productSelectCategoryScroll(pickedname,-1);
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-onClick=" + ex.message);
	} 
}

wtwshopping.prototype.addStore = function() {
	try {
		var storeiframes = '0';
		if (dGet('wtw_tstoreiframes').checked) {
			storeiframes = '1';
		}
		var request = {
			'storeid':dGet('wtw_tstoreid').value,
			'storename':btoa(dGet('wtw_tstorename').value),
			'storeiframes':storeiframes,
			'storeurl':dGet('wtw_tstoreurl').value,
			'storecarturl':dGet('wtw_tstorecarturl').value,
			'storeproducturl':dGet('wtw_tstoreproducturl').value,
			'woocommerceapiurl':dGet('wtw_tstorewooapiurl').value,
			'woocommercekey':btoa(dGet('wtw_tstorewookey').value),
			'woocommercesecret':btoa(dGet('wtw_tstorewoosecret').value)
		};
		/* function for after iframe loads */
		var onload = function(ipage) {
			ipage.getElementById('wtw_tstoreid').value = request.storeid;
			ipage.getElementById('wtw_tstorename').value = request.storename;
			ipage.getElementById('wtw_tstoreiframes').value = request.storeiframes;
			ipage.getElementById('wtw_tstoreurl').value = request.storeurl;
			ipage.getElementById('wtw_tstorecarturl').value = request.storecarturl;
			ipage.getElementById('wtw_tstoreproducturl').value = request.storeproducturl;
			ipage.getElementById('wtw_twoocommerceapiurl').value = request.woocommerceapiurl;
			ipage.getElementById('wtw_twoocommercekey').value = request.woocommercekey;
			ipage.getElementById('wtw_twoocommercesecret').value = request.woocommercesecret;
			ipage.getElementById('wtw_bsavestore').click();
		}
		/* iframe src, onload function */
		var iframe = WTW.createIFrame('/core/iframes/wtwshopping_stores.php', onload);
		WTWShopping.cancelSaveStore(false);
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-addStore=" + ex.message);
	} 
}

wtwshopping.prototype.deleteStore = function() {
	try {
		var request = {
			'storeid':dGet('wtw_tstoreid').value
		};
		/* function for after iframe loads */
		var onload = function(ipage) {
			ipage.getElementById('wtw_tstoreid').value = request.storeid;
			ipage.getElementById('wtw_bdeletestore').click();
		}
		/* iframe src, onload function */
		var iframe = WTW.createIFrame('/core/iframes/wtwshopping_stores.php', onload);
		WTWShopping.cancelSaveStore(false);
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-deleteStore=" + ex.message);
	} 
}

wtwshopping.prototype.cancelSaveStore = function(zredirect) {
	try {
		dGet('wtw_tstoreid').value = '';
		dGet('wtw_tstorename').value = '';
		dGet('wtw_tstoreiframes').checked = true;
		dGet('wtw_tstoreurl').value = '';
		dGet('wtw_tstorecarturl').value = '';
		dGet('wtw_tstoreproducturl').value = '';
		dGet('wtw_tstorewooapiurl').value = '';
		dGet('wtw_tstorewookey').value = '';
		dGet('wtw_tstorewoosecret').value = '';
		dGet('wtw_shopping_addstoretitle').innerHTML = "Add Store";
		dGet('wtw_baddstore').innerHTML = "Add Store";
		WTW.hide('wtw_bdeletestore');
		if (zredirect) {
			WTW.openFullPageForm('fullpage','List Stores','wtw_liststorespage');parent.WTWShopping.getStores();
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-cancelSaveStore=" + ex.message);
	} 
}

wtwshopping.prototype.saveConnectStore = function(zmoldgroup) {
	try {
		var zrequest = {
			'storeid':WTW.getDDLValue('wtwshopping_' + zmoldgroup + 'connectstore'),
			'communityid':communityid,
			'buildingid':buildingid,
			'thingid':thingid
		};
		/* function for after iframe loads */
		var onload = function(ipage) {
			ipage.getElementById('wtw_tstoreid').value = zrequest.storeid;
			ipage.getElementById('wtw_tcommunityid').value = zrequest.communityid;
			ipage.getElementById('wtw_tbuildingid').value = zrequest.buildingid;
			ipage.getElementById('wtw_tthingid').value = zrequest.thingid;
			ipage.getElementById('wtw_bsaveconnectstore').click();
		}
		/* iframe src, onload function */
		var iframe = WTW.createIFrame('/core/iframes/wtwshopping_stores.php', onload);
		WTW.hideAdminMenu();
		WTW.backToTools();
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-saveConnectStore=" + ex.message);
	} 
}

wtwshopping.prototype.getStores = function() {
	try {
		WTWShopping.stores = [];
		WTW.getJSON("/connect/wtw-shopping-getstores.php", 
			function(zresponse) {
				dGet('wtw_shopping_liststores').innerHTML = "";
				var zliststores = "<table class=\"wtw-table\"><tr><td class=\"wtw-tablecolumnheading\"><b>Store Name</b></td><td class=\"wtw-tablecolumnheading\"><b>Store URL</b></td><td class=\"wtw-tablecolumnheading\"><b>&nbsp;</b></td></tr>";
				zresponse = JSON.parse(zresponse);
				if (zresponse != null) {
					for (var i=0;i<zresponse.length;i++) {
						if (zresponse[i] != null) {
							WTWShopping.stores[i] = zresponse[i];
							zliststores += "<tr><td class=\"wtw-tablecolumns\">" + atob(zresponse[i].storename) + "</td><td class=\"wtw-tablecolumns\"><a href='" + zresponse[i].storeurl + "' target='_blank'>" + zresponse[i].storeurl + "</a></td><td class=\"wtw-tablecolumns\"><div class='wtw-bluebuttonright' onclick=\"WTWShopping.editStore('" + zresponse[i].storeid + "');\">Edit</div></td></tr>";
						}
					}
				}
				zliststores += "</table>";
				dGet('wtw_shopping_liststores').innerHTML = zliststores;
			}
		); 
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-getStores=" + ex.message);
	} 
}

wtwshopping.prototype.getStoresDropdown = function(moldgroup) {
	try {
		WTW.clearDDL('wtwshopping_' + moldgroup + 'connectstore');
		var option0 = document.createElement("option");
		option0.text = "Not Connected";
		option0.value = "";
		dGet('wtwshopping_' + moldgroup + 'connectstore').add(option0);
		WTWShopping.stores = [];
		WTW.getJSON("/connect/wtw-shopping-getstores.php", 
			function(zresponse) {
				zresponse = JSON.parse(zresponse);
				if (zresponse != null) {
					for (var i=0;i<zresponse.length;i++) {
						if (zresponse[i] != null) {
							var option = document.createElement("option");
							option.text = atob(zresponse[i].storename);
							option.value = zresponse[i].storeid;
							dGet('wtwshopping_' + moldgroup + 'connectstore').add(option);
						}
					}
				}
				WTWShopping.setConnectStore(moldgroup);
				WTW.show('wtwshopping_admin' + moldgroup + 'storesdiv');
			}
		); 
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-getStoresDropdown=" + ex.message);
	} 
}

wtwshopping.prototype.setConnectStore = function(moldgroup) {
	try {
		WTW.getJSON("/connect/wtw-shopping-getconnectstore.php?communityid=" + communityid + "&buildingid=" + buildingid + "&thingid=" + thingid, 
			function(zresponse) {
				zresponse = JSON.parse(zresponse);
				if (zresponse != null) {
					for (var i=0;i<zresponse.length;i++) {
						if (zresponse[i] != null) {
							WTW.setDDLValue('wtwshopping_' + moldgroup + 'connectstore', zresponse[i].storeid);
						}
					}
				}
				
			}
		); 
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-setConnectStore=" + ex.message);
	} 
}

wtwshopping.prototype.editStore = function(zstoreid) {
	try {
		for (var i=0;i< WTWShopping.stores.length;i++) {
			if (WTWShopping.stores[i] != null) {
				if (WTWShopping.stores[i].storeid == zstoreid) {
					WTW.openFullPageForm('fullpage','Edit Store','wtw_addstoresettingspage');
					if (WTWShopping.stores[i].storeiframes == "1") {
						dGet('wtw_tstoreiframes').checked = true;
					} else {
						dGet('wtw_tstoreiframes').checked = false;
					}
					dGet('wtw_tstoreid').value = zstoreid;
					dGet('wtw_tstorename').value = atob(WTWShopping.stores[i].storename);
					dGet('wtw_tstoreurl').value = WTWShopping.stores[i].storeurl;
					dGet('wtw_tstorecarturl').value = WTWShopping.stores[i].storecarturl;
					dGet('wtw_tstoreproducturl').value = WTWShopping.stores[i].storeproducturl;
					dGet('wtw_tstorewooapiurl').value = WTWShopping.stores[i].woocommerceapiurl;
					dGet('wtw_tstorewookey').value = atob(WTWShopping.stores[i].woocommercekey);
					dGet('wtw_tstorewoosecret').value = atob(WTWShopping.stores[i].woocommercesecret);
					dGet('wtw_shopping_addstoretitle').innerHTML = "Edit Store";
					dGet('wtw_baddstore').innerHTML = "Save Store";
					WTW.show('wtw_bdeletestore');
				}
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-editStore=" + ex.message);
	} 
}

wtwshopping.prototype.loadProductDisplay = function(moldname, productname, price, productid, slug, imageurl, shortdescription, description) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		var zcommunityid = moldnameparts.communityid;
		var zbuildingid = moldnameparts.buildingid;
		var zthingid = moldnameparts.thingid;
		var zstoreinfo = WTWShopping.getStoreID(zcommunityid, zbuildingid, zthingid);
		if (imageurl != '' && zstoreinfo.storeurl != "") {
			var pimage = scene.getMeshByID(moldname + "-clickimage");
			if (pimage != null) {
				try {
					if (pimage.material.diffuseTexture != null) {
						pimage.material.diffuseTexture.dispose();
						pimage.material.diffuseTexture = null;
					}
				} catch(ex) {}
				try {
					if (pimage.material != null) {
						pimage.material.dispose();
						pimage.material = null;
					}
				} catch(ex) {}
			}
			var pimage2 = scene.getMeshByID(moldname + "-clickimage2");
			if (pimage2 != null) {
				try {
					if (pimage2.material.diffuseTexture != null) {
						pimage2.material.diffuseTexture.dispose();
						pimage2.material.diffuseTexture = null;
					}
				} catch(ex) {}
				try {
					if (pimage2.material != null) {
						pimage2.material.dispose();
						pimage2.material = null;
					}
				} catch(ex) {}
			}
			WTW.getJSON(zstoreinfo.storeurl + "/walktheweb/image.php?walktheweb_image_url=" + imageurl, 
				function(response2) {
				if (response2 != null) {
						var imagedata = JSON.parse(response2);
						var newimage = new Image();
						newimage.src = imagedata[0].url;  
						newimage.onload = function() {
							var opacity = 1;
							var covering = new BABYLON.StandardMaterial("cubemat" + moldname + "-clickimage", scene);
							covering.diffuseTexture = new BABYLON.Texture.CreateFromBase64String(imagedata[0].data, "cubemat" + moldname + "-clickimagemat", scene);
							covering.alpha = opacity;
							covering.specularColor = new BABYLON.Color3(opacity, opacity, opacity);
							/* covering.emissiveColor = new BABYLON.Color3(opacity, opacity, opacity); */
							covering.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
							covering.diffuseColor = new BABYLON.Color3(opacity, opacity, opacity);		
							var pimage = scene.getMeshByID(moldname + "-clickimage");
							if (pimage != null) {
								pimage.isVisible = true;
								pimage.material = covering;
							}
							var pimage2 = scene.getMeshByID(moldname + "-clickimage2");
							if (pimage2 != null) {
								pimage2.isVisible = true;
								pimage2.material = covering;
							}
						}
						var lineheigth = "34px";
						var fontheight = "40px";
						var titleimage = scene.getMeshByID(moldname + "-titleimage");
						if (titleimage == null) {
							titleimage = scene.getMeshByID(moldname + "-titleimagesm");
						}
						if (titleimage != null) {
							try {
								if (titleimage.material.diffuseTexture != null) {
									titleimage.material.diffuseTexture.dispose();
									titleimage.material.diffuseTexture = null;
								}
							} catch(ex) {}
							try {
								if (titleimage.material != null) {
									titleimage.material.dispose();
									titleimage.material = null;
								}
							} catch(ex) {}
							var coveringtitle = new BABYLON.StandardMaterial("mat" + moldname + "-titleimagetexture", scene);
							coveringtitle.alpha = 1;
							coveringtitle.specularColor = new BABYLON.Color3(.7, .7, .7);
							/* coveringtitle.emissiveColor = new BABYLON.Color3(.7, .7, .7); */
							coveringtitle.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
							coveringtitle.diffuseColor = new BABYLON.Color3(.7, .7, .7);
							var contentTexture = new BABYLON.DynamicTexture(moldname + "-titleimagetexture", {width: 512,height: 512}, scene, true);
							contentTexture.name = moldname + "-titleimagetexture";
							coveringtitle.diffuseTexture = contentTexture;
							titleimage.material = coveringtitle;
							var namelength = WTW.cleanHTMLText(productname).length;
							
							if (namelength > 224) {
								lineheigth = "10px";
								fontheight = "12px";
							} else if (namelength > 120) {
								lineheigth = "14px";
								fontheight = "16px";
							} else if (namelength > 50) {
								lineheigth = "18px";
								fontheight = "20px";
							} else if (namelength > 32) {
								lineheigth = "20px";
								fontheight = "24px";
							} else if (namelength > 27) {
								lineheigth = "24px";
								fontheight = "30px";
							} else if (namelength > 22) {
								lineheigth = "30px";
								fontheight = "36px";
							}
							WTW.wrapText(titleimage, WTW.cleanHTMLText(productname), lineheigth, fontheight, "center", "top", "white", 5, 0);
							if (titleimage.name.indexOf("-titleimagesm") > -1) {
								coveringtitle.diffuseTexture.vScale = .1;
								coveringtitle.diffuseTexture.vOffset = .9;
							}
						}
						var titleimage2 = scene.getMeshByID(moldname + "-titleimage2");
						if (titleimage2 == null) {
							titleimage2 = scene.getMeshByID(moldname + "-titleimage2sm");
						}
						if (titleimage2 != null) {
							try {
								if (titleimage2.material.diffuseTexture != null) {
									titleimage2.material.diffuseTexture.dispose();
									titleimage2.material.diffuseTexture = null;
								}
							} catch(ex) {}
							try {
								if (titleimage2.material != null) {
									titleimage2.material.dispose();
									titleimage2.material = null;
								}
							} catch(ex) {}
							var coveringtitle2 = new BABYLON.StandardMaterial("mat" + moldname + "-titleimage2texture", scene);
							coveringtitle2.alpha = 1;
							coveringtitle2.specularColor = new BABYLON.Color3(.7, .7, .7);
							/* coveringtitle2.emissiveColor = new BABYLON.Color3(.7, .7, .7); */
							coveringtitle2.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
							coveringtitle2.diffuseColor = new BABYLON.Color3(.7, .7, .7);
							var contentTexture2 = new BABYLON.DynamicTexture(moldname + "-titleimage2texture", {width: 512,height: 512}, scene, true);
							contentTexture2.name = moldname + "-titleimage2texture";
							coveringtitle2.diffuseTexture = contentTexture2;
							titleimage2.material = coveringtitle2;
							WTW.wrapText(titleimage2, WTW.cleanHTMLText(productname), lineheigth, fontheight, "center", "top", "white", 0, 0);
							if (titleimage2.name.indexOf("-titleimage2sm") > -1) {
								coveringtitle2.diffuseTexture.vScale = .1;
								coveringtitle2.diffuseTexture.vOffset = .9;
							}
						}
						var desctext = "";
						if (shortdescription != null) {
							if (shortdescription != undefined) {
								if (shortdescription.length > 0) {
									desctext = shortdescription;
								}
							}
						}
						if (desctext == "") {
							if (description != null) {
								if (description != undefined) {
									if (description.length > 0) {
										desctext = description;
									}
								}
							}
						}
						var descimage1 = scene.getMeshByID(moldname + "-descimage1");
						if (descimage1 != null) {
							try {
								if (descimage1.material.diffuseTexture != null) {
									descimage1.material.diffuseTexture.dispose();
									descimage1.material.diffuseTexture = null;
								}
							} catch(ex) {}
							try {
								if (descimage1.material != null) {
									descimage1.material.dispose();
									descimage1.material = null;
								}
							} catch(ex) {}
							var coveringdesc1 = new BABYLON.StandardMaterial("mat" + moldname + "-descimage1texture", scene);
							coveringdesc1.alpha = 0;
							coveringdesc1.specularColor = new BABYLON.Color3(.7, .7, .7);
							/* coveringdesc1.emissiveColor = new BABYLON.Color3(.7, .7, .7); */
							coveringdesc1.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
							coveringdesc1.diffuseColor = new BABYLON.Color3(.7, .7, .7);
							var contentTexture3 = new BABYLON.DynamicTexture(moldname + "-descimage1texture", {width: 512,height: 512}, scene, true);
							contentTexture3.name = moldname + "-descimage1texture";
							coveringdesc1.diffuseTexture = contentTexture3;
							descimage1.material = coveringdesc1;
							WTW.wrapText(descimage1, WTW.cleanHTMLText(desctext), "30px", "30px", "left", "top", "white", 0, 0, "90%", "20px", "10px"); // , tmaxwidth, tmarginleft, tmarginright, tfloat, tfloatwidth, tfloatheight
						}

						var descimage2 = scene.getMeshByID(moldname + "-descimage2");
						if (descimage2 != null) {
							try {
								if (descimage2.material.diffuseTexture != null) {
									descimage2.material.diffuseTexture.dispose();
									descimage2.material.diffuseTexture = null;
								}
							} catch(ex) {}
							try {
								if (descimage2.material != null) {
									descimage2.material.dispose();
									descimage2.material = null;
								}
							} catch(ex) {}
							var coveringdesc2 = new BABYLON.StandardMaterial("mat" + moldname + "-descimage2texture", scene);
							coveringdesc2.alpha = 0;
							coveringdesc2.specularColor = new BABYLON.Color3(.7, .7, .7);
							/* coveringdesc2.emissiveColor = new BABYLON.Color3(.7, .7, .7); */
							coveringdesc2.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
							coveringdesc2.diffuseColor = new BABYLON.Color3(.7, .7, .7);
							var contentTexture4 = new BABYLON.DynamicTexture(moldname + "-descimage2texture", {width: 512,height: 512}, scene, true);
							contentTexture4.name = moldname + "-descimage2texture";
							coveringdesc2.diffuseTexture = contentTexture4;
							descimage2.material = coveringdesc2;
							WTW.wrapText(descimage2, WTW.cleanHTMLText(desctext), "30px", "30px", "left", "top", "white", 0, 0, "90%", "20px", "10px");
						}

						var readmore1 = scene.getMeshByID(moldname + "-readmore1");
						if (readmore1 != null) {
							try {
								if (readmore1.material.diffuseTexture != null) {
									readmore1.material.diffuseTexture.dispose();
									readmore1.material.diffuseTexture = null;
								}
							} catch(ex) {}
							try {
								if (readmore1.material != null) {
									readmore1.material.dispose();
									readmore1.material = null;
								}
							} catch(ex) {}
							var coveringread1 = new BABYLON.StandardMaterial("mat" + moldname + "-readimage1texture", scene);
							coveringread1.alpha = 1;
							coveringread1.specularColor = new BABYLON.Color3(.2, .2, .2);
							/* coveringread1.emissiveColor = new BABYLON.Color3(1, 1, 1); */
							coveringread1.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
							coveringread1.diffuseColor = new BABYLON.Color3(.9, .9, .9);
							var readTexture1 = new BABYLON.DynamicTexture(moldname + "-readimage1texture", {width: 512,height: 512}, scene, true);
							readTexture1.name = moldname + "-readimage1texture";
							/* readTexture1.hasAlpha = true; */
							coveringread1.diffuseTexture = readTexture1;
							coveringread1.diffuseTexture.vScale = .2;
							coveringread1.diffuseTexture.uScale = 1;
							coveringread1.diffuseTexture.vOffset = .85;
							readmore1.material = coveringread1;
							WTW.wrapText(readmore1, "$" + Number(price).toFixed(2), lineheigth, fontheight, "center", "top", "white", 0, 0);
						}							
						
						var readmore2 = scene.getMeshByID(moldname + "-readmore2");
						if (readmore2 != null) {
							try {
								if (readmore2.material.diffuseTexture != null) {
									readmore2.material.diffuseTexture.dispose();
									readmore2.material.diffuseTexture = null;
								}
							} catch(ex) {}
							try {
								if (readmore2.material != null) {
									readmore2.material.dispose();
									readmore2.material = null;
								}
							} catch(ex) {}
							var coveringread2 = new BABYLON.StandardMaterial("mat" + moldname + "-readimage2texture", scene);
							coveringread2.alpha = 1;
							coveringread2.specularColor = new BABYLON.Color3(.2, .2, .2);
							/* coveringread2.emissiveColor = new BABYLON.Color3(1, 1, 1); */
							coveringread2.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
							coveringread2.diffuseColor = new BABYLON.Color3(.9, .9, .9);
							var readTexture2 = new BABYLON.DynamicTexture(moldname + "-readimage2texture", {width: 512,height: 512}, scene, true);
							readTexture2.name = moldname + "-readimage2texture";
							/* readTexture2.hasAlpha = true; */
							coveringread2.diffuseTexture = readTexture2;
							coveringread2.diffuseTexture.vScale = .2;
							coveringread2.diffuseTexture.uScale = 1;
							coveringread2.diffuseTexture.vOffset = .85;
							readmore2.material = coveringread2;
							WTW.wrapText(readmore2, "$" + Number(price).toFixed(2), lineheigth, fontheight, "center", "top", "white", 0, 0);
						}
						var price1 = scene.getMeshByID(moldname + "-price1");
						if (price1 != null) {
							try {
								if (price1.material.diffuseTexture != null) {
									price1.material.diffuseTexture.dispose();
									price1.material.diffuseTexture = null;
								}
							} catch(ex) {}
							try {
								if (price1.material != null) {
									price1.material.dispose();
									price1.material = null;
								}
							} catch(ex) {}
							var coveringprice1 = new BABYLON.StandardMaterial("mat" + moldname + "-coveringprice1texture", scene);
							coveringprice1.alpha = 1;
							coveringprice1.specularColor = new BABYLON.Color3(.2, .2, .2);
							/* coveringprice1.emissiveColor = new BABYLON.Color3(1, 1, 1); */
							coveringprice1.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
							coveringprice1.diffuseColor = new BABYLON.Color3(.9, .9, .9);
							var priceTexture1 = new BABYLON.DynamicTexture(moldname + "-coveringprice1texture", {width: 512,height: 512}, scene, true);
							priceTexture1.name = moldname + "-coveringprice1texture";
							/* priceTexture1.hasAlpha = true; */
							coveringprice1.diffuseTexture = priceTexture1;
							coveringprice1.diffuseTexture.uScale = 1;
							coveringprice1.diffuseTexture.vScale = .08;
							coveringprice1.diffuseTexture.vOffset = .92;
							price1.material = coveringprice1;
							WTW.wrapText(price1, "$" + Number(price).toFixed(2), lineheigth, fontheight, "center", "top", "white", 0, 0);
						}
						var price2 = scene.getMeshByID(moldname + "-price2");
						if (price2 != null) {
							try {
								if (price2.material.diffuseTexture != null) {
									price2.material.diffuseTexture.dispose();
									price2.material.diffuseTexture = null;
								}
							} catch(ex) {}
							try {
								if (price2.material != null) {
									price2.material.dispose();
									price2.material = null;
								}
							} catch(ex) {}
							var coveringprice1 = new BABYLON.StandardMaterial("mat" + moldname + "-coveringprice1texture", scene);
							coveringprice1.alpha = 1;
							coveringprice1.specularColor = new BABYLON.Color3(.2, .2, .2);
							/* coveringprice1.emissiveColor = new BABYLON.Color3(1, 1, 1); */
							coveringprice1.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
							coveringprice1.diffuseColor = new BABYLON.Color3(.9, .9, .9);
							var priceTexture1 = new BABYLON.DynamicTexture(moldname + "-coveringprice1texture", {width: 512,height: 512}, scene, true);
							priceTexture1.name = moldname + "-coveringprice1texture";
							/* priceTexture1.hasAlpha = true; */
							coveringprice1.diffuseTexture = priceTexture1;
							coveringprice1.diffuseTexture.uScale = 1;
							coveringprice1.diffuseTexture.vScale = .08;
							coveringprice1.diffuseTexture.vOffset = .92;
							price2.material = coveringprice1;
							WTW.wrapText(price2, "$" + Number(price).toFixed(2), lineheigth, fontheight, "center", "top", "white", 0, 0);
						}
					} 
				}
			);
		}
	} catch (ex) { 
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-loadProductDisplay=" + ex.message);
	}
}

wtwshopping.prototype.productReadMore = function(moldname) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		var zstoreinfo = WTWShopping.getStoreID(moldnameparts.communityid, moldnameparts.buildingid, moldnameparts.thingid);
		if (moldnameparts.moldind > -1 && zstoreinfo.storeproducturl != "") {
			if (moldnameparts.molds[moldnameparts.moldind] != null) {
				if (zstoreinfo.storeiframes == '1') {
					window.setTimeout(function() {
						WTW.openIFrame(zstoreinfo.storeproducturl + moldnameparts.molds[moldnameparts.moldind].store.slug + "/", .8, .8);
					},500);
				} else {
					WTW.openWebpage(zstoreinfo.storeproducturl + moldnameparts.molds[moldnameparts.moldind].store.slug + "/", '_blank');
				}
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-productReadMore=" + ex.message);
	}  
}

wtwshopping.prototype.productAddToCart = function(moldname) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		var zstoreinfo = WTWShopping.getStoreID(moldnameparts.communityid, moldnameparts.buildingid, moldnameparts.thingid);
		if (moldnameparts.moldind > -1 && zstoreinfo.storecarturl != "") {
			if (moldnameparts.molds[moldnameparts.moldind] != null) {
				var product = moldnameparts.molds[moldnameparts.moldind].store.productid;
				var productid = "";
				var slug = "";
				if (product.indexOf("|") > -1) {
					var productinfo = product.split('|');
					productid = productinfo[0];
					slug = productinfo[1];
				} else {
					productid = product;
				}
				if (zstoreinfo.storeiframes == '1') {
					window.setTimeout(function() {
						WTW.openIFrame(zstoreinfo.storecarturl + "?add-to-cart=" + productid, .8, .8);
					},500);
				} else {
					WTW.openWebpage(zstoreinfo.storecarturl + "?add-to-cart=" + productid, '_blank');
				}
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-productAddToCart=" + ex.message);
	}  
}

wtwshopping.prototype.productShowCart = function(moldname) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		var zstoreinfo = WTWShopping.getStoreID(moldnameparts.communityid, moldnameparts.buildingid, moldnameparts.thingid);
		if (zstoreinfo.storecarturl != "") {
			if (zstoreinfo.storeiframes == '1') {
				WTW.openIFrame(zstoreinfo.storecarturl, .8, .8);
			} else {
				WTW.openWebpage(zstoreinfo.storecarturl, '_blank');
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-productShowCart=" + ex.message);
	}  
}

wtwshopping.prototype.productSelectCategory = function(moldname) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		WTWShopping.productClearForSearchResults(moldnameparts.cgid, moldnameparts.cgind);
		WTWShopping.products = [];
		if (moldnameparts.namepart[7] != null) {
			WTWShopping.productFetchProducts(moldname,moldnameparts.namepart[7]);
		} else {
			WTWShopping.productFetchProducts(moldname,'');
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-productSelectCategory=" + ex.message);
	}  
}

wtwshopping.prototype.productSelectCategoryScroll = function(moldname, increment) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		var catbuttonname = moldname.replace("downbuttonhover","categorybutton").replace("upbuttonhover","categorybutton");
		var storecategories = scene.getMeshByID(catbuttonname.replace("-categorybutton",""));
		var upbutton = scene.getMeshByID(catbuttonname.replace("categorybutton","upbutton"));
		var upbuttonhover = scene.getMeshByID(catbuttonname.replace("categorybutton","upbuttonhover"));
		var downbutton = scene.getMeshByID(catbuttonname.replace("categorybutton","downbutton"));
		var downbuttonhover = scene.getMeshByID(catbuttonname.replace("categorybutton","downbuttonhover"));
		var move = 0;
		if (upbutton != null && upbuttonhover != null) {
			if (increment < 0 && upbutton.visibility == 1) {
				move = 1;
			}
		}
		if (downbutton != null && downbuttonhover != null) {
			if (increment > 0 && downbutton.visibility == 1) {
				move = 1;
			}
		}
		if (storecategories != null && move == 1) {
			var leny = storecategories.scaling.y;
			var firsty = leny * .42;
			var lasty = -leny * .42;
			var showup = 0;
			var showdown = 0;
			for (var i=0;i<scene.meshes.length;i++) {
				if (scene.meshes[i] != null) {
					if (scene.meshes[i].id != undefined) {
						if (scene.meshes[i].id.indexOf(catbuttonname) > -1) {
							var catbutton = scene.getMeshByID(scene.meshes[i].id);
							if (catbutton != null) {
								catbutton.position.y += increment;
								if (catbutton.position.y > firsty) {
									catbutton.visibility = 0;
									showup = 1;
								} else if (catbutton.position.y < lasty) {
									catbutton.visibility = 0;
									showdown = 1;
								} else {
									catbutton.visibility = 1;
								}
							}
						}
					}
				}
			}
			if (upbutton != null && upbuttonhover != null) {
				if (showup == 1) {
					upbutton.visibility = 1;
					upbuttonhover.visibility = 1;
				} else {
					upbutton.visibility = 0;
					upbuttonhover.visibility = 0;
				}
			}
			if (downbutton != null && downbuttonhover != null) {
				if (showdown == 1) {
					downbutton.visibility = 1;
					downbuttonhover.visibility = 1;
				} else {
					downbutton.visibility = 0;
					downbuttonhover.visibility = 0;
				}
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-productSelectCategoryScroll=" + ex.message);
	}  
}

wtwshopping.prototype.productFetchProducts = function(moldname, categoryid) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		var zcommunityid = moldnameparts.communityid;
		var zbuildingid = moldnameparts.buildingid;
		var zthingid = moldnameparts.thingid;
		var zstoreinfo = WTWShopping.getStoreID(zcommunityid, zbuildingid, zthingid);
		if (zstoreinfo.woocommerceapiurl != "") {
			var url = zstoreinfo.woocommerceapiurl + "products/?per_page=50&consumer_key=" + atob(zstoreinfo.woocommercekey) + "&consumer_secret=" + atob(zstoreinfo.woocommercesecret);
			if (categoryid != "") {
				url = zstoreinfo.woocommerceapiurl + "products/?per_page=50&category=" + categoryid + "&consumer_key=" + atob(zstoreinfo.woocommercekey) + "&consumer_secret=" + atob(zstoreinfo.woocommercesecret);
			}
			WTW.getJSON(url, 
				function(response) {
					WTWShopping.productLoadProducts(moldname, JSON.parse(response), zstoreinfo.storeurl, 'walktheweb');
				}
			);
		} 
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-productFetchProducts=" + ex.message);
	}  
}

wtwshopping.prototype.productLoadProducts = function(moldname, response, storeurl, wpplugin) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		for (var i=0;i<response.length;i++) {
			if (response[i] != null) {
				var categoryid = "";
				if (response[i].categories != null) {
					if (response[i].categories[0] != null) {
						categoryid = response[i].categories[0].id;
					}
				}
				var newproductind = WTWShopping.products.length;
				WTWShopping.products[newproductind] = WTWShopping.newProduct();
				WTWShopping.products[newproductind].storeurl = storeurl;
				WTWShopping.products[newproductind].wpplugin = wpplugin;
				WTWShopping.products[newproductind].connectinggridind = moldnameparts.cgind.toString();
				WTWShopping.products[newproductind].connectinggridid = moldnameparts.cgid;
				WTWShopping.products[newproductind].search = '';
				WTWShopping.products[newproductind].productid = response[i].id;
				WTWShopping.products[newproductind].name = WTW.encode(WTW.cleanHTMLText(response[i].name));
				WTWShopping.products[newproductind].slug = response[i].slug;
				WTWShopping.products[newproductind].price = response[i].price;
				WTWShopping.products[newproductind].categoryid = categoryid;
				WTWShopping.products[newproductind].description = WTW.encode(WTW.cleanHTMLText(response[i].description));
				WTWShopping.products[newproductind].shortdescription = WTW.encode(WTW.cleanHTMLText(response[i].short_description));
				WTWShopping.products[newproductind].fetching = '0';
				if (response[i].images[0] != null) {
					WTWShopping.products[newproductind].imageid = response[i].images[0].id;
					WTWShopping.products[newproductind].imageurl = response[i].images[0].src;
				}
			}
		}
		if (moldname.indexOf("storecategories") > -1) {
			WTWShopping.productLoadSearchResults(moldname, moldnameparts.cgid, moldnameparts.cgind);
		} else {
			WTWShopping.productClearFetchProducts(moldname);
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-productLoadProducts=" + ex.message);
	}  
}


wtwshopping.prototype.productClearFetchProducts = function(moldname) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		if (WTWShopping.products != null) {
			for (var i=WTWShopping.products.length;i > -1 ;i--) {
				if (WTWShopping.products[i] != null) {
					if (WTWShopping.products[i].fetching == "1" && WTWShopping.products[i].connectinggridind.toString() == moldnameparts.cgind.toString() && WTWShopping.products[i].connectinggridid == moldnameparts.cgid) {
						WTWShopping.products.splice(i,1);
					}
				}
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-productClearFetchProducts=" + ex.message);
	}  
}

wtwshopping.prototype.productFetchCategories = function(moldname) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		var zcommunityid = moldnameparts.communityid;
		var zbuildingid = moldnameparts.buildingid;
		var zthingid = moldnameparts.thingid;
		var zstoreinfo = WTWShopping.getStoreID(zcommunityid, zbuildingid, zthingid);
		if (zstoreinfo.woocommerceapiurl != "") {
			var url = zstoreinfo.woocommerceapiurl + "products/categories/?per_page=50&orderby=slug&consumer_key=" + atob(zstoreinfo.woocommercekey) + "&consumer_secret=" + atob(zstoreinfo.woocommercesecret);
			WTW.getJSON(url, 
				function(response) {
					WTWShopping.productLoadCategories(moldname, JSON.parse(response));
				}
			);
		} 
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-productFetchCategories=" + ex.message);
	}  
}

wtwshopping.prototype.productLoadCategories = function(moldname, response) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		var molddef = moldnameparts.molds[moldnameparts.moldind];
		var lenx = 1;
		var leny = 1;
		var lenz = 1;
		var firsty = 0;
		var incy = 0;
		var lasty = -5;
		var once = 0;
		var basemold = scene.getMeshByID(moldname + "-base");
		if (molddef != null) {
			if (molddef.scaling != undefined) {
				if (molddef.scaling.x != undefined) {
					lenx = Number(molddef.scaling.x);
				}
				if (molddef.scaling.y != undefined) {
					leny = Number(molddef.scaling.y);
				}
				if (molddef.scaling.z != undefined) {
					lenz = Number(molddef.scaling.z);
				}
			}
		}
		firsty = leny/2 -2.1;
		lasty = -leny/2 + 1;
		var categorybuttonall = BABYLON.MeshBuilder.CreateBox(moldname + "-categorybutton-", {}, scene);
		categorybuttonall.scaling = new BABYLON.Vector3(.2, lenz - 1, .9);
		categorybuttonall.position = new BABYLON.Vector3(-lenx/2 + .25, firsty, 0);
		categorybuttonall.rotation.x = WTW.getRadians(-90);
		categorybuttonall.parent = basemold;

		var categorybuttontextureall = new BABYLON.StandardMaterial("mat" + moldname + "-categorybuttontexture-", scene);
		categorybuttontextureall.alpha = 1;
		categorybuttontextureall.specularColor = new BABYLON.Color3(.2, .2, .2);
		/* categorybuttontextureall.emissiveColor = new BABYLON.Color3(1, 1, 1); */
		categorybuttontextureall.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
		categorybuttontextureall.diffuseColor = new BABYLON.Color3(.9, .9, .9);
		var categoryTextureall = new BABYLON.DynamicTexture(moldname + "-categorybuttontexture-", {width: 512,height: 512}, scene, true);
		categoryTextureall.name = moldname + "-categorybuttontexture-";
		/* categoryTextureall.hasAlpha = true; */
		categorybuttontextureall.diffuseTexture = categoryTextureall;
		categorybuttontextureall.diffuseTexture.vScale = .11;
		categorybuttontextureall.diffuseTexture.uScale = 1;
		categorybuttontextureall.diffuseTexture.vOffset = .88;
		categorybuttonall.material = categorybuttontextureall;
		WTW.wrapText(categorybuttonall, "All", "45px", "40px", "center", "top", "white", 0, 0);
		
		var categorybuttonhoverall = BABYLON.MeshBuilder.CreateBox(moldname + "-categorybuttonhover-", {}, scene);
		categorybuttonhoverall.scaling = new BABYLON.Vector3(.2, lenz - .99, .91);
		categorybuttonhoverall.position = new BABYLON.Vector3(-lenx/2 + .15, firsty, 0);
		categorybuttonhoverall.rotation.x = WTW.getRadians(-90);
		categorybuttonhoverall.parent = basemold;
		
		var categorybuttontexturehoverall = new BABYLON.StandardMaterial("mat" + moldname + "-categorybuttontexturehover-", scene);
		categorybuttontexturehoverall.alpha = 0;
		categorybuttontexturehoverall.specularColor = new BABYLON.Color3(.2, .2, .2);
		/* categorybuttontexturehoverall.emissiveColor = new BABYLON.Color3(1, 1, 1); */
		categorybuttontexturehoverall.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
		categorybuttontexturehoverall.diffuseColor = new BABYLON.Color3(.9, .9, .9);
		var categorytexturehoverall = new BABYLON.DynamicTexture(moldname + "-categorytexturehover-", {width: 512,height: 512}, scene, true);
		categorytexturehoverall.name = moldname + "-categorytexturehover-";
		/* categorytexturehoverall.hasAlpha = true; */
		categorybuttontexturehoverall.diffuseTexture = categorytexturehoverall;
		categorybuttontexturehoverall.diffuseTexture.vScale = .11;
		categorybuttontexturehoverall.diffuseTexture.uScale = 1;
		categorybuttontexturehoverall.diffuseTexture.vOffset = .88;
		categorybuttonhoverall.material = categorybuttontexturehoverall;
		WTW.wrapText(categorybuttonhoverall, "All", "45px", "40px", "center", "top", "yellow", 0, 0);
		WTW.registerMouseOver(categorybuttonhoverall);
		incy -= 1;
		if (response != null) {
			for (var i=0;i<response.length;i++) {
				if (response[i] != null) {
					var categoryid = response[i].id;
					var categoryname = response[i].name;
					var categoryslug = response[i].slug;
					if (categoryname != "") {
						var categorybutton = BABYLON.MeshBuilder.CreateBox(moldname + "-categorybutton-" + categoryid, {}, scene);
						categorybutton.scaling = new BABYLON.Vector3(.2, lenz - 1, .9);
						categorybutton.position = new BABYLON.Vector3(-lenx/2 + .25, firsty + incy, 0);
						categorybutton.rotation.x = WTW.getRadians(-90);
						categorybutton.parent = basemold;

						var categorybuttontexture = new BABYLON.StandardMaterial("mat" + moldname + "-categorybuttontexture-" + categoryid, scene);
						categorybuttontexture.alpha = 1;
						categorybuttontexture.specularColor = new BABYLON.Color3(.2, .2, .2);
						/* categorybuttontexture.emissiveColor = new BABYLON.Color3(1, 1, 1); */
						categorybuttontexture.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
						categorybuttontexture.diffuseColor = new BABYLON.Color3(.9, .9, .9);
						var categoryTexture = new BABYLON.DynamicTexture(moldname + "-categorybuttontexture-" + categoryid, {width: 512,height: 512}, scene, true);
						categoryTexture.name = moldname + "-categorybuttontexture-" + categoryid;
						/* categoryTexture.hasAlpha = true; */
						categorybuttontexture.diffuseTexture = categoryTexture;
						categorybuttontexture.diffuseTexture.vScale = .11;
						categorybuttontexture.diffuseTexture.uScale = 1;
						categorybuttontexture.diffuseTexture.vOffset = .88;
						categorybutton.material = categorybuttontexture;
						WTW.wrapText(categorybutton, categoryname, "45px", "40px", "center", "top", "white", 0, 0);
						
						var categorybuttonhover = BABYLON.MeshBuilder.CreateBox(moldname + "-categorybuttonhover-" + categoryid, {}, scene);
						categorybuttonhover.scaling = new BABYLON.Vector3(.2, lenz - .99, .91);
						categorybuttonhover.position = new BABYLON.Vector3(-lenx/2 + .15, firsty + incy, 0);
						categorybuttonhover.rotation.x = WTW.getRadians(-90);
						categorybuttonhover.parent = basemold;
						
						var categorybuttontexturehover = new BABYLON.StandardMaterial("mat" + moldname + "-categorybuttontexturehover-" + categoryid, scene);
						categorybuttontexturehover.alpha = 0;
						categorybuttontexturehover.specularColor = new BABYLON.Color3(.2, .2, .2);
						/* categorybuttontexturehover.emissiveColor = new BABYLON.Color3(1, 1, 1); */
						categorybuttontexturehover.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
						categorybuttontexturehover.diffuseColor = new BABYLON.Color3(.9, .9, .9);
						var categorytexturehover = new BABYLON.DynamicTexture(moldname + "-categorytexturehover-" + categoryid, {width: 512,height: 512}, scene, true);
						categorytexturehover.name = moldname + "-categorytexturehover-" + categoryid;
						/* categorytexturehover.hasAlpha = true; */
						categorybuttontexturehover.diffuseTexture = categorytexturehover;
						categorybuttontexturehover.diffuseTexture.vScale = .11;
						categorybuttontexturehover.diffuseTexture.uScale = 1;
						categorybuttontexturehover.diffuseTexture.vOffset = .88;
						categorybuttonhover.material = categorybuttontexturehover;
						WTW.wrapText(categorybuttonhover, categoryname, "45px", "40px", "center", "top", "yellow", 0, 0);
						WTW.registerMouseOver(categorybuttonhover);

						if (lasty > firsty + incy) {
							categorybutton.visibility = 0;
							categorybuttonhover.visibility = 0;
							
							if (once == 0) {
								var upbutton = BABYLON.MeshBuilder.CreateBox(moldname + "-upbutton", {}, scene);
								upbutton.scaling = new BABYLON.Vector3(.9, .9, .9);
								upbutton.position = new BABYLON.Vector3(-lenx/2 + .4, firsty + 1.1, -lenz/2 + .75);
								upbutton.rotation.x = WTW.getRadians(-90);
								upbutton.parent = basemold;
								
								var upbuttontexture = new BABYLON.StandardMaterial("mat" + moldname + "-upbutton", scene);
								upbuttontexture.emissiveTexture = new BABYLON.Texture("/content/system/images/arrowscrollup.jpg", scene);
								upbutton.material = upbuttontexture;
								upbutton.visibility = 0;

								var upbuttonhover = BABYLON.MeshBuilder.CreateBox(moldname + "-upbuttonhover", {}, scene);
								upbuttonhover.scaling = new BABYLON.Vector3(.95, .95, .95);
								upbuttonhover.position = new BABYLON.Vector3(-lenx/2 + .4, firsty + 1.1, -lenz/2 + .75);
								upbuttonhover.rotation.x = WTW.getRadians(-90);
								upbuttonhover.parent = basemold;
								
								var upbuttontexturehover = new BABYLON.StandardMaterial("mat" + moldname + "-upbuttonhover", scene);
								upbuttontexturehover.emissiveTexture = new BABYLON.Texture("/content/system/images/arrowscrollup2.jpg", scene);
								upbuttonhover.material = upbuttontexturehover;
								upbuttonhover.material.alpha = 0;
								WTW.registerMouseOver(upbuttonhover);
								upbuttonhover.visibility = 0;

								var downbutton = BABYLON.MeshBuilder.CreateBox(moldname + "-downbutton", {}, scene);
								downbutton.scaling = new BABYLON.Vector3(.9, .9, .9);
								downbutton.position = new BABYLON.Vector3(-lenx/2 + .4, lasty, -lenz/2 + .75);
								downbutton.rotation.x = WTW.getRadians(-90);
								downbutton.parent = basemold;
								
								var downbuttontexture = new BABYLON.StandardMaterial("mat" + moldname + "-downbutton", scene);
								downbuttontexture.emissiveTexture = new BABYLON.Texture("/content/system/images/arrowscrolldown.jpg", scene);
								downbutton.material = downbuttontexture;

								var downbuttonhover = BABYLON.MeshBuilder.CreateBox(moldname + "-downbuttonhover", {}, scene);
								downbuttonhover.scaling = new BABYLON.Vector3(.95, .95, .95);
								downbuttonhover.position = new BABYLON.Vector3(-lenx/2 + .4, lasty, -lenz/2 + .75);
								downbuttonhover.rotation.x = WTW.getRadians(-90);
								downbuttonhover.parent = basemold;
								
								var downbuttontexturehover = new BABYLON.StandardMaterial("mat" + moldname + "-downbuttonhover", scene);
								downbuttontexturehover.emissiveTexture = new BABYLON.Texture("/content/system/images/arrowscrolldown2.jpg", scene);
								downbuttonhover.material = downbuttontexturehover;
								downbuttonhover.material.alpha = 0;
								WTW.registerMouseOver(downbuttonhover);
								once = 1;
							}
						}
						incy -= 1;
					}
				}
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-productLoadCategories=" + ex.message);
	}  
}

wtwshopping.prototype.disposeClean = function(moldname) {
	try {
		if (moldname.indexOf("communitymolds") > -1) {
			var moldnameparts = WTW.getMoldnameParts(moldname);
			WTWShopping.productClearForSearchResults(moldnameparts.cgid, moldnameparts.cgind);
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-disposeClean=" + ex.message);
	}  
}

wtwshopping.prototype.productClearForSearchResults = function(connectinggridid, connectinggridind) {
	try {
		for (var i=0;i<WTW.communityMolds.length;i++) {
			if (WTW.communityMolds[i] != null) {
				if (WTW.communityMolds[i].store != undefined) {
					if (WTW.communityMolds[i].store.allowsearch != undefined) {
						if (WTW.communityMolds[i].store.allowsearch == '1' && WTW.communityMolds[i].connectinggridid == connectinggridid && WTW.communityMolds[i].connectinggridind.toString() == connectinggridind.toString()) {
							WTW.communityMolds[i].store.productid = "";
							WTW.communityMolds[i].store.name = "";
							WTW.communityMolds[i].store.slug = "";
							WTW.communityMolds[i].store.price = "";
							WTW.communityMolds[i].store.categoryid = "";
							WTW.communityMolds[i].store.description = "";
							WTW.communityMolds[i].store.shortdescription = "";
							WTW.communityMolds[i].store.imageid = "";
							WTW.communityMolds[i].store.imageurl = "";
						}	
					}
				}
			}
		}
		for (var i=0;i<WTW.buildingMolds.length;i++) {
			if (WTW.buildingMolds[i] != null) {
				if (WTW.buildingMolds[i].store != undefined) {
					if (WTW.buildingMolds[i].store.allowsearch != undefined) {
						if (WTW.buildingMolds[i].store.allowsearch == '1' && WTW.buildingMolds[i].connectinggridid == connectinggridid && WTW.buildingMolds[i].connectinggridind.toString() == connectinggridind.toString()) {
							WTW.buildingMolds[i].store.productid = "";
							WTW.buildingMolds[i].store.name = "";
							WTW.buildingMolds[i].store.slug = "";
							WTW.buildingMolds[i].store.price = "";
							WTW.buildingMolds[i].store.categoryid = "";
							WTW.buildingMolds[i].store.description = "";
							WTW.buildingMolds[i].store.shortdescription = "";
							WTW.buildingMolds[i].store.imageid = "";
							WTW.buildingMolds[i].store.imageurl = "";
						}	
					}
				}
			}
		}
		for (var i=0;i<WTW.thingMolds.length;i++) {
			if (WTW.thingMolds[i] != null) {
				if (WTW.thingMolds[i].store != undefined) {
					if (WTW.thingMolds[i].store.allowsearch != undefined) {
						if (WTW.thingMolds[i].store.allowsearch == '1' && WTW.thingMolds[i].connectinggridid == connectinggridid && WTW.thingMolds[i].connectinggridind.toString() == connectinggridind.toString()) {
							WTW.thingMolds[i].store.productid = "";
							WTW.thingMolds[i].store.name = "";
							WTW.thingMolds[i].store.slug = "";
							WTW.thingMolds[i].store.price = "";
							WTW.thingMolds[i].store.categoryid = "";
							WTW.thingMolds[i].store.description = "";
							WTW.thingMolds[i].store.shortdescription = "";
							WTW.thingMolds[i].store.imageid = "";
							WTW.thingMolds[i].store.imageurl = "";
						}	
					}
				}
			}
		}
		for (var i=WTWShopping.products.length;i > -1;i--) {
			if (WTWShopping.products[i] != null) {
				if (WTWShopping.products[i].connectinggridid == connectinggridid && WTWShopping.products[i].connectinggridind.toString() == connectinggridind.toString()) {
					WTWShopping.products.splice(i,1);
					i -= 1;
				}	
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-productClearForSearchResults=" + ex.message);
	}  
}

wtwshopping.prototype.productLoadSearchResults = function(moldname, connectinggridid, connectinggridind) {
	try {
		var pi = 0;
		for (var i=0;i<WTW.communityMolds.length;i++) {
			if (WTW.communityMolds[i] != null) {
				if (WTW.communityMolds[i].store != undefined) {
					if (WTW.communityMolds[i].shape == 'storeproduct' && WTW.communityMolds[i].store.allowsearch != undefined && WTW.communityMolds[i].connectinggridid == connectinggridid && WTW.communityMolds[i].connectinggridind.toString() == connectinggridind.toString()) {
						if (WTW.communityMolds[i].store.allowsearch == '1' && WTWShopping.products[pi] != null) {
							WTW.communityMolds[i].store.storeurl = WTWShopping.products[pi].storeurl;
							WTW.communityMolds[i].store.wpplugin = WTWShopping.products[pi].wpplugin;
							WTW.communityMolds[i].store.productid = WTWShopping.products[pi].productid;
							WTW.communityMolds[i].store.name = WTWShopping.products[pi].name;
							WTW.communityMolds[i].store.slug = WTWShopping.products[pi].slug;
							WTW.communityMolds[i].store.price = WTWShopping.products[pi].price;
							WTW.communityMolds[i].store.imageid = WTWShopping.products[pi].imageid;
							WTW.communityMolds[i].store.imageurl = WTWShopping.products[pi].imageurl;
							WTW.communityMolds[i].store.categoryid = WTWShopping.products[pi].categoryid;
							WTW.communityMolds[i].store.description = WTWShopping.products[pi].description;
							WTW.communityMolds[i].store.shortdescription = WTWShopping.products[pi].shortdescription;
							if (pi < WTWShopping.products.length - 1) {
								pi += 1;
							} else {
								pi = 0;
							}
							WTWShopping.setProduct(WTW.communityMolds[i].store.productid + "|" + WTW.communityMolds[i].store.slug, WTW.communityMolds[i].moldname);
						}	
					}
				}
			}
		} 
		if (WTW.buildingMolds != null) {
			if (WTW.buildingMolds != undefined) {
				for (var i=0;i<WTW.buildingMolds.length;i++) {
					if (WTW.buildingMolds[i] != null) {
						if (WTW.buildingMolds[i].store != undefined) {
							if (WTW.buildingMolds[i].shape == 'storeproduct' && WTW.buildingMolds[i].store.allowsearch != undefined && WTW.buildingMolds[i].connectinggridid == connectinggridid && WTW.buildingMolds[i].connectinggridind.toString() == connectinggridind.toString()) {
								if (WTWShopping.products != undefined) {
									if (WTWShopping.products[pi] != null) {
										if (WTW.buildingMolds[i].store.allowsearch == '1' && WTWShopping.products[pi] != null) {
											WTW.buildingMolds[i].store.storeurl = WTWShopping.products[pi].storeurl;
											WTW.buildingMolds[i].store.wpplugin = WTWShopping.products[pi].wpplugin;
											WTW.buildingMolds[i].store.productid = WTWShopping.products[pi].productid;
											WTW.buildingMolds[i].store.name = WTWShopping.products[pi].name;
											WTW.buildingMolds[i].store.slug = WTWShopping.products[pi].slug;
											WTW.buildingMolds[i].store.price = WTWShopping.products[pi].price;
											WTW.buildingMolds[i].store.imageid = WTWShopping.products[pi].imageid;
											WTW.buildingMolds[i].store.imageurl = WTWShopping.products[pi].imageurl;
											WTW.buildingMolds[i].store.categoryid = WTWShopping.products[pi].categoryid;
											WTW.buildingMolds[i].store.description = WTWShopping.products[pi].description;
											WTW.buildingMolds[i].store.shortdescription = WTWShopping.products[pi].shortdescription;
											if (pi < WTWShopping.products.length - 1) {
												pi += 1;
											} else {
												pi = 0;
											}
											WTWShopping.setProduct(WTW.buildingMolds[i].store.productid + "|" + WTW.buildingMolds[i].store.slug, WTW.buildingMolds[i].moldname);
										}	
									}
								}
							} 
						}
					}
				} 
			}
		}
		for (var i=0;i<WTW.thingMolds.length;i++) {
			if (WTW.thingMolds[i] != null) {
				if (WTW.thingMolds[i].store != undefined) {
					if (WTW.thingMolds[i].shape == 'storeproduct' && WTW.thingMolds[i].store.allowsearch != undefined && WTW.thingMolds[i].connectinggridid == connectinggridid && WTW.thingMolds[i].connectinggridind.toString() == connectinggridind.toString()) {
						if (WTW.thingMolds[i].store.allowsearch == '1' && WTWShopping.products[pi] != null) {
							WTW.thingMolds[i].store.storeurl = WTWShopping.products[pi].storeurl;
							WTW.thingMolds[i].store.wpplugin = WTWShopping.products[pi].wpplugin;
							WTW.thingMolds[i].store.productid = WTWShopping.products[pi].productid;
							WTW.thingMolds[i].store.name = WTWShopping.products[pi].name;
							WTW.thingMolds[i].store.slug = WTWShopping.products[pi].slug;
							WTW.thingMolds[i].store.price = WTWShopping.products[pi].price;
							WTW.thingMolds[i].store.imageid = WTWShopping.products[pi].imageid;
							WTW.thingMolds[i].store.imageurl = WTWShopping.products[pi].imageurl;
							WTW.thingMolds[i].store.categoryid = WTWShopping.products[pi].categoryid;
							WTW.thingMolds[i].store.description = WTWShopping.products[pi].description;
							WTW.thingMolds[i].store.shortdescription = WTWShopping.products[pi].shortdescription;
							if (pi < WTWShopping.products.length - 1) {
								pi += 1;
							} else {
								pi = 0;
							}
							WTWShopping.setProduct(WTW.thingMolds[i].store.productid + "|" + WTW.thingMolds[i].store.slug, WTW.thingMolds[i].moldname);
						}	
					}
				}
			}
		} 
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-productLoadSearchResults=" + ex.message);
	}  
}

wtwshopping.prototype.getStoreInfo = function(moldname) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		var zcommunityid = moldnameparts.communityid;
		var zbuildingid = moldnameparts.buildingid;
		var zthingid = moldnameparts.thingid;
		var zstoreinfo = WTWShopping.getStoreID(zcommunityid, zbuildingid, zthingid);
		var buildingname = WTW.getBuildingName(moldnameparts.buildingid);
		if (zstoreinfo.woocommerceapiurl != "" && buildingname == '') {
			var url = zstoreinfo.storeurl + "/walktheweb/storeinfo.php?walktheweb_store_info=1";
			WTW.getJSON(url, 
				function(response) {
					WTWShopping.setStoreInfo(moldname, JSON.parse(response));
				}
			);
		} 
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-getStoreInfo=" + ex.message);
	}  
}

wtwshopping.prototype.setStoreInfo = function(moldname, response) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		for (var i=0;i<response.length;i++) {
			if (response[i] != null) {
				var storename = "";
				if (response[i].storename != undefined) {
					storename = WTW.decode(response[i].storename);
				}
				var titlemold2 = scene.getMeshByID(moldname + "-titleimage2");
				if (titlemold2 != null) {
					try {
						if (titlemold2.material.diffuseTexture != null) {
							titlemold2.material.diffuseTexture.dispose();
							titlemold2.material.diffuseTexture = null;
						}
					} catch(ex) {}
					try {
						if (titlemold2.material != null) {
							titlemold2.material.dispose();
							titlemold2.material = null;
						}
					} catch(ex) {}
					var coveringtitle1 = new BABYLON.StandardMaterial("mat" + moldname + "-titleimage1texture", scene);
					coveringtitle1.alpha = 1;
					coveringtitle1.specularColor = new BABYLON.Color3(.2, .2, .2);
					/* coveringtitle1.emissiveColor = new BABYLON.Color3(1, 1, 1); */
					coveringtitle1.emissiveColor = new BABYLON.Color3(WTW.sun.intensity, WTW.sun.intensity, WTW.sun.intensity);
					coveringtitle1.diffuseColor = new BABYLON.Color3(.9, .9, .9);
					var contentTexture1 = new BABYLON.DynamicTexture(moldname + "-titleimage1texture", {width: 512,height: 512}, scene, true);
					contentTexture1.name = moldname + "-titleimage1texture";
					/* contentTexture1.hasAlpha = true; */
					coveringtitle1.diffuseTexture = contentTexture1;
					coveringtitle1.diffuseTexture.vScale = .5;
					coveringtitle1.diffuseTexture.uScale = 1;
					coveringtitle1.diffuseTexture.vOffset = .55;
					titlemold2.material = coveringtitle1;

					var namelength = WTW.decode(storename).length;
					var lineheigth = "140px";
					var fontheight = "140px";
					if (namelength > 238) {
						lineheigth = "20px";
						fontheight = "20px";
					} else if (namelength > 150) {
						lineheigth = "30px";
						fontheight = "30px";
					} else if (namelength > 70) {
						lineheigth = "40px";
						fontheight = "40px";
					} else if (namelength > 46) {
						lineheigth = "50px";
						fontheight = "42px";
					} else if (namelength > 21) {
						lineheigth = "80px";
						fontheight = "48px";
					} else if (namelength > 18) {
						lineheigth = "120px";
						fontheight = "50px";
					} else if (namelength > 14) {
						lineheigth = "130px";
						fontheight = "60px";
					} else if (namelength > 10) {
						lineheigth = "130px";
						fontheight = "70px";
					} else if (namelength > 6) {
						lineheigth = "120px";
						fontheight = "90px";
					}

					WTW.wrapText(titlemold2, WTW.decode(storename), lineheigth, fontheight, "center", "top", "white", 0, 0);
					i = response.length;
				}
			}
		}
		WTWShopping.productClearFetchProducts(moldname);
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-setStoreInfo=" + ex.message);
	}  
}

wtwshopping.prototype.getCategoriesList = function() {
	try {
		var zstoreinfo = WTWShopping.getStoreID(communityid, buildingid, thingid);
		if (zstoreinfo.woocommerceapiurl != "") {
			WTW.getJSON(zstoreinfo.woocommerceapiurl + "products/categories/?per_page=50&consumer_key=" + atob(zstoreinfo.woocommercekey) + "&consumer_secret=" + atob(zstoreinfo.woocommercesecret), 
				function(zresponse) {
					WTWShopping.loadCategoriesList(JSON.parse(zresponse));
				}
			);
		}
	} catch (ex) { 
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-getCategoriesList=" + ex.message);
	}
}

wtwshopping.prototype.loadCategoriesList = function(zresponse) {
	try {
		WTW.clearOptions("wtw_tcategoryid");
		var option = document.createElement("option");
		option.text = "--- All ---";
		option.value = "";
		if (dGet('wtw_tmoldcategoryid').value == "") {
			option.selected = true;
		}
		dGet("wtw_tcategoryid").add(option);
		for (var i=0;i<zresponse.length;i++) {
			if (zresponse[i] != null) {
				var option = document.createElement("option");
				option.text = zresponse[i].name;
				option.value = zresponse[i].id;
				if (option.value == dGet('wtw_tmoldcategoryid').value) {
					option.selected = true;
				}
				dGet("wtw_tcategoryid").add(option);
			}
		}
	} catch (ex) { 
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-loadCategoriesList=" + ex.message);
	}
}

wtwshopping.prototype.setCategory = function(categoryid) {
	try {
		dGet('wtw_tmoldcategoryid').value = categoryid;
		WTWShopping.getProductsList(categoryid);
	} catch (ex) { 
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-setCategory=" + ex.message);
	}
}

wtwshopping.prototype.getProductsList = function(zcategoryid) {
	try {
		if (zcategoryid == undefined) {
			zcategoryid = "";
		}
		var zstoreinfo = WTWShopping.getStoreID(communityid, buildingid, thingid);
		if (zstoreinfo.woocommerceapiurl != "") {
			var url = zstoreinfo.woocommerceapiurl + "products/?per_page=50&consumer_key=" + atob(zstoreinfo.woocommercekey) + "&consumer_secret=" + atob(zstoreinfo.woocommercesecret);
			if (zcategoryid != "") {
				url = zstoreinfo.woocommerceapiurl + "products/?per_page=50&category=" + zcategoryid + "&consumer_key=" + atob(zstoreinfo.woocommercekey) + "&consumer_secret=" + atob(zstoreinfo.woocommercesecret);
			}
			WTW.getJSON(url, 
				function(zresponse) {
					WTWShopping.loadProductsList(JSON.parse(zresponse));
				}
			);
		}
	} catch (ex) { 
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-getProductsList=" + ex.message);
	}
}

wtwshopping.prototype.loadProductsList = function(zresponse) {
	try {
		WTW.clearOptions("wtw_tproductid");
		var option = document.createElement("option");
		option.text = "--- All ---";
		option.value = "";
		if (dGet('wtw_tmoldproductid').value == "") {
			option.selected = true;
		}
		dGet("wtw_tproductid").add(option);
		for (var i=0;i<zresponse.length;i++) {
			if (zresponse[i] != null) {
				var option = document.createElement("option");
				option.text = zresponse[i].name;
				option.value = zresponse[i].id + "|" + zresponse[i].slug;
				if (zresponse[i].id == dGet('wtw_tmoldproductid').value) {
					option.selected = true;
				}
				dGet("wtw_tproductid").add(option);
			}
		}
	} catch (ex) { 
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-loadProductsList=" + ex.message);
	}
}

wtwshopping.prototype.setAllowSearch = function() {
	try {
		if (dGet('wtw_tallowsearch').checked) {
			dGet('wtw_tmoldallowsearch').value = "1";
		} else {
			dGet('wtw_tmoldallowsearch').value = "0";
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-setAllowSearch=" + ex.message);
	}
}

wtwshopping.prototype.openAddNewMold = function(moldgroup, shape, moldname) {
	try {
		if (shape.toLowerCase() == "storeproduct") {
			WTWShopping.getCategoriesList();
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-openAddNewMold=" + ex.message);
	}
}

wtwshopping.prototype.loadMoldForm = function(moldgroup, shape, moldname) {
	try {
		if (shape.toLowerCase() == "storeproduct") {
			if (WTW.isNumeric(dGet('wtw_tmoldspecial1').value)) {
				WTW.setDDLValue("wtw_tmoldspecial1set", Number(dGet('wtw_tmoldspecial1').value));
			} else {
				WTW.setDDLValue("wtw_tmoldspecial1set", 0);
			}
		}
		if (dGet('wtw_tmoldallowsearch').value == "1") {
			dGet('wtw_tallowsearch').checked = true;
		} else {
			dGet('wtw_tallowsearch').checked = false;
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-loadMoldForm=" + ex.message);
	}
}

wtwshopping.prototype.setMoldFormFields = function(shape) {
	try {
		var shapevalue = shape.toLowerCase();
		while (shapevalue.indexOf(" ") > -1) {
			shapevalue = shapevalue.replace(" ","");
		}
		switch (shapevalue) {
			case "storeproduct":
				dGet('wtw_moldpositiontitle').innerHTML = "Position";
				dGet('wtw_moldscalingtitle').innerHTML = "Length";
				dGet('wtw_moldrotationtitle').innerHTML = "Rotation";
				dGet('wtw_moldtexturetitle').innerHTML = "Frame Image";
				dGet('wtw_bsavethismold').innerHTML = "<u>S</u>ave Product";
				dGet('wtw_bdelmold').innerHTML = "<u>D</u>elete Product";
				dGet('wtw_editmoldformtitle').innerHTML = "Edit Product";
				WTW.hide('wtw_moldaddimagediv');
				WTW.hide('wtw_moldspecial1');
				WTW.hide('wtw_moldspecial2');
				WTW.hide('wtw_moldsubdivisions');
				WTW.hide('wtw_alttagdiv');
				WTW.show('wtw_moldtexturetitle'); 
				WTW.hide('wtw_moldbumptexturetitle');
				WTW.hide('wtw_moldbumptextureset2div');
				WTW.show('wtw_moldtexturepreview');
				WTW.show('wtw_productdiv');
				dGet('wtw_tallowsearch').checked = true;
				break;
			case "storesign":
				dGet('wtw_moldpositiontitle').innerHTML = "Position";
				dGet('wtw_moldscalingtitle').innerHTML = "Length";
				dGet('wtw_moldrotationtitle').innerHTML = "Rotation";
				dGet('wtw_moldtexturetitle').innerHTML = "Frame Image";
				dGet('wtw_bsavethismold').innerHTML = "<u>S</u>ave Sign";
				dGet('wtw_bdelmold').innerHTML = "<u>D</u>elete Sign";
				dGet('wtw_editmoldformtitle').innerHTML = "Edit Sign";
				WTW.hide('wtw_moldaddimagediv');
				WTW.hide('wtw_moldspecial1');
				WTW.hide('wtw_moldspecial2');
				WTW.hide('wtw_moldsubdivisions');
				WTW.hide('wtw_alttagdiv');
				WTW.show('wtw_moldtexturetitle'); 
				WTW.hide('wtw_moldbumptexturetitle');
				WTW.hide('wtw_moldbumptextureset2div');
				WTW.show('wtw_moldtexturepreview');
				dGet('wtw_tallowsearch').checked = true;
				break;
			case "store3dsign":
				dGet('wtw_moldpositiontitle').innerHTML = "3D Text Position";
				dGet('wtw_moldscalingtitle').innerHTML = "3D Text Length";
				dGet('wtw_moldrotationtitle').innerHTML = "3D Text Rotation";
				dGet('wtw_moldtexturetitle').innerHTML = "3D Text Texture Image";
				dGet('wtw_bsavethismold').innerHTML = "<u>S</u>ave 3D Sign";
				dGet('wtw_bdelmold').innerHTML = "<u>D</u>elete 3D Sign";
				dGet('wtw_editmoldformtitle').innerHTML = "Edit 3D Sign";
				WTW.hide('wtw_moldaddimagediv');
				WTW.hide('wtw_alttagdiv');
				WTW.hide('wtw_moldspecial1');
				WTW.hide('wtw_moldspecial2');
				WTW.hide('wtw_moldsubdivisions');
				WTW.hide('wtw_moldbumptexturetitle');
				WTW.hide('wtw_moldbasictexturesetdiv');
				WTW.hide('wtw_moldbasictextureset2div');
				WTW.hide('wtw_moldbumptextureset2div');
				WTW.hide('wtw_moldtexturesetdiv');
				WTW.show('wtw_moldwebtextdiv');
				break;
			case "storeviewcart":
				dGet('wtw_moldpositiontitle').innerHTML = "Position";
				dGet('wtw_moldscalingtitle').innerHTML = "Length";
				dGet('wtw_moldrotationtitle').innerHTML = "Rotation";
				dGet('wtw_moldtexturetitle').innerHTML = "Frame Image";
				dGet('wtw_bsavethismold').innerHTML = "<u>S</u>ave Cart Button";
				dGet('wtw_bdelmold').innerHTML = "<u>D</u>elete Cart Button";
				dGet('wtw_editmoldformtitle').innerHTML = "Edit Cart Button";
				WTW.hide('wtw_moldaddimagediv');
				WTW.hide('wtw_moldspecial1');
				WTW.hide('wtw_moldspecial2');
				WTW.hide('wtw_moldsubdivisions');
				WTW.hide('wtw_alttagdiv');
				WTW.show('wtw_moldtexturetitle'); 
				WTW.hide('wtw_moldbumptexturetitle');
				WTW.hide('wtw_moldbumptextureset2div');
				WTW.show('wtw_moldtexturepreview');
				dGet('wtw_tallowsearch').checked = true;
				break;
			case "storecategories":
				dGet('wtw_moldpositiontitle').innerHTML = "Position";
				dGet('wtw_moldscalingtitle').innerHTML = "Length";
				dGet('wtw_moldrotationtitle').innerHTML = "Rotation";
				dGet('wtw_moldtexturetitle').innerHTML = "Frame Image";
				dGet('wtw_bsavethismold').innerHTML = "<u>S</u>ave Categories";
				dGet('wtw_bdelmold').innerHTML = "<u>D</u>elete Categories";
				dGet('wtw_editmoldformtitle').innerHTML = "Edit Categories";
				WTW.hide('wtw_moldaddimagediv');
				WTW.hide('wtw_moldspecial1');
				WTW.hide('wtw_moldspecial2');
				WTW.hide('wtw_moldsubdivisions');
				WTW.hide('wtw_alttagdiv');
				WTW.show('wtw_moldtexturetitle'); 
				WTW.hide('wtw_moldbumptexturetitle');
				WTW.hide('wtw_moldbumptextureset2div');
				WTW.show('wtw_moldtexturepreview');
				dGet('wtw_tallowsearch').checked = true;
				break;
			case "storesearch":
				dGet('wtw_moldpositiontitle').innerHTML = "Position";
				dGet('wtw_moldscalingtitle').innerHTML = "Length";
				dGet('wtw_moldrotationtitle').innerHTML = "Rotation";
				dGet('wtw_moldtexturetitle').innerHTML = "Frame Image";
				dGet('wtw_bsavethismold').innerHTML = "<u>S</u>ave Search";
				dGet('wtw_bdelmold').innerHTML = "<u>D</u>elete Search";
				dGet('wtw_editmoldformtitle').innerHTML = "Edit Search";
				WTW.hide('wtw_moldaddimagediv');
				WTW.hide('wtw_moldspecial1');
				WTW.hide('wtw_moldspecial2');
				WTW.hide('wtw_moldsubdivisions');
				WTW.hide('wtw_alttagdiv');
				WTW.show('wtw_moldtexturetitle'); 
				WTW.hide('wtw_moldbumptexturetitle');
				WTW.hide('wtw_moldbumptextureset2div');
				WTW.show('wtw_moldtexturepreview');
				dGet('wtw_tallowsearch').checked = true;
				break;
			default:
				WTW.hide('wtw_productdiv');
				WTW.hide('wtw_productthingdiv');
				break;
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-setMoldFormFields=" + ex.message);
	}
}

wtwshopping.prototype.setNewMoldDefaults = function(shape) {
	try {
		var coords = WTW.getNewCoordinates(50);
		var positionX = coords.positionX;
		var positionY = coords.positionY;
		var positionZ = coords.positionZ;
		var rotationY = coords.rotationY;
		var shapevalue = shape.toLowerCase();
		var imageid = "ij7fi8qv7dbgb6zc";
		var imagepath = "/content/system/stock/stucco-512x512.jpg";
		var heightmapid = "dxmbplwoocpg5df3";
		var heightmappath = "/content/system/stock/heightmap-1500x1500.jpg";
		while (shapevalue.indexOf(" ") > -1) {
			shapevalue = shapevalue.replace(" ","");
		}
		if (thingid != '') {
			positionX = 0;
			positionZ = 0;
		}
		switch (shapevalue) {
			case "storeproduct":
				dGet('wtw_tmoldpositionx').value = positionX;
				dGet('wtw_tmoldpositiony').value = positionY;
				dGet('wtw_tmoldpositionz').value = positionZ;
				dGet('wtw_tmoldscalingx').value = "3.00";
				dGet('wtw_tmoldscalingy').value = "5.00";
				dGet('wtw_tmoldscalingz').value = "5.00";
				dGet('wtw_tmoldrotationx').value = "0.00";
				dGet('wtw_tmoldrotationy').value = rotationY;
				dGet('wtw_tmoldrotationz').value = "0.00";
				dGet('wtw_tmoldspecial2').value = "0.00";
				dGet('wtw_tmolduoffset').value = "0.00";
				dGet('wtw_tmoldvoffset').value = "0.00";
				dGet('wtw_tmolduscale').value = "0.00";
				dGet('wtw_tmoldvscale').value = "0.00";
				dGet('wtw_tmoldsubdivisions').value = "12";
				break;
			case "storesign":
				dGet('wtw_tmoldpositionx').value = positionX;
				dGet('wtw_tmoldpositiony').value = positionY;
				dGet('wtw_tmoldpositionz').value = positionZ;
				dGet('wtw_tmoldscalingx').value = "3.00";
				dGet('wtw_tmoldscalingy').value = "10.00";
				dGet('wtw_tmoldscalingz').value = "30.00";
				dGet('wtw_tmoldrotationx').value = "0.00";
				dGet('wtw_tmoldrotationy').value = rotationY;
				dGet('wtw_tmoldrotationz').value = "0.00";
				dGet('wtw_tmoldspecial2').value = "0.00";
				dGet('wtw_tmolduoffset').value = "0.00";
				dGet('wtw_tmoldvoffset').value = "0.00";
				dGet('wtw_tmolduscale').value = "0.00";
				dGet('wtw_tmoldvscale').value = "0.00";
				dGet('wtw_tmoldsubdivisions').value = "12";
				break;			
			case "store3dsign":
				dGet('wtw_tmoldpositionx').value = positionX;
				dGet('wtw_tmoldpositiony').value = positionY-4;
				dGet('wtw_tmoldpositionz').value = positionZ;
				dGet('wtw_tmoldscalingx').value = "1.00";
				dGet('wtw_tmoldscalingy').value = "1.00";
				dGet('wtw_tmoldscalingz').value = "1.00";
				dGet('wtw_tmoldrotationx').value = "0.00";
				dGet('wtw_tmoldrotationy').value = rotationY + 90;
				dGet('wtw_tmoldrotationz').value = "0.00";
				dGet('wtw_tmoldspecial2').value = "0.00";
				dGet('wtw_tmolduoffset').value = "0.00";
				dGet('wtw_tmoldvoffset').value = "0.00";
				dGet('wtw_tmolduscale').value = "0.00";
				dGet('wtw_tmoldvscale').value = "0.00";
				dGet('wtw_tmoldwebtext').value = "Text";
				dGet('wtw_tmoldwebtextheight').value = "6.00";
				dGet('wtw_tmoldwebtextthick').value = "1.00";
				WTW.setDDLValue('wtw_tmoldwebtextalign', "center");
				dGet('wtw_tmoldwebtextcolor').value = "#ff0000";
				dGet('wtw_tmoldwebtextspecular').value = "#000000";
				dGet('wtw_tmoldwebtextdiffuse').value = "#f0f0f0";
				dGet('wtw_tmoldwebtextambient').value = "#808080";
				dGet('wtw_tmoldsubdivisions').value = "12";
				dGet('wtw_tmoldcoveringold').value = "none";
				dGet('wtw_tmoldtextureid').value = imageid;
				dGet('wtw_tmoldtexturepath').value = imagepath;
				WTW.setPreviewImage('wtw_moldtexturepreview', 'wtw_tmoldtexturepath', 'wtw_tmoldtextureid');
				break;
			case "storeviewcart":
				dGet('wtw_tmoldpositionx').value = positionX;
				dGet('wtw_tmoldpositiony').value = positionY;
				dGet('wtw_tmoldpositionz').value = positionZ;
				dGet('wtw_tmoldscalingx').value = "0.25";
				dGet('wtw_tmoldscalingy').value = "1.00";
				dGet('wtw_tmoldscalingz').value = "5.00";
				dGet('wtw_tmoldrotationx').value = "0.00";
				dGet('wtw_tmoldrotationy').value = rotationY;
				dGet('wtw_tmoldrotationz').value = "0.00";
				dGet('wtw_tmoldspecial2').value = "0.00";
				dGet('wtw_tmolduoffset').value = "0.00";
				dGet('wtw_tmoldvoffset').value = "0.00";
				dGet('wtw_tmolduscale').value = "0.00";
				dGet('wtw_tmoldvscale').value = "0.00";
				dGet('wtw_tmoldsubdivisions').value = "12";
				break;			
			case "storecategories":
				dGet('wtw_tmoldpositionx').value = positionX;
				dGet('wtw_tmoldpositiony').value = positionY;
				dGet('wtw_tmoldpositionz').value = positionZ;
				dGet('wtw_tmoldscalingx').value = "1.00";
				dGet('wtw_tmoldscalingy').value = "14.00";
				dGet('wtw_tmoldscalingz').value = "10.00";
				dGet('wtw_tmoldrotationx').value = "0.00";
				dGet('wtw_tmoldrotationy').value = rotationY;
				dGet('wtw_tmoldrotationz').value = "0.00";
				dGet('wtw_tmoldspecial2').value = "0.00";
				dGet('wtw_tmolduoffset').value = "0.00";
				dGet('wtw_tmoldvoffset').value = "0.00";
				dGet('wtw_tmolduscale').value = "0.00";
				dGet('wtw_tmoldvscale').value = "0.00";
				dGet('wtw_tmoldsubdivisions').value = "12";
				break;			
			case "storesearch":
				dGet('wtw_tmoldpositionx').value = positionX;
				dGet('wtw_tmoldpositiony').value = positionY;
				dGet('wtw_tmoldpositionz').value = positionZ;
				dGet('wtw_tmoldscalingx').value = "1.00";
				dGet('wtw_tmoldscalingy').value = "14.00";
				dGet('wtw_tmoldscalingz').value = "10.00";
				dGet('wtw_tmoldrotationx').value = "0.00";
				dGet('wtw_tmoldrotationy').value = rotationY;
				dGet('wtw_tmoldrotationz').value = "0.00";
				dGet('wtw_tmoldspecial2').value = "0.00";
				dGet('wtw_tmolduoffset').value = "0.00";
				dGet('wtw_tmoldvoffset').value = "0.00";
				dGet('wtw_tmolduscale').value = "0.00";
				dGet('wtw_tmoldvscale').value = "0.00";
				dGet('wtw_tmoldsubdivisions').value = "12";
				break;			
		}
		WTW.setDDLValue("wtw_tmoldspecial1set", Number(dGet('wtw_tmoldspecial1').value));
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-setNewMoldDefaults=" + ex.message);
	}
}

wtwshopping.prototype.getStoreID = function(zcommunityid, zbuildingid, zthingid) {
	var zstoreid = "";
	var zstorename = "";
	var zstoreiframes = "0";
	var zstoreurl = "";
	var zstorecarturl = "";
	var zstoreproducturl = "";
	var zwoocommerceapiurl = "";
	var zwoocommercekey = "";
	var zwoocommercesecret = "";
	try {
		if (WTWShopping.stores != null) {
			for (var i=0;i<WTWShopping.stores.length;i++) {
				if (WTWShopping.stores[i] != null) {
					if (WTWShopping.stores[i].storeid != undefined) {
						if (WTWShopping.stores[i].communityid == zcommunityid && WTWShopping.stores[i].buildingid == zbuildingid && WTWShopping.stores[i].thingid == zthingid) {
							zstoreid = WTWShopping.stores[i].storeid;
							zstorename = WTWShopping.stores[i].storename;
							zstoreiframes = WTWShopping.stores[i].storeiframes;
							zstoreurl = WTWShopping.stores[i].storeurl;
							zstorecarturl = WTWShopping.stores[i].storecarturl;
							zstoreproducturl = WTWShopping.stores[i].storeproducturl;
							zwoocommerceapiurl = WTWShopping.stores[i].woocommerceapiurl;
							zwoocommercekey = WTWShopping.stores[i].woocommercekey;
							zwoocommercesecret = WTWShopping.stores[i].woocommercesecret;
						}
					}
				}
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-getStoreID=" + ex.message);
	}
	return {
		'storeid':zstoreid,
		'storename':zstorename,
		'storeiframes':zstoreiframes,
		'storeurl':zstoreurl,
		'storecarturl':zstorecarturl,
		'storeproducturl':zstoreproducturl,
		'woocommerceapiurl':zwoocommerceapiurl,
		'woocommercekey':zwoocommercekey,
		'woocommercesecret':zwoocommercesecret
	};
}

wtwshopping.prototype.checkStoreID = function(zcommunityid, zbuildingid, zthingid) {
	var zfound = false;
	try {
		if (WTWShopping.stores != null) {
			for (var i=0;i<WTWShopping.stores.length;i++) {
				if (WTWShopping.stores[i] != null) {
					if (WTWShopping.stores[i].storeid != undefined) {
						if (WTWShopping.stores[i].communityid == zcommunityid && WTWShopping.stores[i].buildingid == zbuildingid && WTWShopping.stores[i].thingid == zthingid) {
							zfound = true;
						}
					}
				}
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-checkStoreID=" + ex.message);
	}
	return zfound;
}

wtwshopping.prototype.loadConnectingGrids = function(zconnectinggridind, zcommunityid, zbuildingid, zthingid) {
	try {
		if (WTWShopping.checkStoreID(zcommunityid, zbuildingid, zthingid) == false) {
			WTW.getJSON("/connect/wtw-shopping-getconnectstore.php?communityid=" + zcommunityid + "&buildingid=" + zbuildingid + "&thingid=" + zthingid, 
				function(zresponse) {
					zresponse = JSON.parse(zresponse);
					if (zresponse != null) {
						for (var i=0;i<zresponse.length;i++) {
							if (zresponse[i] != null) {
								if (zresponse[i].storeid != undefined) {
									var storesind = WTWShopping.stores.length;
									WTWShopping.stores[storesind] = {
										'connectid':zresponse[i].connectid,
										'communityid':zresponse[i].communityid,
										'buildingid':zresponse[i].buildingid,
										'thingid':zresponse[i].thingid,
										'storeid':zresponse[i].storeid,
										'storename':zresponse[i].storename,
										'storeiframes':zresponse[i].storeiframes,
										'storeurl':zresponse[i].storeurl,
										'storecarturl':zresponse[i].storecarturl,
										'storeproducturl':zresponse[i].storeproducturl,
										'woocommerceapiurl':zresponse[i].woocommerceapiurl,
										'woocommercekey':zresponse[i].woocommercekey,
										'woocommercesecret':zresponse[i].woocommercesecret
									};
								}
							}
						}
					}
					
				}
			); 
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-loadConnectingGrids=" + ex.message);
	}
}

wtwshopping.prototype.getMoldProduct = function(moldname) {
	var moldnameparts = WTW.getMoldnameParts(moldname);
	try {
		WTW.getJSON("/connect/wtw-shopping-getmold.php?moldid=" + moldnameparts.moldid, 
			function(zresponse) {
				zresponse = JSON.parse(zresponse);
				if (zresponse != null) {
					if (zresponse.length > 0) {
						for (var i=0;i<zresponse.length;i++) {
							if (zresponse[i] != null) {
								if (zresponse[i].shoppingmoldid != undefined) {
									if (moldnameparts.molds[moldnameparts.moldind] != null) {
										if (moldnameparts.molds[moldnameparts.moldind].store == undefined) {
											var zstoreinfo = WTWShopping.getStoreID(moldnameparts.communityid, moldnameparts.buildingid, moldnameparts.thingid);
											moldnameparts.molds[moldnameparts.moldind].store = {
												'storeurl':zstoreinfo.storeurl,
												'wpplugin':'walktheweb',
												'storeiframes':zstoreinfo.storeiframes,
												'search':'',
												'productid':zresponse[i].productid,
												'name':'',
												'slug':zresponse[i].slug,
												'price':'',
												'categoryid':zresponse[i].categoryid,
												'description':'',
												'shortdescription':'',
												'imageid':'',
												'imageurl':'',
												'allowsearch':zresponse[i].allowsearch
											};
										} else {
											moldnameparts.molds[moldnameparts.moldind].store.productid = zresponse[i].productid;
											moldnameparts.molds[moldnameparts.moldind].store.categoryid = zresponse[i].categoryid;
											moldnameparts.molds[moldnameparts.moldind].store.slug = zresponse[i].slug;
											moldnameparts.molds[moldnameparts.moldind].store.allowsearch = zresponse[i].allowsearch;
										}
										if (WTW.adminView == 1 && dGet('wtw_tmoldname').value != '') {
											dGet('wtw_tmoldslug').value = zresponse[i].slug;
											//WTW.setDDLValue('wtw_tproductid', zresponse[i].productid);
											//WTW.setDDLValue('wtw_tcategoryid', zresponse[i].categoryid);
											if (zresponse[i].allowsearch == '1') {
												dGet('wtw_tallowsearch').checked = true;
											} else {
												dGet('wtw_tallowsearch').checked = false;
											}
											dGet('wtw_tmoldcategoryid').value = zresponse[i].categoryid;
											dGet('wtw_tmoldproductid').value = zresponse[i].productid;
											WTWShopping.getCategoriesList();
											WTWShopping.getProductsList(zresponse[i].categoryid);
										}
										WTWShopping.setProduct(zresponse[i].productid + "|" + zresponse[i].slug, moldname);
									}
								}
							}
						}
					} else {
						WTWShopping.getMoldProduct(moldname);
					}
				}
				
			}
		); 		
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-getMoldProduct=" + ex.message);
	}
}

wtwshopping.prototype.openMoldForm = function(moldname, molds, moldind, shape) {
	try {
		var zstoreinfo = WTWShopping.getStoreID(communityid, buildingid, thingid);
		if (zstoreinfo.storeid != "") {
			WTWShopping.getMoldProduct(moldname);
			if (shape == "store3dsign" && molds[moldind] != null) {
				dGet('wtw_tmoldwebtext').value = molds[moldind].webtext.webtext;
				dGet('wtw_tmoldwebstyle').value = molds[moldind].webtext.webstyle;
				var webstyle = dGet('wtw_tmoldwebstyle').value;
				var webtextalign = 'center';
				var webtextheight = 6;
				var webtextthick = 1;
				var webtextcolor = '#ff0000';
				var webtextdiffuse = '#f0f0f0';
				var webtextspecular = '#000000';
				var webtextambient = '#808080';
				if (webstyle.indexOf(',') > -1) {
					while (webstyle.indexOf('"') > -1) {
						webstyle = webstyle.replace('"','');
					}
					while (webstyle.indexOf('}') > -1) {
						webstyle = webstyle.replace('}','');
					}
					while (webstyle.indexOf('{') > -1) {
						webstyle = webstyle.replace('{','');
					}
					webstyle = webstyle.replace('colors:diffuse','diffuse');
					var styles = webstyle.split(',');
					for (var i=0;i<styles.length;i++) {
						if (styles[i].indexOf(':') > -1) {
							style = styles[i].split(':');
							switch (style[0]) {
								case 'anchor':
									webtextalign = style[1];
									break;
								case 'letter-height':
									webtextheight = Number(style[1]).toFixed(2);
									break;
								case 'letter-thickness':
									webtextthick = Number(style[1]).toFixed(2);
									break;
								case 'color':
									webtextcolor = style[1];
									break;
								case 'diffuse':
									webtextdiffuse = style[1];
									break;
								case 'specular':
									webtextspecular = style[1];
									break;
								case 'ambient':
									webtextambient = style[1];
									break;
							}
						}
					}
				}
				WTW.setDDLValue("wtw_tmoldwebtextalign", webtextalign);
				dGet('wtw_tmoldwebtextheight').value = webtextheight;
				dGet('wtw_tmoldwebtextthick').value = webtextthick;
				dGet('wtw_tmoldwebtextcolor').value = webtextcolor;
				dGet('wtw_tmoldwebtextdiffuse').value = webtextdiffuse;
				dGet('wtw_tmoldwebtextspecular').value = webtextspecular;
				dGet('wtw_tmoldwebtextambient').value = webtextambient;
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-openMoldForm=" + ex.message);
	}
}

wtwshopping.prototype.submitMoldForm = function(w) {
	try {
		switch (w) {
			case 0: /* delete mold */
				var zrequest = {
					'communityid':dGet('wtw_tcommunityid').value,
					'buildingid':dGet('wtw_tbuildingid').value,
					'thingid':dGet('wtw_tthingid').value,
					'moldid':dGet('wtw_tmoldid').value
				};
				/* function for after iframe loads */
				var onload = function(ipage) {
					ipage.getElementById('wtw_tcommunityid').value = zrequest.communityid;
					ipage.getElementById('wtw_tbuildingid').value = zrequest.buildingid;
					ipage.getElementById('wtw_tthingid').value = zrequest.thingid;
					ipage.getElementById('wtw_tmoldid').value = zrequest.moldid;
					ipage.getElementById('wtw_bdeletemold').click();
				}
				/* iframe src, onload function */
				var iframe = WTW.createIFrame('/core/iframes/wtwshopping_stores.php', onload);	
				break;
			case -1: /* cancel edit */
				
				break;
			default: /* save mold */
				var zallowsearch = "0";
				if (dGet('wtw_tallowsearch').checked) {
					zallowsearch = "1";
				}
				var zrequest = {
					'communityid':dGet('wtw_tcommunityid').value,
					'buildingid':dGet('wtw_tbuildingid').value,
					'thingid':dGet('wtw_tthingid').value,
					'moldid':dGet('wtw_tmoldid').value,
					'slug':dGet('wtw_tmoldslug').value,
					'productid':dGet('wtw_tproductid').value,
					'categoryid':dGet('wtw_tcategoryid').value,
					'allowsearch':zallowsearch
				};
				/* function for after iframe loads */
				var onload = function(ipage) {
					ipage.getElementById('wtw_tcommunityid').value = zrequest.communityid;
					ipage.getElementById('wtw_tbuildingid').value = zrequest.buildingid;
					ipage.getElementById('wtw_tthingid').value = zrequest.thingid;
					ipage.getElementById('wtw_tmoldid').value = zrequest.moldid;
					ipage.getElementById('wtw_tmoldslug').value = zrequest.slug;
					ipage.getElementById('wtw_tproductid').value = zrequest.productid;
					ipage.getElementById('wtw_tcategoryid').value = zrequest.categoryid;
					ipage.getElementById('wtw_tallowsearch').value = zrequest.allowsearch;
					ipage.getElementById('wtw_bsavemold').click();
				}
				/* iframe src, onload function */
				var iframe = WTW.createIFrame('/core/iframes/wtwshopping_stores.php', onload);	
				break;
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-submitMoldForm=" + ex.message);
	}
}

wtwshopping.prototype.productGetProduct = function(moldname) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		if (moldnameparts.shape == "storeproduct") {
			var found = false;
			var fetch = false;
			if (moldnameparts.molds[moldnameparts.moldind] != null && moldnameparts.cgid != '' && moldnameparts.cgind > -1) {
				if (WTWShopping.products != null) {
					for (var i=WTWShopping.products.length;i > -1 ;i--) {
						if (WTWShopping.products[i] != null) {
							if (WTWShopping.products[i].fetching == "0" && WTWShopping.products[i].connectinggridind.toString() == moldnameparts.cgind.toString() && WTWShopping.products[i].connectinggridid == moldnameparts.cgid) {
								moldnameparts.molds[moldnameparts.moldind].store.storeurl = WTWShopping.products[i].storeurl;
								moldnameparts.molds[moldnameparts.moldind].store.wpplugin = WTWShopping.products[i].wpplugin;
								moldnameparts.molds[moldnameparts.moldind].store.productid = WTWShopping.products[i].productid;
								moldnameparts.molds[moldnameparts.moldind].store.name = WTWShopping.products[i].name;
								moldnameparts.molds[moldnameparts.moldind].store.slug = WTWShopping.products[i].slug;
								moldnameparts.molds[moldnameparts.moldind].store.price = WTWShopping.products[i].price;
								moldnameparts.molds[moldnameparts.moldind].store.imageid = WTWShopping.products[i].imageid;
								moldnameparts.molds[moldnameparts.moldind].store.imageurl = WTWShopping.products[i].imageurl;
								moldnameparts.molds[moldnameparts.moldind].store.categoryid = WTWShopping.products[i].categoryid;
								moldnameparts.molds[moldnameparts.moldind].store.description = WTWShopping.products[i].description;
								moldnameparts.molds[moldnameparts.moldind].store.shortdescription = WTWShopping.products[i].shortdescription;
								WTWShopping.products.splice(i,1);
								found = true;
								i = WTWShopping.products.length;
							} else if (WTWShopping.products[i].fetching == "1" && WTWShopping.products[i].connectinggridind.toString() == moldnameparts.cgind.toString() && WTWShopping.products[i].connectinggridid == moldnameparts.cgid) {
								fetch = true;
								/* i = WTWShopping.products.length; */
							}
						}
					}
				}
				if (found == false) {
					if (fetch == false) {
						var newproductind = WTWShopping.products.length;
						WTWShopping.products[newproductind] = WTWShopping.newProduct();
						WTWShopping.products[newproductind].connectinggridind = moldnameparts.cgind.toString();
						WTWShopping.products[newproductind].connectinggridid = moldnameparts.cgid;
						WTWShopping.products[newproductind].search = "";
						WTWShopping.products[newproductind].fetching = "1";
						WTWShopping.productFetchProducts(moldname,'');
					}
					window.setTimeout(function() {
						WTWShopping.productGetProduct(moldname);
					}, 100);
				} else {
					WTWShopping.setProduct(moldnameparts.molds[moldnameparts.moldind].store.productid + "|" + moldnameparts.molds[moldnameparts.moldind].store.slug, moldname);
				} 
			}
		} 
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-productGetProduct=" + ex.message);
	}  
}

wtwshopping.prototype.setProduct = function(product, moldname) {
	try {
		var moldnameparts = WTW.getMoldnameParts(moldname);
		var zcommunityid = moldnameparts.communityid;
		var zbuildingid = moldnameparts.buildingid;
		var zthingid = moldnameparts.thingid;
		var zstoreinfo = WTWShopping.getStoreID(zcommunityid, zbuildingid, zthingid);
		var found = false;
		var productid = "";
		var slug = "";
		if (product.indexOf("|") > -1) {
			var productinfo = product.split('|');
			productid = productinfo[0];
			slug = productinfo[1];
		} else {
			productid = product;
		}
		if (WTW.adminView == 1) {
			dGet('wtw_tmoldproductid').value = productid;
			dGet('wtw_tmoldslug').value = slug;
		}
		if (moldnameparts.molds[moldnameparts.moldind] != undefined) {
			if (moldnameparts.molds[moldnameparts.moldind] != null) {
				if (moldnameparts.molds[moldnameparts.moldind].store == undefined) {
					moldnameparts.molds[moldnameparts.moldind].store = {
						'storeurl':zstoreinfo.storeurl,
						'wpplugin':'walktheweb',
						'productid':productid,
						'allowsearch':zstoreinfo.allowsearch,
						'name':'',
						'slug':slug,
						'price':'',
						'imageid':'',
						'imageurl':'',
						'categoryid':'',
						'description':'',
						'shortdescription':''
					}
				}
			}

		
			if (zstoreinfo.woocommerceapiurl != "" && found == false) {
				WTW.getJSON(zstoreinfo.woocommerceapiurl + "products/" + productid + "/?consumer_key=" + atob(zstoreinfo.woocommercekey) + "&consumer_secret=" + atob(zstoreinfo.woocommercesecret), 
					function(response) {
						response = JSON.parse(response);
						var imageurl = '';
						if (response.images != undefined) {
							if (response.images[0] != null) {
								if (imageurl = response.images[0].src != undefined) {
									imageurl = response.images[0].src;
								}
							}
						}
						moldnameparts.molds[moldnameparts.moldind].store.name = response.name;
						moldnameparts.molds[moldnameparts.moldind].store.slug = slug;
						moldnameparts.molds[moldnameparts.moldind].store.price = response.price;
						moldnameparts.molds[moldnameparts.moldind].store.imageid = response.imageid;
						moldnameparts.molds[moldnameparts.moldind].store.imageurl = response.imageurl;
						moldnameparts.molds[moldnameparts.moldind].store.description = response.description;
						moldnameparts.molds[moldnameparts.moldind].store.shortdescription = response.shortdescription;
						WTWShopping.loadProductDisplay(moldname, response.name, response.price, productid, slug, imageurl, response.short_description, response.description);
					}
				);
			}
		}
	} catch (ex) { 
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-setProduct=" + ex.message);
	}
}

wtwshopping.prototype.clearEditMold = function() {
	try {
		dGet('wtw_tmoldproductid').value = "";
		dGet('wtw_tmoldslug').value = "";
		dGet('wtw_tmoldcategoryid').value = "";
		dGet('wtw_tmoldallowsearch').value = "1";
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-clearEditMold=" + ex.message);
	}
}

wtwshopping.prototype.checkHovers = function(moldname, shape) {
	try {
		if (shape == 'storeproduct') {
			if (WTW.currentID.indexOf("descimage1") > -1) {
				var descimage1 = scene.getMeshByID(moldname + "-descimage1");
				if (descimage1 != null) {
					if (descimage1.material != undefined) {
						descimage1.material.alpha = .70;
					}
				}
			}
			if (WTW.currentID.indexOf("descimage2") > -1) {
				var descimage2 = scene.getMeshByID(moldname + "-descimage2");
				if (descimage2 != null) {
					if (descimage2.material != undefined) {
						descimage2.material.alpha = .70;
					}
				}
			}
			if (WTW.currentID.indexOf("addtocart1") > -1) {
				var addtocart1 = scene.getMeshByID(moldname + "-addtocart1");
				if (addtocart1 != null) {
					if (addtocart1.material != undefined) {
						addtocart1.material.alpha = 0;
					}
				}
			}
			if (WTW.currentID.indexOf("addtocart2") > -1) {
				var addtocart2 = scene.getMeshByID(moldname + "-addtocart2");
				if (addtocart2 != null) {
					if (addtocart2.material != undefined) {
						addtocart2.material.alpha = 0;
					}
				}
			}
			if (WTW.currentID.indexOf("readmore1") > -1) {
				var readmore1 = scene.getMeshByID(moldname + "-readmore1");
				if (readmore1 != null) {
					if (readmore1.material != undefined) {
						readmore1.material.alpha = 0;
					}
				}
			}
			if (WTW.currentID.indexOf("readmore2") > -1) {
				var readmore2 = scene.getMeshByID(moldname + "-readmore2");
				if (readmore2 != null) {
					if (readmore2.material != undefined) {
						readmore2.material.alpha = 0;
					}
				}
			}
		} else if (WTW.currentID.indexOf("carthover") > -1) {
			var carthover = scene.getMeshByID(moldname + "-carthover");
			if (carthover != null) {
				if (carthover.material != undefined) {
					carthover.material.alpha = 1;
				}
			}
		} else if (WTW.currentID.indexOf("storecategories") > -1) {
			if (WTW.currentID.indexOf("categorybuttonhover") > -1) {
				var categoryhover = scene.getMeshByID(WTW.currentID);
				if (categoryhover != null) {
					if (categoryhover.material != undefined) {
						categoryhover.material.alpha = 1;
					}
				}
			}
			if (WTW.currentID.indexOf("downbuttonhover") > -1) {
				var downbuttonhover = scene.getMeshByID(WTW.currentID);
				if (downbuttonhover != null) {
					if (downbuttonhover.material != undefined) {
						downbuttonhover.material.alpha = 1;
					}
				}
			}
			if (WTW.currentID.indexOf("upbuttonhover") > -1) {
				var upbuttonhover = scene.getMeshByID(WTW.currentID);
				if (upbuttonhover != null) {
					if (upbuttonhover.material != undefined) {
						upbuttonhover.material.alpha = 1;
					}
				}
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-checkHovers=" + ex.message);
	}
}

wtwshopping.prototype.resetHovers = function(moldname, shape) {
	try {
		if (shape == 'storeproduct') {
			if (WTW.lastID.indexOf("descimage1") > -1) {
				var descimage1 = scene.getMeshByID(moldname + "-descimage1");
				if (descimage1 != null) {
					if (descimage1.material != undefined) {
						descimage1.material.alpha = 0;
					}
				}
			}
			if (WTW.lastID.indexOf("descimage2") > -1) {
				var descimage2 = scene.getMeshByID(moldname + "-descimage2");
				if (descimage2 != null) {
					if (descimage2.material != undefined) {
						descimage2.material.alpha = 0;
					}
				}
			}
			if (WTW.lastID.indexOf("addtocart1") > -1) {
				var addtocart1 = scene.getMeshByID(moldname + "-addtocart1");
				if (addtocart1 != null) {
					if (addtocart1.material != undefined) {
						addtocart1.material.alpha = 1;
					}
				}
			}
			if (WTW.lastID.indexOf("addtocart2") > -1) {
				var addtocart2 = scene.getMeshByID(moldname + "-addtocart2");
				if (addtocart2 != null) {
					if (addtocart2.material != undefined) {
						addtocart2.material.alpha = 1;
					}
				}
			}
			if (WTW.lastID.indexOf("readmore1") > -1) {
				var readmore1 = scene.getMeshByID(moldname + "-readmore1");
				if (readmore1 != null) {
					if (readmore1.material != undefined) {
						readmore1.material.alpha = 1;
					}
				}
			}
			if (WTW.lastID.indexOf("readmore2") > -1) {
				var readmore2 = scene.getMeshByID(moldname + "-readmore2");
				if (readmore2 != null) {
					if (readmore2.material != undefined) {
						readmore2.material.alpha = 1;
					}
				}
			}
		} else if (WTW.lastID.indexOf("carthover") > -1) {
			var carthover = scene.getMeshByID(moldname + "-carthover");
			if (carthover != null) {
				if (carthover.material != undefined) {
					carthover.material.alpha = 0;
				}
			}
		} else if (WTW.lastID.indexOf("storecategories") > -1) {
			if (WTW.lastID.indexOf("categorybuttonhover") > -1) {
				var categoryhover = scene.getMeshByID(WTW.lastID);
				if (categoryhover != null) {
					if (categoryhover.material != undefined) {
						categoryhover.material.alpha = 0;
					}
				}
			}
			if (WTW.lastID.indexOf("downbuttonhover") > -1) {
				var downbuttonhover = scene.getMeshByID(WTW.lastID);
				if (downbuttonhover != null) {
					if (downbuttonhover.material != undefined) {
						downbuttonhover.material.alpha = 0;
					}
				}
			}
			if (WTW.lastID.indexOf("upbuttonhover") > -1) {
				var upbuttonhover = scene.getMeshByID(WTW.lastID);
				if (upbuttonhover != null) {
					if (upbuttonhover.material != undefined) {
						upbuttonhover.material.alpha = 0;
					}
				}
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-resetHovers=" + ex.message);
	}
}

wtwshopping.prototype.openColorSelector = function(zmoldname, zshape, colortype) {
	try {
		switch (colortype) {
			case "diffuse":
				if (zshape == "storeproduct") {
					WTW.setColor(zmoldname + "-imageframe", 'diffuse', dGet('wtw_tdiffusecolorr').value, dGet('wtw_tdiffusecolorg').value, dGet('wtw_tdiffusecolorb').value);
				}
				break;
			case "specular":
				if (zshape == "storeproduct") {
					WTW.setColor(zmoldname + "-imageframe", 'specular', dGet('wtw_tspecularcolorr').value, dGet('wtw_tspecularcolorg').value, dGet('wtw_tspecularcolorb').value);
				}
				break;
			case "emissive":
				if (zshape == "storeproduct") {
					WTW.setColor(zmoldname + "-imageframe", 'emissive', dGet('wtw_temissivecolorr').value, dGet('wtw_temissivecolorg').value, dGet('wtw_temissivecolorb').value);
				}
				break;
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-openColorSelector=" + ex.message);
	}
}

wtwshopping.prototype.setNewMold = function(moldname, molds, moldind, rebuildmold) {
	try {
		if (molds[moldind] != null) {
			if (molds[moldind].shape == "store3dsign") {
				var webname = "Store Name";
				var foundname = WTW.getNameFromConnectingGrid(molds[moldind].communityinfo.communityid);
				if (foundname != "") {
					webname = foundname;
				}
				if (molds[moldind].webtext.webtext != webname) {
					molds[moldind].webtext.webtext = webname;
					rebuildmold = 1;
				}
				if (dGet('wtw_tmoldwebtextheight').value == '' || WTW.isNumeric(dGet('wtw_tmoldwebtextheight').value) == false) {
					dGet('wtw_tmoldwebtextheight').value = 6;
				}
				if (dGet('wtw_tmoldwebtextthick').value == '' || WTW.isNumeric(dGet('wtw_tmoldwebtextthick').value) == false) {
					dGet('wtw_tmoldwebtextthick').value = 1;
				}
				if (dGet('wtw_tmoldwebtextcolor').value == '') {
					dGet('wtw_tmoldwebtextcolor').value = '#ff0000';
				}
				if (dGet('wtw_tmoldwebtextdiffuse').value == '') {
					dGet('wtw_tmoldwebtextdiffuse').value = '#f0f0f0';
				}
				if (dGet('wtw_tmoldwebtextspecular').value == '') {
					dGet('wtw_tmoldwebtextspecular').value = '#000000';
				}
				if (dGet('wtw_tmoldwebtextambient').value == '') {
					dGet('wtw_tmoldwebtextambient').value = '#808080';
				}
				if (molds[moldind].webtext.webstyle != undefined) {
					dGet('wtw_tmoldwebstyle').value = "{\"anchor\":\"" + dGet('wtw_tmoldwebtextalign').options[dGet('wtw_tmoldwebtextalign').selectedIndex].value + "\",\"letter-height\":" + dGet('wtw_tmoldwebtextheight').value + ",\"letter-thickness\":" + dGet('wtw_tmoldwebtextthick').value + ",\"color\":\"" + dGet('wtw_tmoldwebtextcolor').value + "\",\"alpha\":" + opacity/100 + ",\"colors\":{\"diffuse\":\"" + dGet('wtw_tmoldwebtextdiffuse').value + "\",\"specular\":\"" + dGet('wtw_tmoldwebtextspecular').value + "\",\"ambient\":\"" + dGet('wtw_tmoldwebtextambient').value + "\",\"emissive\":\"" + dGet('wtw_tmoldwebtextcolor').value + "\"}}";
					if (molds[moldind].webtext.webstyle != dGet('wtw_tmoldwebstyle').value) {
						molds[moldind].webtext.webstyle = dGet('wtw_tmoldwebstyle').value;
						rebuildmold = 1;
					}
				}
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-setNewMold=" + ex.message);
	}
	return rebuildmold;
}

wtwshopping.prototype.moldQueueAdd = function(moldname, mold) {
	try {
		if (WTW.adminView == 1) {
			if (moldname.indexOf("storeproduct") > -1) {
				if (mold.actionManager != null) {
					mold.actionManager.unregisterAction(WTW.mouseOver);
					mold.actionManager.unregisterAction(WTW.mouseOut);
				}
			}
		}
	} catch (ex) {
		WTW.log("plugins:wtw-shopping:scripts-wtwshopping.js-moldQueueAdd=" + ex.message);
	}
}
