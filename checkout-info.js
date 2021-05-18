var coInfoStart = Date.now();

function checkoutInfo() {
    let url = 'https://shopee.co.id/api/v2/checkout/shopee_lite/get';
    let headers = {
        accept: "application/json",
        "accept-language": "en-US,en;q=0.9,id;q=0.8",
        "content-type": "application/json",
        "if-none-match-": "55b03-6b0322ad09ba6046a8128d8de2866dfe",
        "sec-ch-ua":
          '"Google Chrome";v="89", "Chromium";v="89", ";Not\\"A\\\\Brand";v="99"',
        "sec-ch-ua-mobile": "?1",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-api-source": "rweb",
        "x-api-src-list": "rweb,lite",
        "x-csrftoken": csrf,
        "x-cv-id": "9",
        "x-requested-with": "XMLHttpRequest",
        "x-shopee-language": "id",
    }
    let reqBody = '{"shoporders":[{"shop":{"shopid": '+ shopid +'},"items":[{"itemid": '+ itemid +',"modelid": '+ modelid +',"quantity":1}],"logistics":{"recommended_channelids":null},"selected_preferred_delivery_time_slot_id":null}],"selected_payment_channel_data":{},"promotion_data":{"free_shipping_voucher_info":{},"platform_vouchers":[],"shop_vouchers":[],"check_shop_voucher_entrances":true,"auto_apply_shop_voucher":true},"device_info":{"device_id":"","device_fingerprint":"","tongdun_blackbox":"","buyer_payment_info":{}},"cart_type":1,"client_id":3,"tax_info":{"tax_id":""}}';

    return new Promise(function (resolve, reject) {
        fetch(url, {
            headers: headers,
            referrer: "https://lite.shopee.co.id/",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: reqBody,
            method: "POST",
            mode: "cors",
            credentials: "include",
        })
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                console.log(data);
                // console.log(data.shipping_orders[0].fulfillment_info);
                resolve(data.checkout_price_data);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}


var run = async function () {
    console.clear();
    console.log('[status] Checking payment info at');
    try {
        let priceData = await checkoutInfo();
        console.log(priceData);
    } catch(err) {
        console.log(err);
    }
    console.log(`Execution time: ${Date.now() - coInfoStart}`);
}();