# URL Shortener

A simple URL shortener service that converts long URLs into short, shareable links. This project is built using Node.js, Express, and MongoDB.

## Features
- Shorten long URLs into short links.
- Redirect users to the original URL when accessing the short link.
- Track the number of clicks on each short URL.
- Get your previously shortened Urls
- Analyse the usage of most common urls and compare clicks

## Prerequisites
- [Node.js](https://nodejs.org/) installed on your system.
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/url-shortener.git
   cd url-shortener
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-address>/shortener?retryWrites=true&w=majority
   BASE_URL=http://localhost:8000
   PORT=8000
   ```
   Replace `<username>`, `<password>`, and `<cluster-address>` with your MongoDB credentials.

4. **Whitelist Your IP Address**
   - Log in to your [MongoDB Atlas dashboard](https://www.mongodb.com/cloud/atlas).
   - Add your IP address to the Network Access whitelist.

5. **Start the Server**
   ```bash
   npm start
   ```
   The server will start at `http://localhost:8000`.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
