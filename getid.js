var itemid;
var modelid;
var shopid;
var name;
var flashSale;
var upcomingFlashSale

// Start measuring
startCheckId = Date.now();

// Get csrf token
var csrf = document.cookie.split(`; root_csrftoken=`).pop().split(';').shift();

function getId() {
	let url = window.location.href;
	let urlArray = url.split('.');
	let ids = urlArray.slice(-2);
	url = `https://shopee.co.id/api/v2/item/get?itemid=${ids[1]}&shopid=${ids[0]}`;

	let headers = {
		accept: '*/*',
		'accept-language': 'en-US,en;q=0.9,id;q=0.8',
		'if-none-match-': '55b03-39f6814e77fe44df4d72fbd80695bd5a',
		'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
		'sec-ch-ua-mobile': '?0',
		'sec-fetch-dest': 'empty',
		'sec-fetch-mode': 'cors',
		'sec-fetch-site': 'same-site',
		'x-api-source': 'rweb',
		'x-api-src-list': 'rweb,lite',
		'x-requested-with': 'XMLHttpRequest',
		'x-shopee-language': 'id',
	}

	return new Promise(function (resolve, reject) {
		fetch(url, {
			headers: headers,
			referrer: 'https://lite.shopee.co.id/',
			referrerPolicy: 'strict-origin-when-cross-origin',
			body: null,
			method: 'GET',
			mode: 'cors',
			credentials: 'include',
		})
			.then(function (res) {
				return res.json();
			})
			.then(function (data) {
				resolve(data);
			})
			.catch(function (err) {
				reject(err);
			});
	});
}

var pushId = async function () {
	console.clear(); // clear the console
	try {
		let result = await getId();
		console.log(result)
		console.timeEnd('Exec Time');
		let item = result.item;
		let models = item.models;

		// passing data
		itemid = item.itemid;
		shopid = item.shopid;
		modelid = models[0].modelid;
		name = item.name;
		flashSale = item.flash_sale;
		upcomingFlashSale = item.upcoming_flash_sale;

		console.log(item.name);
		console.log(itemid);
		console.log(shopid);
		console.log(modelid);
		console.log(models.length);
		console.log(models);
		console.log(flashSale);
		console.log(upcomingFlashSale);
	} catch(err) {
		console.log(err);
	}

	console.log(`end ${Date.now() - startCheckId}`);
}

// Running
pushId();