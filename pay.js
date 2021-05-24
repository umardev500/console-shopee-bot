var fulfillment;

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
                resolve(data);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}


var run = async function () {
    var coInfoStart = Date.now();
    console.clear(); // clear the console
    console.log('[info] Starting');
    try {
        let data = await checkoutInfo();
        let priceData = data.checkout_price_data;
        let isError = data.error;
        console.log(data)

        // if is error then reloading action
        if (isError !== undefined) {
            // run(); // reload
            console.log(`Error type: ${isError}`);
            console.log('C1: Reloading actions');
        } else {
            let merchandiseSubtotal = priceData.merchandise_subtotal;
            let totalPayable = priceData.total_payable;
            let fulfillmentInfo = data.shipping_orders[0].fulfillment_info;
            let shippingSubtotal = priceData.shipping_subtotal;
            let coTimestamp = data.timestamp;
            order(merchandiseSubtotal, totalPayable, fulfillmentInfo, shippingSubtotal, coTimestamp);
        }

    } catch(err) {
        run(); // reload
        console.log(err);
        console.log('C2: Reloading actions');
    }
    console.log(`Co Info Execution time: ${Date.now() - coInfoStart}`);
};

run();

startTime = setInterval(function () {
    console.log(new Date().getSeconds())

    if ((new Date().getSeconds()) == '00') {
        pushId();
        clearInterval(startTime);
    }
}, 100);

