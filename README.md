# CoffreTonDoc 🔐

CoffreTonDoc is an online vault that includes client-side file encryption and connection with Ethereum accounts. Authentication relies on your Ethereum wallet's security and [SIWE](https://github.com/spruceid/siwe). This platform is fully anonymous and free to use (once it is hosted somewhere... 😅).

> Feel free to support me financially if you can to quickly provide a host 💰

## TODO LIST

> This is a WIP

-   Make the uncrypt working when download the file from s3 : for now, I can upload a crypted file to S3 but when i Download it back, it is not the same size, looks like Minio corrupts file ...
-   Add screenshots to the README
-   Optimize the arborescence loading by prefetching the next layer
-   Try to make the search work using [this awesome thing](https://github.com/tantaraio/voy) or much simplier [this](https://github.com/krisk/Fuse)
-   Enhance with TOTP?

Feel free to reach out if you have any questions or need further assistance!

**Did you know that ...** `CoffreTonDoc` stands for the French `Coffre Ton Document`, which means `put your document in a safe`?
