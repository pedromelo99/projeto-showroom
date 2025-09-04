import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const port = process.env.PORT || 4000;

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API showroom ouvindo em http://localhost:${port}`);
});


