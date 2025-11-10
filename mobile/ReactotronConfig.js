import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({
        name: "Do Not Stop Mobile",
    })
    .useReactNative({
        asyncStorage: true,
        networking: {
            ignoreUrls: /symbolicate/,
        },
        editor: false,
        errors: { veto: (stackFrame) => false },
        overlay: false,
    })
    .connect();

