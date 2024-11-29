# Entrega 2.2

Para probar la app seguir instrucciones 1, 4 y 5 de este [github](https://github.com/icc4203-202420/ngrok-tutorial?tab=readme-ov-file) para abrir ngrok.

- crear cuenta en ngrok
- abrir una terminal y escribir

  `ngrok http 3001`

- crear un archivo .env dentro de hybrid-frontend con el url dado por ngrok en la sección Forwarding

  `NGROK_URL= https://74a0-201-189-82-148.ngrok-free.app`

## Comandos de terminal

### hybrid-frontend

`npm install`

`npm install -g eas-cli`

`eas init`

Colocar las credenciales pedidas (mismas credenciales de la cuenta de expo)

`npm start`

### backend

`bundle install`

`yarn install`

`rails db:drop db:create db:migrate db:seed`

`rails s -b '0.0.0.0' -p '3001'`

Luego de esto escanear el QR dado por Expo (para una mejor experiencia: escanear con un iPad y tenerlo vertical)

## Consideraciones

- Luego de hacer un submit de un review, para que se muestre en la sección de todos los reviews, hacer click en el botón de Back y volver a la misma página
