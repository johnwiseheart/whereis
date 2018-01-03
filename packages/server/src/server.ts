import * as Koa from "koa";
import * as Router from "koa-router";
import * as koaBody from "koa-body";
import fetch from "node-fetch";
import * as cors from "@koa/cors";
import { IDevice, ISimpleDevice, ICoordinates, UnitType, IDarkSkyDay } from "../../common/types";


const app = new Koa();
const router = new Router();
app.use(koaBody());
app.use(cors());

const APPLE_USERNAME = process.env.WHEREIS_USERNAME
const APPLE_PASSWORD = process.env.WHEREIS_PASSWORD
const TIMEZONE_KEY = process.env.WHEREIS_TIMEZONE_KEY;
const DARKSKY_KEY = process.env.WHEREIS_DARKSKY_KEY;
const GEOCODE_KEY = process.env.WHEREIS_GEOCODE_KEY;

const DEVICE_API_URL = "https://fmipmobile.icloud.com/fmipservice/device/" + APPLE_USERNAME + "/initClient"

const TIMEZONE_API_URL = ({latitude, longitude}: ICoordinates) => {
    const timestamp = Math.floor(Date.now() / 1000)
    return `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${TIMEZONE_KEY}`
}

const DARKSKY_API_URL = ({latitude, longitude}: ICoordinates, units: UnitType) => {
    return `https://api.darksky.net/forecast/${DARKSKY_KEY}/${latitude},${longitude}?units=${units}`
}

const GEOCODE_API_URL = ({latitude, longitude}: ICoordinates) => {
    return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GEOCODE_KEY}`
}

const getSimpleDevice = (device: IDevice) => ({
    id: device.id.substring(0, 8),
    name: device.modelDisplayName,
    coordinates: {
        latitude: Math.round(device.location.latitude * 10) / 10,
        longitude:  Math.round(device.location.longitude * 10) / 10,
    }
})

router.get("/devices", async (ctx) => {
    const response = await fetch(DEVICE_API_URL, {
        method: "POST",
        headers: {
            Authorization: "Basic " + new Buffer(APPLE_USERNAME + ":" + APPLE_PASSWORD).toString("base64")
        }
    })
    const data = await response.json();
    ctx.body = data.content
        .filter((device: IDevice) => device.location)
        .map(getSimpleDevice);
});

router.get("/location", async (ctx) => {
    const { latitude, longitude } = ctx.request.query;
    const response = await fetch(GEOCODE_API_URL({latitude, longitude}))
    const data = await response.json();
    ctx.body = { location: data.results[5].formatted_address }
});

router.get("/timezone", async (ctx) => {
    const { latitude, longitude } = ctx.request.query;
    const response = await fetch(TIMEZONE_API_URL({latitude, longitude}))
    const data = await response.json();
    ctx.body = { timeZoneId: data.timeZoneId }
});

router.get("/weather", async (ctx) => {
    const { latitude, longitude, units } = ctx.request.query;
    const response = await fetch(DARKSKY_API_URL({latitude, longitude}, units))
    const data = await response.json();
    console.log(data)
    ctx.body = {
        currently: data.currently.temperature,
        daily: data.daily.data.map((day: IDarkSkyDay) => ({
            high: day.temperatureHigh,
            low: day.temperatureLow,
            icon: day.icon,
        })).slice(0, 3),
    }
});

app.use(router.routes());

app.listen(5000);
console.log("Server running on port 5000");