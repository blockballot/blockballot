# BlockBallot
A decentralized voting platform built on the Ethereum Testnet

## Mission
> BlockBallot provides a secure, electronic way to establish a chain of custody - a chronological paper trail - that traces the data that each voter contributes to an election. And because BlockBallot is built on the Ethereum network, election data is publicly accessible and verifiable by a network of peers. (Please note that BlockBallot is in early production and currently operates on the public Rinkeby Testnet. The app will be refactored to operate on the official network in the future).

## Dependencies
```
    "axios": "^0.18.0",
    "bcrypt": "^1.0.3",
    "body-parser": "^1.18.2",
    "chart.js": "^1.1.1",
    "cookie-parser": "^1.4.3",
    "crypto-js": "^3.1.9-1",
    "dotenv": "^5.0.1",
    "enzyme": "^3.3.0",
    "enzyme-adapter-react-16": "^1.1.1",
    "express": "^4.16.3",
    "express-session": "^1.15.6",
    "globalize": "^1.3.0",
    "jest": "^22.4.3",
    "jquery": "^3.3.1",
    "material-ui": "^0.20.0",
    "moment": "^2.22.0",
    "mysql": "^2.15.0",
    "mysql2": "^1.5.3",
    "nodemailer": "^4.6.3",
    "random-number": "0.0.9",
    "random-words": "^1.0.0",
    "react": "^16.2.0",
    "react-chartjs": "^1.2.0",
    "react-cookie": "^1.0.5",
    "react-copy-to-clipboard": "^5.0.1",
    "react-csv-reader": "^0.2.2",
    "react-datepicker": "^1.2.2",
    "react-dom": "^16.2.0",
    "react-loading-overlay": "^0.3.0",
    "react-router": "^4.2.0",
    "react-router-dom": "^4.2.2",
    "react-spinners": "^0.2.6",
    "react-widgets": "^4.2.6",
    "react-widgets-globalize": "^5.0.5",
    "react-widgets-moment": "^4.0.12",
    "scrollreveal": "^3.4.0",
    "semantic-ui-css": "^2.3.1",
    "semantic-ui-react": "^0.78.3",
    "sequelize": "^4.37.1",
    "shimmer": "^1.2.0",
    "solc": "^0.4.21",
    "web3": "^0.20.6"
```

## Dev Dependencies
```
    "babel": "^6.23.0",
    "babel-cli": "^6.26.0",
    "babel-core": "^6.26.0",
    "babel-jest": "^22.4.3",
    "babel-loader": "^7.1.4",
    "babel-preset-env": "^1.6.1",
    "babel-preset-react": "^6.24.1",
    "babel-register": "^6.26.0",
    "chai": "^4.1.2",
    "cheerio": "^1.0.0-rc.2",
    "css-loader": "^0.28.11",
    "eslint": "^4.19.1",
    "eslint-config-airbnb": "^16.1.0",
    "eslint-plugin-import": "^2.9.0",
    "eslint-plugin-jsx-a11y": "^6.0.3",
    "eslint-plugin-react": "^7.7.0",
    "file-loader": "^1.1.11",
    "jsdom": "^9.11.0",
    "json-loader": "^0.5.7",
    "mocha": "^5.0.4",
    "nodemon": "^1.17.3",
    "react-test-renderer": "^16.2.0",
    "style-loader": "^0.20.3",
    "supertest": "^3.0.0",
    "url-loader": "^1.0.1",
    "webpack": "^4.1.1",
    "webpack-cli": "^2.0.12"
 ```
 
## Blockchain Setup

0. Install homebrew at https://brew.sh/
1. Install geth:
`brew tap ethereum/ethereum`
`brew install ethereum`
2. `npm run geth-server` to connect to the ethereum testnet
3. Wait for blockchain to finish syncing
4. In order to verify if the blockchain is done syncing, you can open a geth console with `geth attach data/geth.ipc` and run `eth.syncing`. This command should return 'false' once it's done syncing
5. Create a wallet by running personal.newAccount('passphrase')
6. Using the wallet address from the previous command, obtain money on the ethereum testnet by going to the faucet: https://faucet.rinkeby.io/

## Local Development Setup

1. `npm install`
2. `npm run server-dev`
3. `npm run react-dev`
4. Ensure you have mySQL installed globally and running
5. Ensure geth server is running (see above)
6. If you want to use nodemailer service, enter gmail info in the .env file
7. setup .env variables with your wallet address and password
  - BC_ACCOUNT=(wallet address here)
  - BC_PASSWORD=(password here)
  - EMAIL_PASSWORD=(email password here)
  - EMAIL_ACCOUNT=(email address)
8. Navigate to localhost:3000

