import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.urlAPI as string, // Asegúrate de definir esta variable en .env
  consumerKey: process.env.CONSUMER_KEY as string,
  consumerSecret: process.env.CONSUMER_SECRET as string,
  version: "wc/v3"
});

export default api;
