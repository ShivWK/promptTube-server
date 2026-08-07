import { Supadata } from "@supadata/js";

const supadata = new Supadata({
    apiKey: process.env.SUPADATA_API_KEY,
});

export default supadata;

