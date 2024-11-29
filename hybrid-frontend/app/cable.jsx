import { createConsumer } from "@rails/actioncable";
import { WS_URL } from "@env";

const CableApp = {
  cable: createConsumer(WS_URL),
};

export default CableApp;