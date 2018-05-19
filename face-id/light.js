const KasaControl = require('kasa_control')
const kasa = new KasaControl()

// [options.hue]	number		0-360
// [options.saturation]	number		0-100
// [options.brightness]	number		0-100
// [options.color_temp]	number		Kelvin (LB120:2700-6500 LB130:2500-9000)

const colorMap = {
    andy: {
        "hue":172,
        "saturation":68,
        "brightness":58,
        "color_temp": 0
    },
    daniel: {
        "hue":29,
        "saturation":100,
        "brightness":78,
        "color_temp": 1000
    }
}

main = async function(name) {
 await kasa.login('craklyn@gmail.com', 'fountainPW')
 const devices = await kasa.getDevices()
 console.log(devices);

 const color = colorMap[name];
 console.log(color)
 try {  
    await kasa.power(devices[0].deviceId, true, 1000, color);
 } catch (e) {
    console.log(e);
 }
}

exports.changeColor = main;