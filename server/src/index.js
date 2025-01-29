import { app } from "./app.js";

import { config } from "dotenv";
config({ path: "../.env" });


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Servidor iniciado en: http://localhost:${PORT}`);
});
