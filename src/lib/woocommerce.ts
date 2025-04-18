import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL as string, // Asegúrate de definir esta variable en .env
  consumerKey: process.env.NEXT_PUBLIC_CONSUMER_KEY as string,
  consumerSecret: process.env.NEXT_PUBLIC_CONSUMER_SECRET as string,
  version: "wc/v3"
});

export default api;
