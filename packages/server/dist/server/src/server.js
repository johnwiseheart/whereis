"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
const koaBody = require("koa-body");
const node_fetch_1 = require("node-fetch");
const cors = require("@koa/cors");
const app = new Koa();
const router = new Router();
app.use(koaBody());
app.use(cors());
const APPLE_USERNAME = process.env.WHEREIS_USERNAME;
const APPLE_PASSWORD = process.env.WHEREIS_PASSWORD;
const TIMEZONE_KEY = process.env.WHEREIS_TIMEZONE_KEY;
const DARKSKY_KEY = process.env.WHEREIS_DARKSKY_KEY;
const GEOCODE_KEY = process.env.WHEREIS_GEOCODE_KEY;
const DEVICE_API_URL = "https://fmipmobile.icloud.com/fmipservice/device/" + APPLE_USERNAME + "/initClient";
const TIMEZONE_API_URL = ({ latitude, longitude }) => {
    const timestamp = Math.floor(Date.now() / 1000);
    return `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${TIMEZONE_KEY}`;
};
const DARKSKY_API_URL = ({ latitude, longitude }, units) => {
    return `https://api.darksky.net/forecast/${DARKSKY_KEY}/${latitude},${longitude}?units=${units}`;
};
const GEOCODE_API_URL = ({ latitude, longitude }) => {
    return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GEOCODE_KEY}`;
};
const getSimpleDevice = (device) => ({
    id: device.id.substring(0, 8),
    name: device.modelDisplayName,
    coordinates: {
        latitude: Math.round(device.location.latitude * 10) / 10,
        longitude: Math.round(device.location.longitude * 10) / 10,
    }
});
router.get("/devices", (ctx) => __awaiter(this, void 0, void 0, function* () {
    const response = yield node_fetch_1.default(DEVICE_API_URL, {
        method: "POST",
        headers: {
            Authorization: "Basic " + new Buffer(APPLE_USERNAME + ":" + APPLE_PASSWORD).toString("base64")
        }
    });
    const data = yield response.json();
    ctx.body = data.content
        .filter((device) => device.location)
        .map(getSimpleDevice);
}));
router.get("/location", (ctx) => __awaiter(this, void 0, void 0, function* () {
    const { latitude, longitude } = ctx.request.query;
    const response = yield node_fetch_1.default(GEOCODE_API_URL({ latitude, longitude }));
    const data = yield response.json();
    console.log(data);
    ctx.body = { location: data.results[5].formatted_address };
}));
router.get("/timezone", (ctx) => __awaiter(this, void 0, void 0, function* () {
    const { latitude, longitude } = ctx.request.query;
    const response = yield node_fetch_1.default(TIMEZONE_API_URL({ latitude, longitude }));
    const data = yield response.json();
    console.log(data);
    ctx.body = { timeZoneId: data.timeZoneId };
}));
router.get("/weather", (ctx) => __awaiter(this, void 0, void 0, function* () {
    const { latitude, longitude, units } = ctx.request.query;
    const response = yield node_fetch_1.default(DARKSKY_API_URL({ latitude, longitude }, units));
    const data = yield response.json();
    console.log(data);
    ctx.body = {
        currently: data.currently.temperature,
        daily: data.daily.data.map((day) => ({
            high: day.temperatureHigh,
            low: day.temperatureLow,
            icon: day.icon,
        })).slice(0, 3),
    };
}));
app.use(router.routes());
app.listen(5000);
console.log("Server running on port 5000");
//# sourceMappingURL=server.js.map