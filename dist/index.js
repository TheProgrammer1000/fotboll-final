"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const path = './config.json';
app.get('/fetch-leagues', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const config = {
        method: 'get',
        url: 'https://v3.football.api-sports.io/leagues',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'id': '39',
            'season': '2024'
        }
    };
    try {
        const response = yield (0, axios_1.default)(config);
        fs_1.default.writeFile(path, JSON.stringify(response.data), (error) => {
            if (error) {
                console.error('An error has occurred', error);
                res.status(500).send('Error writing data to file');
                return;
            }
            console.log('Data written successfully to disk');
            res.send('Data fetched and written successfully');
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from API');
    }
}));
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});
const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
