# Dynamic React Native + Expo Example App

Welcome to the Dynamic React Native + Expo Example App! This repository contains a simple application demonstrating how to integrate the Dynamic product with React Native using Expo.

## Requirements

To run this example app locally, you'll need to have Node.js installed, as well as npm (Node Package Manager). Additionally, you must install Expo CLI. For detailed setup instructions, please visit the [Expo installation guide](https://docs.expo.dev/get-started/installation/).

You will also need a Dynamic account. If you don't have one yet, you can sign up for free at [Dynamic](https://dynamic.xyz/).
With an account created, you can create a new project and obtain the environment ID, which you will need to initialize the Dynamic client in the example app.
You will also need to enable the SMS and/or Email Login options to have a login method available in the example app.

## Installation

Follow these steps to get the app up and running:

1. **Set Up Your Environment**

   Prepare your development environment for React Native by following the official setup guide: [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment).

2. **Clone the repository:**

   ```bash
   git clone https://github.com/dynamic-labs/react-native-expo.git
   cd react-native-expo
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **(Optional) Configure a `.env` File with Your Dynamic Environment ID:**

   ```bash
   EXPO_PUBLIC_ENVIRONMENT_ID=<dynamic project environment id>
   ```

5. **Start the application:**

   iOS

   ```bash
   npm run ios
   ```

   Android

   ```bash
   npm run android
   ```

This will start the Expo CLI server, and you can open the app on your device using the Expo Go app, or in a web browser.

For further development, you may find the following files relevant:

- dynamic client initialization: `src/client.ts`
- HomeView: `src/Home/Home.tsx`
- LoginView: `src/LoginView/LoginView.tsx`
- DisplayAuthenticatedUserView: `src/DisplayAuthenticatedUserView/DisplayAuthenticatedUserView.tsx`

## Troubleshooting

Having trouble running the iOS simulator?
Check out the [iOS Troubleshooting](./docs/ios-troubleshooting.md) guide.

If you're seeing any errors when trying to run the app, first make sure it isn't due to expo packages version compatibility issues by running the following command:

```bash
npx expo install --check
```

## Documentation

For more detailed information on integrating Dynamic with React Native, please refer to our official documentation: [Dynamic React Native Integration](https://docs.dynamic.xyz/react-native/introduction).

Thank you for trying out our example app!
