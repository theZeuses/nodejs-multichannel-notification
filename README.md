### This project gives an idea on how multichannel notifications (both synchronously, and using queue) can be integrated with a nodejs application. The code is written while keeping various Software Design Principle (Readability, Re-useability, DRY, SOLID, KISS etc) in mind. Though only email channel has been implemented, but surely you can follow along easily since it is written in TypeScript and well documented and do the rest accordingly. As I have used redis for queue, so Job's part has been covered automatically.

# steps to run the project
1. Install and configure redis if not already configured in your machine
2. CREATE a .env file on root folder and COPY the content from .env.example
3. ADD your redis credentials in .env file
4. RUN npm install
6. RUN npx notification-catcher to receive the notification on 1080 port of your machine
5. RUN npm test

## commands
### to receive notification inside browser during development keep this command running
npx notification-catcher


