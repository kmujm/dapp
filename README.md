# Click Challenge (Smart Contract)

## Contract Info

- Test Network: Seporia
- Contract Address: 0x7d5503Df86FC8A956F85cC444F541CCE38a655df

## Game Rules

- entry fee: 0.0002 ether
- 10% of the entry fee goes to the contract owner
- 90% of the entry fee goes to the winner
- the winner is the person who get highest score
- the winner can withdraw the prize money
- the game will be reset every 7 days

## Flow

- 게임 참여자수, 1등 상금, 게임 마감까지 남은 시간, 1등의 닉네임/점수/지갑 주소 등이 표시된다.
- 해당 데이터는 아래와 같은 함수를 통해 가져온다.
  - getNumberOfPlayers()
  - getWinnerPrize()
  - getGameEndTime()
  - getWinner()
- getAllInfo() 함수를 통해 한번에 가져올 수도 있다.
- 게임을 참여하기 위해서는 닉네임을 입력한 후 참가비를 지불해야 한다.
- 참가비를 정상적으로 지불했다면 "Game Start" 버튼이 활성화 된다.
- 원을 누르고 있는 시간동안 점수가 증가한다.
- 게임이 끝나면 본인의 점수가 블록체인에 기록된다.
- 게임 시간이 마감되면 "정산 후 게임 생성" 버튼이 활성화 된다.
- "정산 후 게임 생성" 버튼을 누르면 상금이 정산되며 게임을 다시 시작할 수 있게 된다.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
