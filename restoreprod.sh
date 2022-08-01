sed -i 's/\/\/import path/import path/g' ./server/app.ts
sed -i 's/\/\/import fs/import fs/g' ./server/app.ts

sed -i 's/\/\/import React/import React/g' ./server/app.ts
sed -i 's/\/\/import ReactDOMServer/import ReactDOMServer/g' ./server/app.ts

sed -i 's/\/\/import App/import App/g' ./server/app.ts
sed -i 's/\/\/import SnackbarContextProvider/import SnackbarContextProvider/g' ./server/app.ts
sed -i 's/\/\/import ConfigContextProvider/import ConfigContextProvider/g' ./server/app.ts

sed -i 's/\/\/app.set("view engine"/app.set("view engine"/g' ./server/app.ts
sed -i 's/\/\/app.set("views"/app.set("views"/g' ./server/app.ts
sed -i 's/\/\/app.use("\/"/app.use("\/"/g' ./server/app.ts

sed -i 's=/\*const=const=g' ./server/app.ts
sed -i 's/\*\/ \/\/const assets/const assets/g' ./server/app.ts

sed -i 's=/\*app.get=app.get=g' ./server/app.ts
sed -i 's/*\/ app.post("\/create"/app.post("\/create"/g' ./server/app.ts