// Order section
function asyncOrder(price, payable, fulfillmentInfo, shippingSubtotal, coTimestamp) {

    let url = 'https://shopee.co.id/api/v2/checkout/shopee_lite/place_order';
    let headers = {
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9,id;q=0.8',
        'content-type': 'application/json',
        'if-none-match-': '55b03-5d880a19445d0d175d563affc1ddd5d3',
        'sec-ch-ua':
            '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'x-api-source': 'rweb',
        'x-api-src-list': 'rweb,lite',
        'x-csrftoken': csrf,
        'x-cv-id': '103',
        'x-requested-with': 'XMLHttpRequest',
        'x-shopee-language': 'id',
        'x-track-id': 'ac7ab54a128456d149c5de941b10d5c0b1babf8bf1efc408901f7a02585e7dbe69066256e37102c28b6fd25ff06a58ea6f2d9e0f7d49c850a33deee04e60a58c',
    };

    let reqBody = '{"status":200,"headers":{},"cart_type":1,"shipping_orders":[{"selected_logistic_channelid":8003,"cod_fee":0,"order_total":'+ payable +',"shipping_id":1,"shopee_shipping_discount_id":414118,"selected_logistic_channelid_with_warning":null,"shipping_fee_discount":0,"shipping_group_description":"Dikelola Shopee | Dikemas dan Dikirim Shopee","selected_preferred_delivery_time_option_id":0,"buyer_remark":"","buyer_address_data":{"tax_address":"","error_status":"","address_type":0,"addressid":67001493},"order_total_without_shipping":'+ price +',"tax_payable":0,"amount_detail":{"BASIC_SHIPPING_FEE":'+ shippingSubtotal +',"SELLER_ESTIMATED_INSURANCE_FEE":0,"SHOPEE_OR_SELLER_SHIPPING_DISCOUNT":-'+ shippingSubtotal +',"VOUCHER_DISCOUNT":0,"SHIPPING_DISCOUNT_BY_SELLER":0,"SELLER_ESTIMATED_BASIC_SHIPPING_FEE":0,"SHIPPING_DISCOUNT_BY_SHOPEE":'+ shippingSubtotal +',"INSURANCE_FEE":0,"ITEM_TOTAL":'+ payable +',"TAX_EXEMPTION":0,"shop_promo_only":true,"COD_FEE":0,"TAX_FEE":0,"SELLER_ONLY_SHIPPING_DISCOUNT":0},"buyer_ic_number":"","fulfillment_info": '+JSON.stringify(fulfillmentInfo)+',"voucher_wallet_checking_channel_ids":[8003],"shoporder_indexes":[0],"shipping_fee":'+ shippingSubtotal +',"tax_exemption":0,"shipping_group_icon":"https://cf.shopee.co.id/file/bcb4e84dd6d7003f5cfa154abc2fb34f"}],"disabled_checkout_info":{"auto_popup":false,"description":"","error_infos":[]},"timestamp":'+ coTimestamp +',"checkout_price_data":{"shipping_subtotal":'+ shippingSubtotal +',"shipping_discount_subtotal":0,"shipping_subtotal_before_discount":'+ shippingSubtotal +',"bundle_deals_discount":null,"group_buy_discount":0,"merchandise_subtotal":'+ payable +',"tax_payable":0,"buyer_txn_fee":0,"credit_card_promotion":null,"promocode_applied":null,"shopee_coins_redeemed":null,"total_payable":'+payable+',"tax_exemption":0},"client_id":3,"promotion_data":{"promotion_msg":"","shop_vouchers":[],"price_discount":0,"can_use_coins":true,"voucher_info":{"coin_earned":0,"promotionid":0,"discount_percentage":0,"discount_value":0,"voucher_code":null,"reward_type":0,"coin_percentage":0,"used_price":0},"coin_info":{"coin_offset":16300000,"coin_earn":0,"coin_earn_by_voucher":0,"coin_used":163},"free_shipping_voucher_info":{"free_shipping_voucher_id":null,"disabled_reason":null,"free_shipping_voucher_code":""},"applied_voucher_code":null,"shop_voucher_entrances":[{"status":false,"shopid":'+shopid+'}],"card_promotion_enabled":false,"invalid_message":null,"card_promotion_id":null,"voucher_code":null,"use_coins":false,"platform_vouchers":[]},"dropshipping_info":{"phone_number":"","enabled":false,"name":""},"selected_payment_channel_data":{"channel_id":8001400,"version":2,"text_info":{}},"shoporders":[{"shop":{"remark_type":0,"support_ereceipt":false,"images":"","is_official_shop":false,"cb_option":true,"shopid":'+shopid+',"shop_name":"MissYang.id"},"buyer_remark":"","shipping_fee":'+ shippingSubtotal +',"order_total":'+ payable +',"shipping_id":1,"buyer_ic_number":"","items":[{"itemid":'+itemid+',"is_add_on_sub_item":false,"image":"a27fb417c76438ce49c141499bccefaa","shopid":'+shopid+',"opc_extra_data":{"slash_price_activity_id":0},"promotion_id":97504,"add_on_deal_id":0,"modelid":'+modelid+',"offerid":0,"source":"IDG","checkout":true,"item_group_id":0,"service_by_shopee_flag":true,"none_shippable_full_reason":"","price":'+ payable +',"is_flash_sale":false,"categories":[{"catids":[40,10392,12651]}],"shippable":true,"name":"'+ name +'","none_shippable_reason":"","is_pre_order":false,"stock":0,"model_name":"44MM","quantity":1}],"selected_preferred_delivery_time_option_id":0,"selected_logistic_channelid":8003,"cod_fee":0,"tax_payable":0,"buyer_address_data":{"tax_address":"","error_status":"","address_type":0,"addressid":67001493},"shipping_fee_discount":0,"tax_info":{"use_new_custom_tax_msg":false,"custom_tax_msg":"","custom_tax_msg_short":"","remove_custom_tax_hint":false},"order_total_without_shipping":'+ payable +',"tax_exemption":0,"amount_detail":{"BASIC_SHIPPING_FEE":'+ shippingSubtotal +',"COD_FEE":0,"SHOPEE_OR_SELLER_SHIPPING_DISCOUNT":-'+ shippingSubtotal +',"VOUCHER_DISCOUNT":0,"SHIPPING_DISCOUNT_BY_SELLER":0,"SELLER_ESTIMATED_INSURANCE_FEE":0,"SELLER_ESTIMATED_BASIC_SHIPPING_FEE":0,"SHIPPING_DISCOUNT_BY_SHOPEE":'+ shippingSubtotal +',"INSURANCE_FEE":0,"ITEM_TOTAL":'+ payable +',"TAX_EXEMPTION":0,"shop_promo_only":true,"TAX_FEE":0,"SELLER_ONLY_SHIPPING_DISCOUNT":0},"ext_ad_info_mappings":[]}],"can_checkout":true,"order_update_info":{"selected_order_update_channel_id":2,"order_update_options":[{"icon":"https://shopee.co.id/static/images/order_updates/whatsapp_logo.jpg","id":2,"name":"Whatsapp"},{"icon":"https://shopee.co.id/static/images/order_updates/sms_icon.jpg","id":1,"name":"SMS"}]},"buyer_txn_fee_info":{"learn_more_url":"","description":"Besar biaya penanganan adalah Rp 0 dari total transaksi.","title":"Biaya Penanganan"},"captcha_version":1}';

    return new Promise(function (resolve, reject) {
        fetch(url, {
            headers: headers,
            referrer: 'https://lite.shopee.co.id/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: reqBody,
            method: 'POST',
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
                resolve(err);
            });
    });
}

async function order(price, payable, fulfillmentInfo, shippingSubtotal, coTimestamp) {
    let payStart = Date.now();
    let lastPriceStr = '50.000';
    let lastPrice = parseInt(lastPriceStr.replace('.', '') + '00000');

    // If price less than flash sale price
    // then start ordering else reloading
    if (price < lastPrice) {
        console.log('[status] Starting order');
        try {
            let result = await asyncOrder(price, payable, fulfillmentInfo, shippingSubtotal, coTimestamp);
            console.log(result);
        } catch(err) {
            console.log(err);
            console.log('C3: Reloading actions');
            run(); // reload
        }
        console.log(`Pay execution time: ${Date.now() - payStart}`);
        console.log('[status] Done');
    } else {
        run(); // reload
        console.log('C4: Reloading actions');
        console.log(`[info] is not flash sale price (${price})`)
    }
}